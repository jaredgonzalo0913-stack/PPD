
import chokidar from "chokidar";
import { execFile } from "node:child_process";

let timer;
let publishing = false;
let pending = false;

function run(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

async function publish() {
  if (publishing) {
    pending = true;
    return;
  }

  publishing = true;

  try {
    console.log("Checking production build...");
    await run("npm.cmd", ["run", "build"]);

    await run("git", ["add", "src", "public", "package.json", "package-lock.json", "index.html"]);

   const changes = await run("git", ["diff", "--cached", "--name-only"]);
if (!changes.trim()) {
  console.log("No staged changes to publish.");
  return;
}

    await run("git", ["commit", "-m", "Auto-publish saved website changes"]);
    await run("git", ["push", "origin", "main"]);

    console.log("Published to GitHub. Vercel should deploy automatically.");
  } catch (error) {
    console.error("Publishing stopped:", error.message);
  } finally {
    publishing = false;

    if (pending) {
      pending = false;
      clearTimeout(timer);
      timer = setTimeout(publish, 60000);
    }
  }
}

console.log("Watching for saved changes. Publishing after 60 seconds of inactivity.");

chokidar
  .watch(["src", "public", "package.json", "package-lock.json", "index.html"], {
    ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 1500, pollInterval: 100 },
  })
  .on("all", (event, path) => {
    console.log(`Detected ${event}: ${path}`);
    clearTimeout(timer);
    timer = setTimeout(publish, 60000);
  });

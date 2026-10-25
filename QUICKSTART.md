# 🚀 QUICK START GUIDE

## Installation & Setup (2 minutes)

### Step 1: Open Terminal
Open PowerShell or Command Prompt in the project folder

### Step 2: Install Dependencies
```powershell
npm install
```

This downloads all required packages. **First time only** - takes 1-2 minutes.

### Step 3: Start Development Server
```powershell
npm run dev
```

Your browser will open automatically at `http://localhost:3000`

## 🎯 What to Explore First

### 1. **Home Page** (Already loaded)
- Read the introduction
- Click "Enter 3D Engine Lab" or "Start Learning"
- Understand the learning journey concept

### 2. **Learning Modules** 📚
- Click "Modules" in navigation
- Open "Module 01 — Introduction to ME-C Engines"
- Read the first lesson
- Take the quiz to see how it works

### 3. **Component Library** 📋
- Click "Components"
- Browse the 14 ME-C components
- Click a component to see detailed information
- Notice the category filtering

### 4. **Progress Dashboard** 📊
- Click "Progress"
- See your learning statistics
- View achievements (they unlock as you progress)
- Check component exploration stats

### 5. **System Explorer** 🔗
- Click "System Explorer"
- See how components connect in system flows
- Understand the control architecture

### 6. **3D Engine Lab** ⚙️
- Click "3D Engine Lab"
- See the control panel
- Try different view modes
- Toggle auto-rotation

### 7. **Assessments** ✅
- Click "Assessments"
- See all available quizzes
- Understand assessment types

## 🎓 Complete a Full Learning Loop (10 minutes)

1. **Learn**: Go to Modules → Module 01 → Lesson 1
   - Read: "What is an ME-C Engine?"
   - Take the 1-question quiz
   - You'll get 10 XP!

2. **See**: Go to Components
   - Find the "Engine Control System" component
   - Read its detailed information
   - You've now explored 1 component!

3. **Explore**: Go to System Explorer
   - Review the "Electronic Control Flow" diagram
   - See how it connects to what you just learned

4. **Check Progress**: Go to Progress
   - Notice your updated XP
   - See the module progress increase
   - Check component exploration

## 🛠️ Customization Guide

### Change Colors
Edit `tailwind.config.js` in the `theme.extend.colors` section

### Modify Content
All content is in `src/data/`:
- `components.ts` - Component information
- `modules.ts` - Learning content and quizzes
- `achievements.ts` - Badges

### Add New Components
1. Add to `src/data/components.ts`
2. They automatically appear in Component Library

### Add New Quiz Questions
1. Edit the lesson in `src/data/modules.ts`
2. Update the `quiz.questions` array
3. Questions auto-display in Modules page

## 📊 Understanding the Project Structure

**Key Folders:**
- `src/components/` - UI building blocks (cards, panels, etc.)
- `src/pages/` - Full page templates
- `src/data/` - All content (components, modules, achievements)
- `src/store/` - State management (what page, selected component, progress)
- `src/types/` - TypeScript type definitions

**Key Files:**
- `App.tsx` - Main app that routes between pages
- `Navigation.tsx` - Top navigation bar
- `Quiz.tsx` - Quiz component used in all modules

## 🔧 Troubleshooting

### Port 3000 Already in Use
```powershell
# Use different port
npm run dev -- --port 3001
```

### npm install fails
```powershell
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

### Changes not showing
- The browser should auto-refresh
- If not, press `F5` to refresh
- Check browser console for errors (F12)

## 📝 Making Your First Edit

### Change the App Title
1. Open `index.html`
2. Find `<title>ELCO 1 - ME-C Engine Control System LMS</title>`
3. Change it to whatever you want
4. Save (Ctrl+S)
5. Browser updates automatically

### Change a Component Description
1. Open `src/data/components.ts`
2. Find a component in `MEC_COMPONENTS` array
3. Edit the `shortDescription` field
4. Save
5. Go to Components page and reload - it updates!

### Add a New Quiz Question
1. Open `src/data/modules.ts`
2. Find the module and lesson
3. Find the `quiz.questions` array
4. Add a new question object:
```typescript
{
  id: 'q-new',
  type: 'multiple-choice',
  question: 'Your question?',
  options: ['Option 1', 'Option 2', 'Option 3'],
  correctAnswer: 0,  // Index of correct answer
  explanation: 'Why this answer is correct',
}
```
5. Save and go to Modules to test it

## 📦 Building for Production

When ready to deploy:

```powershell
npm run build
```

This creates an optimized `dist/` folder ready to deploy to any web server.

## 🎓 Learning Path Recommendation

**For New Users:**
1. Start on Home page → understand the concept
2. Go to Learning Modules → complete Module 01
3. Explore Component Library → pick 3-4 interesting components
4. Check Progress → see your stats
5. Take Assessments → test your knowledge

**For Instructors:**
1. Review all 8 modules for content accuracy
2. Customize components list if needed
3. Modify quiz questions to match your needs
4. Review the System Explorer for accuracy
5. Plan the 3D engine model integration

**For Developers:**
1. Review the project structure
2. Understand the Zustand store
3. Check TypeScript types
4. Read the 3D implementation guide
5. Plan Three.js integration

## ✨ Key Features to Highlight

- ✅ **Fully Responsive** - Works on mobile, tablet, desktop
- ✅ **No Database Needed** - All data is local (can add later)
- ✅ **Complete & Ready** - All pages working and functional
- ✅ **Professional Design** - Maritime engineering aesthetic
- ✅ **Customizable** - Easy to modify content and styling
- ✅ **Extensible** - Ready for 3D engine and backend

## 🚀 What's Next?

Once you're comfortable with the LMS:

1. **3D Engine Integration** (See `3D_ENGINE_IMPLEMENTATION.md`)
   - Get or create 3D model of ME-C engine
   - Install Three.js if not already (included)
   - Integrate the model into EngineLabPage
   - Add component interaction

2. **Backend Integration** (When ready)
   - Add user authentication
   - Save progress to database
   - Add instructor features

3. **Deployment** (When ready)
   - Run `npm run build`
   - Deploy to Vercel, Netlify, or your server
   - Domain setup and SSL

## 💡 Tips & Tricks

- **Hot Reload**: Changes save and reload automatically
- **Browser DevTools**: Press F12 to see errors
- **Dark Mode**: Already built in!
- **Mobile Testing**: Press F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- **Performance**: Network tab shows what's loading

## 📞 Help Resources

Inside the project:
- `README.md` - Full documentation
- `3D_ENGINE_IMPLEMENTATION.md` - 3D integration guide
- `PROJECT_SUMMARY.md` - Complete overview
- Code comments - Well-documented code

External:
- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- TypeScript: https://www.typescriptlang.org/
- Vite: https://vitejs.dev/

---

**You're all set! Run `npm run dev` and start exploring! 🚀**

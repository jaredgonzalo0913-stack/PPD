import { useAppStore } from './store';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import EngineLabPage from './pages/EngineLabPage';
import ComponentsPage from './pages/ComponentsPage';
import SystemExplorerPage from './pages/SystemExplorerPage';
import AssessmentsPage from './pages/AssessmentsPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  const currentPage = useAppStore((state) => state.currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'modules':
        return <ModulesPage />;
      case 'engine-lab':
        return <EngineLabPage />;
      case 'components':
        return <ComponentsPage />;
      case 'system-explorer':
        return <SystemExplorerPage />;
      case 'assessments':
        return <AssessmentsPage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-deep-blue to-navy text-white">
      <Navigation />
      <main className="relative">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

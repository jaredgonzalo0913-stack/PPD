import { useAppStore } from '../store';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setCurrentPage, currentPage, studentProgress } = useAppStore();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'modules', label: 'Modules' },
    { id: 'engine-lab', label: '3D Engine Lab' },
    { id: 'components', label: 'Components' },
    { id: 'system-explorer', label: 'System Explorer' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'progress', label: 'Progress' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId as any);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass-panel m-0 border-b border-cyan/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold glow-text">⚙️</div>
            <div>
              <div className="text-xl font-bold glow-text">PPD</div>
              <div className="text-xs text-cyan/70">POWER PLANT DIESEL</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-cyan text-navy'
                    : 'text-cyan hover:bg-cyan/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="hidden lg:flex gap-6 items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-cyan/70">XP:</span>
              <span className="font-bold text-cyan">{studentProgress.totalXP}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan/70">Modules:</span>
              <span className="font-bold text-cyan">{Object.keys(studentProgress.moduleScores).length}/8</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-cyan/10 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-cyan" />
            ) : (
              <Menu className="w-6 h-6 text-cyan" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-cyan/20 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === item.id
                    ? 'bg-cyan text-navy'
                    : 'text-cyan hover:bg-cyan/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

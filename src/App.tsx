import { useState } from 'react';
import Dashboard from './components/Dashboard';
import VisionBoard from './components/VisionBoard';
import Outfits from './components/Outfits';
import Pins from './components/Pins';
import FoodTracker from './components/FoodTracker';

type Tab = 'dashboard' | 'vision' | 'outfits' | 'pins' | 'food';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, icon: '✨', label: 'Главная' },
    { id: 'vision' as Tab, icon: '🎨', label: 'Мудборд' },
    { id: 'outfits' as Tab, icon: '👗', label: 'Луки' },
    { id: 'pins' as Tab, icon: '📌', label: 'Пины' },
    { id: 'food' as Tab, icon: '🥗', label: 'Питание' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'vision': return <VisionBoard />;
      case 'outfits': return <Outfits />;
      case 'pins': return <Pins />;
      case 'food': return <FoodTracker />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="glass-card px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl float-animation">✨</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              My Glow Up
            </h1>
          </div>
          <div className="text-xs text-purple-400 font-medium">
            {new Date().toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-2">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-md mx-auto px-3 pb-4 pt-2">
          <div className="glass-card px-2 py-2 flex justify-around items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-item flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl ${
                  activeTab === tab.id ? 'active' : 'text-purple-400'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;

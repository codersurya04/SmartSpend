import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Settings from './pages/Settings';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
        {activePage === 'transactions' && <Transactions />}
        {activePage === 'analytics' && <Analytics />}
        {activePage === 'budget' && <Budget />}
        {activePage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

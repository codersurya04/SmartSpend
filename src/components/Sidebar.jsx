import { useState } from 'react';
import Icon from './Icon';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'transactions' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'budget', label: 'Budget', icon: 'budget' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar({ activePage, onNavigate }) {
    const { budget, budgetUsed, budgetStatus, user } = useApp();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleNav = (id) => {
        onNavigate(id);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile header */}
            <header className="mobile-header">
                <div className="sidebar-logo" style={{ padding: 0, border: 'none' }}>
                    <div className="sidebar-logo-icon">$</div>
                    <span className="sidebar-logo-text">SmartSpend</span>
                </div>
                <button className="hamburger" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Icon name="menu" />
                </button>
            </header>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`sidebar${isMobileOpen ? ' open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">$</div>
                    <span className="sidebar-logo-text">SmartSpend</span>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <span className="nav-section-label">Menu</span>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            id={`nav-${item.id}`}
                            className={`nav-item${activePage === item.id ? ' active' : ''}`}
                            onClick={() => handleNav(item.id)}
                            style={{ background: 'none', width: '100%', textAlign: 'left' }}
                        >
                            <Icon name={item.icon} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Budget mini widget */}
                <div className="sidebar-footer">
                    {budget.monthly > 0 ? (
                        <div className="budget-mini">
                            <div className="budget-mini-label">
                                <span>Monthly Budget</span>
                                <span style={{ color: budgetStatus === 'ok' ? '#4CAF88' : budgetStatus === 'warn' ? '#FFB347' : '#FF5C7A', fontWeight: 600 }}>
                                    {Math.min(budgetUsed, 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="budget-mini-bar">
                                <div
                                    className={`budget-mini-fill`}
                                    style={{
                                        width: `${Math.min(budgetUsed, 100)}%`,
                                        background: budgetStatus === 'ok'
                                            ? 'linear-gradient(90deg, #4CAF88, #45B7AA)'
                                            : budgetStatus === 'warn'
                                                ? 'linear-gradient(90deg, #FFB347, #FFA033)'
                                                : 'linear-gradient(90deg, #FF5C7A, #FF8C6B)',
                                    }}
                                />
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                {user.currency}{budget.monthly.toLocaleString()} budget
                            </div>
                        </div>
                    ) : (
                        <div className="budget-mini" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleNav('budget')}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No budget set</div>
                            <div style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 600, marginTop: 4 }}>+ Set Budget</div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function Settings() {
    const { user, updateUser, transactions, deleteTransaction } = useApp();
    const [name, setName] = useState(user.name);
    const [currency, setCurrency] = useState(user.currency);
    const [showConfirm, setShowConfirm] = useState(false);

    const currencies = [
        { symbol: '₹', label: 'INR (₹)' },
        { symbol: '$', label: 'USD ($)' },
        { symbol: '€', label: 'EUR (€)' },
        { symbol: '£', label: 'GBP (£)' },
        { symbol: '¥', label: 'JPY (¥)' },
    ];

    const handleSave = () => {
        updateUser({ name, currency });
        alert('Settings saved successfully!');
    };

    const handleClearData = () => {
        if (showConfirm) {
            transactions.forEach(t => deleteTransaction(t.id));
            setShowConfirm(false);
        } else {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 3000);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>⚙️ Settings</h1>
                <p>Customize your experience</p>
            </div>

            <div className="card" style={{ maxWidth: 600 }}>
                <div className="chart-title" style={{ marginBottom: 'var(--space-lg)' }}>Profile Preferences</div>

                <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Default Currency</label>
                    <div className="currencies-grid" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                        {currencies.map(c => (
                            <button
                                key={c.symbol}
                                className={`filter-chip ${currency === c.symbol ? 'active' : ''}`}
                                onClick={() => setCurrency(c.symbol)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-xl)' }}>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Settings
                    </button>
                </div>
            </div>

            <div className="card" style={{ maxWidth: 600, marginTop: 'var(--space-xl)', borderColor: 'rgba(255, 92, 122, 0.2)' }}>
                <div className="chart-title" style={{ color: 'var(--accent-red)' }}>Danger Zone</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Once you delete your data, there is no going back. Please be certain.
                </p>

                <button
                    className={`btn ${showConfirm ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={handleClearData}
                    style={{ borderColor: !showConfirm ? 'var(--accent-red)' : undefined, color: !showConfirm ? 'var(--accent-red)' : undefined }}
                >
                    <Icon name="trash" />
                    {showConfirm ? 'Click again to confirm delete all' : 'Clear All Data'}
                </button>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';

export default function Budget() {
    const { budget, totalExpense, updateBudget, user } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(budget.monthly.toString());

    const handleSave = () => {
        const val = Number(editValue);
        if (!isNaN(val) && val >= 0) {
            updateBudget(val);
        }
        setIsEditing(false);
    };

    const budgetUsed = budget.monthly > 0 ? (totalExpense / budget.monthly) * 100 : 0;
    const progress = Math.min(budgetUsed, 100);
    const isOver = budgetUsed > 100;
    const cur = user.currency;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🎯 Budget</h1>
                <p>Manage your monthly budget limits</p>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div>
                        <div className="chart-title">Monthly Budget</div>
                        <div className="chart-subtitle">Keep your spending in check</div>
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card-hover)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-lg)' }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 200 }}>
                                <div className="input-with-icon">
                                    <span className="input-icon-prefix">{cur}</span>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        placeholder="Enter monthly budget"
                                        autoFocus
                                        min="0"
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={handleSave}>Save</button>
                            <button className="btn btn-ghost" onClick={() => { setEditValue(budget.monthly.toString()); setIsEditing(false); }}>Cancel</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                            <div>
                                <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {cur}{budget.monthly.toLocaleString()}
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>Target for this month</div>
                            </div>
                            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                                <Icon name="edit" /> Edit Budget
                            </button>
                        </div>
                    )}
                </div>

                {budget.monthly > 0 ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                            <span style={{ fontWeight: 600 }}>{cur}{totalExpense.toLocaleString()} spent</span>
                            <span style={{ color: isOver ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                                {isOver ? 'Over budget by ' : 'Remaining: '}
                                {cur}{Math.abs(budget.monthly - totalExpense).toLocaleString()}
                            </span>
                        </div>
                        <div className="budget-bar-wrap" style={{ height: 12 }}>
                            <div
                                className="budget-bar"
                                style={{
                                    width: `${progress}%`,
                                    background: isOver ? 'var(--accent-red)' : progress > 80 ? 'var(--accent-amber)' : 'var(--accent-green)'
                                }}
                            />
                        </div>
                        <div className="budget-labels" style={{ marginTop: 'var(--space-sm)' }}>
                            <span>0%</span>
                            <span>{budgetUsed.toFixed(1)}%</span>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: 'var(--space-lg) 0' }}>
                        <p>Set a budget above to start tracking your spending limit.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

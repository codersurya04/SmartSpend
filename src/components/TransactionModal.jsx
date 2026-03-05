import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Icon from './Icon';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryInfo } from '../data/categories';

const defaultForm = {
    type: 'expense',
    amount: '',
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    note: '',
};

export default function TransactionModal({ isOpen, onClose, editData = null }) {
    const { addTransaction, editTransaction } = useApp();
    const [form, setForm] = useState(defaultForm);
    const isEditing = !!editData;

    useEffect(() => {
        if (editData) {
            setForm({
                type: editData.type,
                amount: editData.amount.toString(),
                category: editData.category,
                date: format(new Date(editData.date), 'yyyy-MM-dd'),
                note: editData.note || '',
            });
        } else {
            setForm(defaultForm);
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const handleTypeChange = (type) => {
        const defaultCat = type === 'income' ? 'pocket_money' : 'food';
        setForm((f) => ({ ...f, type, category: defaultCat }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return;

        const data = {
            type: form.type,
            amount: Number(form.amount),
            category: form.category,
            date: new Date(form.date + 'T12:00:00').toISOString(),
            note: form.note.trim(),
        };

        if (isEditing) {
            editTransaction(editData.id, data);
        } else {
            addTransaction(data);
        }
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2>{isEditing ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose} id="modal-close-btn">
                        <Icon name="close" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {/* Type Toggle */}
                    <div className="form-group">
                        <label className="form-label">Transaction Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                id="type-expense"
                                className={`type-toggle-btn${form.type === 'expense' ? ' active-expense' : ''}`}
                                onClick={() => handleTypeChange('expense')}
                            >
                                📉 Expense
                            </button>
                            <button
                                type="button"
                                id="type-income"
                                className={`type-toggle-btn${form.type === 'income' ? ' active-income' : ''}`}
                                onClick={() => handleTypeChange('income')}
                            >
                                📈 Income
                            </button>
                        </div>
                    </div>

                    {/* Amount + Date */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-amount">Amount</label>
                            <input
                                id="tx-amount"
                                type="number"
                                className="form-input"
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="tx-date">Date</label>
                            <input
                                id="tx-date"
                                type="date"
                                className="form-input"
                                value={form.date}
                                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="tx-category">Category</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, category: cat.key }))}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '8px 10px',
                                        borderRadius: 'var(--radius-md)',
                                        border: `1px solid ${form.category === cat.key ? cat.color : 'var(--border-primary)'}`,
                                        background: form.category === cat.key ? `${cat.color}18` : 'var(--bg-input)',
                                        color: form.category === cat.key ? cat.color : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        fontWeight: 500,
                                        fontFamily: 'var(--font-body)',
                                        transition: 'all 150ms ease',
                                        textAlign: 'left',
                                    }}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="tx-note">Note (optional)</label>
                        <input
                            id="tx-note"
                            type="text"
                            className="form-input"
                            placeholder="What was this for?"
                            value={form.note}
                            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                            maxLength={100}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" id="tx-submit-btn" className="btn btn-primary">
                            <Icon name={isEditing ? 'save' : 'plus'} />
                            {isEditing ? 'Save Changes' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

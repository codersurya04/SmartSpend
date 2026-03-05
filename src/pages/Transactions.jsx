import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';
import { getCategoryInfo, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import Icon from '../components/Icon';
import TransactionModal from '../components/TransactionModal';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Highest', value: 'highest' },
    { label: 'Lowest', value: 'lowest' },
];

export default function Transactions() {
    const { transactions, deleteTransaction, user } = useApp();
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const cur = user.currency;
    const fmt = (n) => `${cur}${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const filtered = useMemo(() => {
        let list = [...transactions];
        if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
        if (categoryFilter !== 'all') list = list.filter((t) => t.category === categoryFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((t) =>
                (t.note || '').toLowerCase().includes(q) ||
                getCategoryInfo(t.category).label.toLowerCase().includes(q)
            );
        }
        switch (sortBy) {
            case 'newest': return list.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest': return list.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'highest': return list.sort((a, b) => b.amount - a.amount);
            case 'lowest': return list.sort((a, b) => a.amount - b.amount);
            default: return list;
        }
    }, [transactions, typeFilter, categoryFilter, search, sortBy]);

    const handleEdit = (tx) => {
        setEditData(tx);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (deleteConfirm === id) {
            deleteTransaction(id);
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>💳 Transactions</h1>
                <p>All your income and expense records</p>
            </div>

            {/* Controls */}
            <div className="card card-sm" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="transactions-header">
                    {/* Search */}
                    <div className="search-input-wrap">
                        <Icon name="search" />
                        <input
                            id="tx-search"
                            type="text"
                            className="form-input search-input"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Sort */}
                    <select
                        id="tx-sort"
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: 'auto', minWidth: 130 }}
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>

                    {/* Add button */}
                    <button
                        className="btn btn-primary btn-sm"
                        id="add-tx-btn"
                        onClick={() => { setEditData(null); setModalOpen(true); }}
                    >
                        <Icon name="plus" /> Add
                    </button>
                </div>

                {/* Filters */}
                <div className="filter-bar">
                    {['all', 'income', 'expense'].map((f) => (
                        <button
                            key={f}
                            className={`filter-chip${typeFilter === f ? ' active' : ''}`}
                            onClick={() => setTypeFilter(f)}
                            id={`filter-type-${f}`}
                        >
                            {f === 'all' ? '🔄 All' : f === 'income' ? '📈 Income' : '📉 Expense'}
                        </button>
                    ))}
                    <span style={{ width: 1, height: 20, background: 'var(--border-primary)', margin: '0 4px' }} />
                    <button
                        className={`filter-chip${categoryFilter === 'all' ? ' active' : ''}`}
                        onClick={() => setCategoryFilter('all')}
                    >
                        All Categories
                    </button>
                    {allCategories.map((cat) => (
                        <button
                            key={cat.key}
                            className={`filter-chip${categoryFilter === cat.key ? ' active' : ''}`}
                            onClick={() => setCategoryFilter(cat.key === categoryFilter ? 'all' : cat.key)}
                        >
                            {cat.emoji} {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction List */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Net: <strong style={{ color: 'var(--text-primary)' }}>
                            {cur}{(
                                filtered.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0)
                            ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </strong>
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No results found</h3>
                        <p>{transactions.length === 0 ? 'Add your first transaction to get started.' : 'Try adjusting your filters.'}</p>
                    </div>
                ) : (
                    <div className="transaction-list">
                        {filtered.map((tx) => {
                            const cat = getCategoryInfo(tx.category);
                            const isDeleting = deleteConfirm === tx.id;
                            return (
                                <div key={tx.id} className="transaction-item" style={{ borderColor: isDeleting ? 'rgba(255,92,122,0.3)' : undefined }}>
                                    <div className="transaction-icon" style={{ background: `${cat.color}18` }}>
                                        {cat.emoji}
                                    </div>
                                    <div className="transaction-info">
                                        <div className="transaction-name">{tx.note || cat.label}</div>
                                        <div className="transaction-meta">
                                            <span>{format(new Date(tx.date), 'dd MMM yyyy')}</span>
                                            <span>·</span>
                                            <span className="meta-tag">{cat.label}</span>
                                            <span className="meta-tag" style={{ color: tx.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                                {tx.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`transaction-amount ${tx.type}`}>
                                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                                    </div>
                                    <div className="transaction-actions">
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            title="Edit"
                                            onClick={() => handleEdit(tx)}
                                            id={`edit-tx-${tx.id}`}
                                        >
                                            <Icon name="edit" />
                                        </button>
                                        <button
                                            className={`btn btn-icon ${isDeleting ? 'btn-danger' : 'btn-ghost'}`}
                                            title={isDeleting ? 'Click again to confirm delete' : 'Delete'}
                                            onClick={() => handleDelete(tx.id)}
                                            id={`delete-tx-${tx.id}`}
                                            style={{ color: isDeleting ? 'var(--accent-red)' : undefined }}
                                        >
                                            <Icon name="trash" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                editData={editData}
            />
        </div>
    );
}

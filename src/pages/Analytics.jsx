import { useMemo } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getCategoryInfo } from '../data/categories';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomTooltip = ({ active, payload, label, currency }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontSize: 13,
                boxShadow: 'var(--shadow-md)',
            }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color || 'var(--accent-purple)', fontWeight: 600 }}>
                        {currency}{p.value?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function Analytics() {
    const { currentMonthTx, user } = useApp();
    const cur = user.currency;
    const fmt = (n) => `${cur}${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    const expenses = currentMonthTx.filter((t) => t.type === 'expense');
    const income = currentMonthTx.filter((t) => t.type === 'income');
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    // Category breakdown for pie chart
    const categoryData = useMemo(() => {
        const map = {};
        expenses.forEach((t) => {
            map[t.category] = (map[t.category] || 0) + t.amount;
        });
        return Object.entries(map)
            .map(([key, value]) => ({
                name: getCategoryInfo(key).label,
                emoji: getCategoryInfo(key).emoji,
                color: getCategoryInfo(key).color,
                value,
                pct: totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : 0,
            }))
            .sort((a, b) => b.value - a.value);
    }, [expenses, totalExpense]);

    // Daily spending trend
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const days = eachDayOfInterval({ start: monthStart, end: now });

    const dailyData = useMemo(() => {
        return days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayExpenses = expenses.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === key);
            const dayIncome = income.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === key);
            return {
                date: format(day, 'dd'),
                fullDate: format(day, 'dd MMM'),
                expense: dayExpenses.reduce((s, t) => s + t.amount, 0),
                income: dayIncome.reduce((s, t) => s + t.amount, 0),
            };
        });
    }, [expenses, income]);

    // Day-of-week breakdown
    const dowData = useMemo(() => {
        const map = {};
        DAYS_OF_WEEK.forEach((d) => { map[d] = { total: 0, count: 0 }; });
        expenses.forEach((t) => {
            const dayName = DAYS_OF_WEEK[getDay(new Date(t.date))];
            map[dayName].total += t.amount;
            map[dayName].count += 1;
        });
        return DAYS_OF_WEEK.map((d) => ({
            day: d,
            total: map[d].total,
            avg: map[d].count > 0 ? map[d].total / map[d].count : 0,
        }));
    }, [expenses]);

    // Highest spending day
    const highestDowEntry = dowData.reduce((best, curr) => curr.total > best.total ? curr : best, { day: '—', total: 0 });

    // Weekend vs weekday
    const weekendDays = ['Sat', 'Sun'];
    const weekendSpend = dowData.filter((d) => weekendDays.includes(d.day)).reduce((s, d) => s + d.total, 0);
    const weekdaySpend = dowData.filter((d) => !weekendDays.includes(d.day)).reduce((s, d) => s + d.total, 0);

    // Savigns projection
    const projectedMonthlySavings = savings;
    const projectedAnnualSavings = savings * 12;

    const hasData = currentMonthTx.length > 0;

    if (!hasData) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <h1>📊 Analytics</h1>
                    <p>Insights into your spending patterns</p>
                </div>
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📊</div>
                        <h3>No data yet</h3>
                        <p>Add some transactions to see your analytics.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📊 Analytics</h1>
                <p>Your spending insights for {format(now, 'MMMM yyyy')}</p>
            </div>

            {/* Charts row */}
            <div className="chart-section">
                {/* Pie Chart */}
                <div className="chart-card">
                    <div className="chart-title">Category Breakdown</div>
                    <div className="chart-subtitle">Expense distribution this month</div>
                    {categoryData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload?.length) {
                                                const d = payload[0].payload;
                                                return (
                                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13 }}>
                                                        <div>{d.emoji} {d.name}</div>
                                                        <div style={{ color: d.color, fontWeight: 700 }}>{fmt(d.value)} ({d.pct}%)</div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Legend */}
                            <div className="category-legend">
                                {categoryData.slice(0, 6).map((cat, i) => (
                                    <div key={i} className="legend-item">
                                        <div className="legend-dot-label">
                                            <div className="legend-dot" style={{ background: cat.color }} />
                                            <span>{cat.emoji} {cat.name}</span>
                                        </div>
                                        <div className="legend-value">{fmt(cat.value)} · {cat.pct}%</div>
                                    </div>
                                ))}
                            </div>
                            {categoryData.length > 0 && (
                                <div style={{ marginTop: 'var(--space-md)', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
                                    🏆 Highest: <strong style={{ color: categoryData[0].color }}>{categoryData[0].emoji} {categoryData[0].name}</strong> · {fmt(categoryData[0].value)}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state"><p>No expense data</p></div>
                    )}
                </div>

                {/* Daily Trend */}
                <div className="chart-card">
                    <div className="chart-title">Daily Spending Trend</div>
                    <div className="chart-subtitle">Day-by-day expenses this month</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF5C7A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#FF5C7A" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4CAF88" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#4CAF88" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="date" tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip currency={cur} />} />
                            <Area type="monotone" dataKey="income" stroke="#4CAF88" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                            <Area type="monotone" dataKey="expense" stroke="#FF5C7A" strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Day of Week Chart */}
            <div className="chart-card" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="chart-title">Spending by Day of Week</div>
                <div className="chart-subtitle">Which days do you spend the most?</div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dowData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="day" tick={{ fill: '#8B8FA8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip currency={cur} />} />
                        <Line type="monotone" dataKey="total" stroke="#6C63FF" strokeWidth={2.5} dot={{ fill: '#6C63FF', r: 4 }} name="Total" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pattern Cards */}
            <div className="card card-sm" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="chart-title">Spending Patterns</div>
                <div className="chart-subtitle">Key insights from your data</div>
                <div className="pattern-grid">
                    <div className="pattern-card">
                        <div className="pattern-icon">📅</div>
                        <div>
                            <div className="pattern-label">Highest Spending Day</div>
                            <div className="pattern-value">{highestDowEntry.day} · {fmt(highestDowEntry.total)}</div>
                        </div>
                    </div>
                    <div className="pattern-card">
                        <div className="pattern-icon">🏖️</div>
                        <div>
                            <div className="pattern-label">Weekend vs Weekday Spend</div>
                            <div className="pattern-value">{fmt(weekendSpend)} vs {fmt(weekdaySpend)}</div>
                        </div>
                    </div>
                    <div className="pattern-card">
                        <div className="pattern-icon">💡</div>
                        <div>
                            <div className="pattern-label">Avg. Daily Expense</div>
                            <div className="pattern-value">{fmt(days.length > 0 ? totalExpense / days.length : 0)}</div>
                        </div>
                    </div>
                    <div className="pattern-card">
                        <div className="pattern-icon">🎯</div>
                        <div>
                            <div className="pattern-label">Savings Rate</div>
                            <div className="pattern-value" style={{ color: savingsRate >= 0 ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                                {savingsRate.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Savings Projection */}
            <div className="chart-card">
                <div className="chart-title">💰 Savings Projection</div>
                <div className="chart-subtitle">Based on your current month's trend</div>
                <div className="projection-grid">
                    <div className="projection-card">
                        <div className="projection-card-label">This Month</div>
                        <div className="projection-card-value" style={{ color: projectedMonthlySavings >= 0 ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                            {projectedMonthlySavings < 0 ? '-' : ''}{fmt(projectedMonthlySavings)}
                        </div>
                    </div>
                    <div className="projection-card">
                        <div className="projection-card-label">Annual Projection</div>
                        <div className="projection-card-value" style={{ color: projectedAnnualSavings >= 0 ? 'var(--accent-teal)' : 'var(--accent-red)' }}>
                            {projectedAnnualSavings < 0 ? '-' : ''}{fmt(projectedAnnualSavings)}
                        </div>
                    </div>
                    <div className="projection-card">
                        <div className="projection-card-label">Savings Rate</div>
                        <div className="projection-card-value" style={{ color: savingsRate >= 20 ? 'var(--accent-teal)' : savingsRate >= 0 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
                            {savingsRate.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 'var(--space-md)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {savingsRate >= 30 ? '🌟 Excellent! You\'re saving more than 30% of your income — great financial habit!' :
                        savingsRate >= 20 ? '✅ Good job! Aim to keep savings above 20% consistently.' :
                            savingsRate >= 0 ? '⚠️ Your savings rate is low. Try to reduce discretionary spending.' :
                                '🚨 You\'re spending more than you earn this month. Review your budget immediately.'}
                </div>
            </div>
        </div>
    );
}

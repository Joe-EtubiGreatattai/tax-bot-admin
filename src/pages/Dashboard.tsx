import { useEffect, useState } from 'react';
import { Users, FileText, CreditCard, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { getStats } from '../services/api';

const StatCard = ({ title, value, change, icon: Icon, className }: any) => (
    <div className={cn("stat-card", className)}>
        <div className="stat-header">
            <div className="stat-icon">
                <Icon size={24} className="text-primary" />
            </div>
            {change && (
                <span className={cn(
                    "stat-change",
                    change.startsWith('+') ? "positive" : "negative"
                )}>
                    {change}
                </span>
            )}
        </div>
        <h3 className="stat-label">{title}</h3>
        <p className="stat-value">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <div className="dashboard-header">
                <h2 className="dashboard-title">Dashboard</h2>
                <p className="dashboard-subtitle">Overview of your platform's performance.</p>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                />
                <StatCard
                    title="Total Receipts"
                    value={stats?.totalReceipts || 0}
                    icon={FileText}
                />
                <StatCard
                    title="Revenue"
                    value={`₦${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Pending Payments"
                    value={stats?.pendingPayments || 0}
                    icon={CreditCard}
                />
            </div>

            <div className="content-grid">
                <div className="card">
                    <h3 className="card-title">Recent Activity</h3>
                    <div className="text-muted-foreground text-sm">
                        Activity feed coming soon...
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="action-btn">
                            <Users size={20} color="#64748B" />
                            <span>Invite User</span>
                        </button>
                        <button className="action-btn">
                            <FileText size={20} color="#64748B" />
                            <span>Review Receipts</span>
                        </button>
                        <button className="action-btn">
                            <CreditCard size={20} color="#64748B" />
                            <span>Process Payments</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

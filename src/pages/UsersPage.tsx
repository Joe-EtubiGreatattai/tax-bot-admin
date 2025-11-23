import { useEffect, useState } from 'react';
import { getUsers, suspendUser, unsuspendUser, requestUserDeletion, deleteUserNow } from '../services/api';
import { Loader2, Search } from 'lucide-react';

const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '₦0';
    return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
};

const UsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.tin || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSuspendToggle = async (user: any) => {
        try {
            if (!user.isSuspended) {
                const reason = window.prompt('Enter reason for suspending this user:');
                if (!reason) return;
                setActionLoading(true);
                await suspendUser(user._id, reason);
            } else {
                if (!window.confirm('Unsuspend this user?')) return;
                setActionLoading(true);
                await unsuspendUser(user._id);
            }
            await loadUsers();
        } catch (error) {
            console.error('Suspend/unsuspend user failed', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAction = async (user: any) => {
        try {
            if (!user.deleteRequestedAt) {
                const reason = window.prompt('Enter reason for scheduling this account for deletion (10-day grace period):');
                if (!reason) return;
                setActionLoading(true);
                await requestUserDeletion(user._id, reason);
            } else {
                if (!window.confirm('This account is already scheduled for deletion. Delete permanently now? This cannot be undone.')) return;
                const reason = window.prompt('Enter reason for permanent deletion:');
                if (!reason) return;
                setActionLoading(true);
                await deleteUserNow(user._id, reason);
            }
            await loadUsers();
        } catch (error) {
            console.error('Delete user action failed', error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            {actionLoading && (
                <div className="mb-2 text-sm text-muted-foreground">Applying changes...</div>
            )}
            <div className="page-header">
                <div className="header-content">
                    <h2>Users</h2>
                    <p>Manage and monitor your platform's user base</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact Info</th>
                                <th>TIN</th>
                                <th>Receipts</th>
                                <th>Total Spent</th>
                                <th>Total VAT</th>
                                <th>Unpaid Months</th>
                                <th>Joined</th>
                                <th>Last Login</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const statusLabel = user.deleteRequestedAt
                                    ? `Pending deletion${typeof user.deletePhaseDaysRemaining === 'number' ? ` (${user.deletePhaseDaysRemaining}d left)` : ''}`
                                    : user.isSuspended
                                        ? 'Suspended'
                                        : user.isActive
                                            ? 'Active'
                                            : 'Inactive';
                                return (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-placeholder">
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="user-name">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.email}</span>
                                            <span className="text-xs text-muted-foreground">{user.phone || 'No phone'}</span>
                                        </div>
                                    </td>
                                    <td className="font-mono text-sm">{user.tin || '-'}</td>
                                    <td className="text-sm font-medium">{user.totalReceipts ?? 0}</td>
                                    <td className="text-sm">{formatCurrency(user.totalSpent)}</td>
                                    <td className="text-sm font-semibold text-primary">{formatCurrency(user.totalTaxAllTime)}</td>
                                    <td className="text-sm">
                                        {user.unpaidMonthsCount > 0 ? (
                                            <span className="text-red-600 font-bold">{user.unpaidMonthsCount}</span>
                                        ) : (
                                            <span className="text-green-600">0</span>
                                        )}
                                    </td>
                                    <td className="text-sm text-muted-foreground">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="text-sm text-muted-foreground">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${
                                            user.deleteRequestedAt
                                                ? 'pending'
                                                : user.isSuspended
                                                    ? 'inactive'
                                                    : user.isActive
                                                        ? 'active'
                                                        : 'inactive'
                                        }`}>
                                            {statusLabel}
                                        </span>
                                    </td>
                                    <td className="space-x-2 whitespace-nowrap">
                                        <button
                                            className="text-xs px-3 py-1 rounded border border-border hover:bg-muted"
                                            onClick={() => handleSuspendToggle(user)}
                                        >
                                            {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                                        </button>
                                        <button
                                            className="text-xs px-3 py-1 rounded border border-destructive text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteAction(user)}
                                        >
                                            {user.deleteRequestedAt ? 'Delete Now' : 'Schedule Delete'}
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={11} className="text-center py-8 text-muted-foreground">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;

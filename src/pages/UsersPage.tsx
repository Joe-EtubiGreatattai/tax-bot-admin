import { useEffect, useState } from 'react';
import { getUsers } from '../services/api';
import { Loader2, Search } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
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

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="dashboard-title">Users</h2>
                    <p className="dashboard-subtitle">Manage your platform users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="p-4 font-semibold text-muted-foreground">Name</th>
                                <th className="p-4 font-semibold text-muted-foreground">Email</th>
                                <th className="p-4 font-semibold text-muted-foreground">Phone</th>
                                <th className="p-4 font-semibold text-muted-foreground">TIN</th>
                                <th className="p-4 font-semibold text-muted-foreground">Joined</th>
                                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.phone || '-'}</td>
                                    <td className="p-4 font-mono text-sm">{user.tin || '-'}</td>
                                    <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;

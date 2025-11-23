import { useState } from 'react';
import { Save, User, Lock, Shield, Server, UserPlus, Mail } from 'lucide-react';
import { updateProfile, createAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'admin'>('profile');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Create Admin State
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [createAdminLoading, setCreateAdminLoading] = useState(false);
    const [createAdminMessage, setCreateAdminMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileMessage(null);

        if (password && password !== confirmPassword) {
            setProfileMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setProfileLoading(true);
        try {
            const updateData: { name?: string; password?: string } = {};
            if (name !== user?.name) updateData.name = name;
            if (password) updateData.password = password;

            if (Object.keys(updateData).length === 0) {
                setProfileLoading(false);
                return;
            }

            const response = await updateProfile(updateData);
            if (response.success) {
                setProfileMessage({ type: 'success', text: 'Profile updated successfully' });
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error: any) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateAdminMessage(null);

        if (!newAdminName || !newAdminEmail || !newAdminPassword) {
            setCreateAdminMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        setCreateAdminLoading(true);
        try {
            const response = await createAdmin({
                name: newAdminName,
                email: newAdminEmail,
                password: newAdminPassword
            });

            if (response.success) {
                setCreateAdminMessage({ type: 'success', text: 'New admin created successfully' });
                setNewAdminName('');
                setNewAdminEmail('');
                setNewAdminPassword('');
            }
        } catch (error: any) {
            setCreateAdminMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create admin' });
        } finally {
            setCreateAdminLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="page-header mb-8">
                <div className="header-content">
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground mt-1">Manage your account, system preferences, and team access.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`group w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all duration-300 border ${activeTab === 'profile'
                                ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-200/50 shadow-xl shadow-blue-500/10 ring-2 ring-blue-100 translate-x-1'
                                : 'bg-white/50 border-gray-100 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-lg hover:border-blue-100 text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'profile'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-blue-400 group-hover:to-purple-500 group-hover:text-white group-hover:shadow-md'
                                }`}>
                                <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                            </div>
                            <div className="space-y-0.5">
                                <span className={`block text-sm font-bold tracking-tight transition-colors ${activeTab === 'profile' ? 'text-gray-900' : 'text-gray-700'}`}>My Profile</span>
                                <span className={`text-xs transition-colors ${activeTab === 'profile' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>Account details</span>
                            </div>
                        </div>
                        {activeTab === 'profile' && (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`group w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all duration-300 border ${activeTab === 'admin'
                                ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200/50 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-100 translate-x-1'
                                : 'bg-white/50 border-gray-100 hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-teal-50/50 hover:shadow-lg hover:border-emerald-100 text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all duration-300 ${activeTab === 'admin'
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-110'
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-emerald-400 group-hover:to-teal-500 group-hover:text-white group-hover:shadow-md'
                                }`}>
                                <Shield size={20} strokeWidth={activeTab === 'admin' ? 2.5 : 2} />
                            </div>
                            <div className="space-y-0.5">
                                <span className={`block text-sm font-bold tracking-tight transition-colors ${activeTab === 'admin' ? 'text-gray-900' : 'text-gray-700'}`}>Admin Management</span>
                                <span className={`text-xs transition-colors ${activeTab === 'admin' ? 'text-emerald-600 font-semibold' : 'text-gray-500'}`}>Team access</span>
                            </div>
                        </div>
                        {activeTab === 'admin' && (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-pulse"></div>
                        )}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="card-title flex items-center gap-2 border-b border-border pb-4 mb-6">
                                    <User size={20} className="text-primary" />
                                    Profile Settings
                                </h3>

                                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                                    {profileMessage && (
                                        <div className={`p-3 rounded-lg text-sm ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {profileMessage.text}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="form-group">
                                            <label className="form-label">Full Name</label>
                                            <div className="input-wrapper">
                                                <User size={16} className="input-icon" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="form-input"
                                                    placeholder="Admin Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Email Address</label>
                                            <div className="input-wrapper">
                                                <Mail size={16} className="input-icon" />
                                                <input
                                                    type="email"
                                                    value={user?.email}
                                                    disabled
                                                    className="form-input opacity-70 cursor-not-allowed bg-muted"
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground mt-1 ml-1">Email cannot be changed</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-border my-2"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <div className="input-wrapper">
                                                <Lock size={16} className="input-icon" />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="form-input"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Confirm New Password</label>
                                            <div className="input-wrapper">
                                                <Lock size={16} className="input-icon" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="form-input"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            disabled={profileLoading}
                                            className="submit-btn w-auto px-6 flex items-center gap-2"
                                        >
                                            {profileLoading ? 'Saving...' : (
                                                <>
                                                    <Save size={18} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* System Info */}
                            <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                                <h3 className="card-title flex items-center gap-2 border-b border-border pb-4 mb-6">
                                    <Server size={20} className="text-primary" />
                                    System Status
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-border">
                                            <span className="text-sm text-muted-foreground">Version</span>
                                            <span className="font-medium">v1.2.0</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border">
                                            <span className="text-sm text-muted-foreground">Environment</span>
                                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Production</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-border">
                                            <span className="text-sm text-muted-foreground">Database</span>
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                                Connected
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border">
                                            <span className="text-sm text-muted-foreground">Last Backup</span>
                                            <span className="text-sm">Today, 04:00 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'admin' && (
                        <div className="card animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="card-title flex items-center gap-2 border-b border-border pb-4 mb-6">
                                <UserPlus size={20} className="text-primary" />
                                Create New Admin
                            </h3>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-sm text-blue-800">
                                <p className="font-medium mb-1">Note:</p>
                                <p>New admins will have full access to the dashboard, including user management and financial data. Please ensure you trust the person before creating an account.</p>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="flex flex-col gap-5">
                                {createAdminMessage && (
                                    <div className={`p-3 rounded-lg text-sm ${createAdminMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {createAdminMessage.text}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            value={newAdminName}
                                            onChange={(e) => setNewAdminName(e.target.value)}
                                            className="form-input"
                                            placeholder="e.g. Jane Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            value={newAdminEmail}
                                            onChange={(e) => setNewAdminEmail(e.target.value)}
                                            className="form-input"
                                            placeholder="e.g. jane@tax-e.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} className="input-icon" />
                                        <input
                                            type="password"
                                            value={newAdminPassword}
                                            onChange={(e) => setNewAdminPassword(e.target.value)}
                                            className="form-input"
                                            placeholder="Strong password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={createAdminLoading}
                                        className="submit-btn w-auto px-6 flex items-center gap-2"
                                    >
                                        {createAdminLoading ? 'Creating...' : (
                                            <>
                                                <UserPlus size={18} />
                                                Create Admin Account
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

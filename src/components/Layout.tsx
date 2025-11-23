import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: FileText, label: 'Receipts', path: '/receipts' },
        { icon: CreditCard, label: 'Payments', path: '/payments' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="overlay lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn("sidebar", isOpen ? "open" : "closed")}>
                <div className="sidebar-header">
                    <h1 className="sidebar-title">Tax-e Admin</h1>
                    <button onClick={() => setIsOpen(false)} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn("nav-item", isActive && "active")}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-container">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="main-content">
                {/* Header */}
                <header className="top-header">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="menu-btn"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="user-profile">
                        <div className="avatar">
                            A
                        </div>
                        <span style={{ fontWeight: 500 }}>Admin User</span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

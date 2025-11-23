import { useEffect, useState } from 'react';
import { getPayments } from '../services/api';
import { Loader2, Search } from 'lucide-react';

const PaymentsPage = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await getPayments();
                if (response.success) {
                    setPayments(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch payments', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(payment =>
        payment.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
    };

    return (
        <div>
            <div className="page-header">
                <div className="header-content">
                    <h2>Payments</h2>
                    <p>Track and manage user tax payments</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by user name..."
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
                                <th>Month</th>
                                <th>User</th>
                                <th>Total Tax</th>
                                <th>Amount Paid</th>
                                <th>Status</th>
                                <th>Date Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="font-medium">{payment.month}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{payment.userName}</span>
                                            <span className="text-xs text-muted-foreground">{payment.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="text-sm font-medium">{formatCurrency(payment.totalTax)}</td>
                                    <td className="text-sm">{formatCurrency(payment.paidAmount)}</td>
                                    <td>
                                        <span className={`status-badge ${payment.isPaid ? 'active' : 'inactive'}`}>
                                            {payment.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="text-sm text-muted-foreground">
                                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No payments found matching your search.
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

export default PaymentsPage;

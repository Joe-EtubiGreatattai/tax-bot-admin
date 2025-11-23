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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="dashboard-title">Payments</h2>
                    <p className="dashboard-subtitle">Track tax payments</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search user..."
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
                                <th className="p-4 font-semibold text-muted-foreground">Month</th>
                                <th className="p-4 font-semibold text-muted-foreground">User</th>
                                <th className="p-4 font-semibold text-muted-foreground">Total Tax</th>
                                <th className="p-4 font-semibold text-muted-foreground">Amount Paid</th>
                                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                                <th className="p-4 font-semibold text-muted-foreground">Date Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{payment.month}</td>
                                    <td className="p-4">{payment.userName}</td>
                                    <td className="p-4">₦{payment.totalTax.toLocaleString()}</td>
                                    <td className="p-4">₦{payment.paidAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {payment.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
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

export default PaymentsPage;

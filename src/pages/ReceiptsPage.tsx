import { useEffect, useState } from 'react';
import { getReceipts } from '../services/api';
import { Loader2, Search, ExternalLink } from 'lucide-react';

const ReceiptsPage = () => {
    const [receipts, setReceipts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await getReceipts();
                if (response.success) {
                    setReceipts(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch receipts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    const filteredReceipts = receipts.filter(receipt =>
        receipt.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.userName?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="dashboard-title">Receipts</h2>
                    <p className="dashboard-subtitle">View and manage all uploaded receipts</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search merchant or user..."
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
                                <th className="p-4 font-semibold text-muted-foreground">Date</th>
                                <th className="p-4 font-semibold text-muted-foreground">Merchant</th>
                                <th className="p-4 font-semibold text-muted-foreground">User</th>
                                <th className="p-4 font-semibold text-muted-foreground">Amount</th>
                                <th className="p-4 font-semibold text-muted-foreground">Tax</th>
                                <th className="p-4 font-semibold text-muted-foreground">Category</th>
                                <th className="p-4 font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="p-4">{new Date(receipt.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium">{receipt.merchant}</td>
                                    <td className="p-4 text-sm text-muted-foreground">{receipt.userName}</td>
                                    <td className="p-4 font-medium">₦{receipt.amount.toLocaleString()}</td>
                                    <td className="p-4 text-sm">₦{receipt.taxAmount.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                                            {receipt.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {receipt.imagePath && (
                                            <a
                                                href={receipt.imagePath}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent hover:underline flex items-center gap-1 text-sm"
                                            >
                                                View <ExternalLink size={14} />
                                            </a>
                                        )}
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

export default ReceiptsPage;

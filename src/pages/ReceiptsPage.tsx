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

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
    };

    return (
        <div>
            <div className="page-header">
                <div className="header-content">
                    <h2>Receipts</h2>
                    <p>View and manage all uploaded receipts</p>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search merchant or user..."
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
                                <th>Date</th>
                                <th>Merchant</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Tax</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt._id}>
                                    <td className="text-sm text-muted-foreground">
                                        {new Date(receipt.date).toLocaleDateString()}
                                    </td>
                                    <td className="font-medium">{receipt.merchant}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{receipt.userName}</span>
                                            <span className="text-xs text-muted-foreground">{receipt.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">{formatCurrency(receipt.amount)}</td>
                                    <td className="text-sm text-muted-foreground">{formatCurrency(receipt.taxAmount)}</td>
                                    <td>
                                        <span className="category-badge">
                                            {receipt.category}
                                        </span>
                                    </td>
                                    <td>
                                        {receipt.imagePath && (
                                            <a
                                                href={receipt.imagePath}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm font-medium transition-colors"
                                            >
                                                View <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredReceipts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No receipts found matching your search.
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

export default ReceiptsPage;

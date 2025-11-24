import { useState, useEffect, useRef } from "react";
import { Send, Bot } from "lucide-react";
import api from "../services/api";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const MercyAdminChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello Admin! I'm Eunice. I can help you summarize data or find features in the dashboard." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await api.post('/chat', {
                message: userMessage,
                history: messages.slice(-5)
            });

            if (response.data.success) {
                setMessages(prev => [...prev, response.data.message]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-panel">
            {/* Header */}
            <div className="chat-header">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm m-0">Eunice AI</h3>
                        <span className="text-xs opacity-80">Admin Assistant</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-bubble assistant animate-pulse text-muted-foreground">
                        Analyzing data...
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="chat-input-form">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about users, revenue..."
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="chat-send-btn"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MercyAdminChat;

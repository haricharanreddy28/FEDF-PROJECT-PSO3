import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import api from '../utils/api';
import { User } from '../types';
import { toast } from 'react-toastify';


interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (professional: User) => void;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, onConnect }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hello. I am your AI Assistant. I'm here to help you find the right support. Please select the keywords that best describe your situation, or type your own message below.",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [customMessage, setCustomMessage] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<{ role: string, reasoning: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Predefined keywords
    const keywords = {
        emotional: ['Scared', 'Sad', 'Depressed', 'Anxious', 'Hurt', 'Alone', 'Hopeless', 'Traumatized'],
        legal: ['Legal Help', 'Lawyer', 'Divorce', 'Custody', 'Police', 'Court', 'Protection Order', 'FIR/Complaint']
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleKeyword = (keyword: string) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
        } else {
            setSelectedKeywords([...selectedKeywords, keyword]);
        }
    };

    const handleAnalyze = async () => {
        if (selectedKeywords.length === 0 && !customMessage.trim()) {
            alert('Please select at least one keyword or type a custom message.');
            return;
        }

        const userMessage = customMessage.trim() || selectedKeywords.join(', ');

        const userMsg: Message = {
            id: Date.now().toString(),
            text: userMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            console.log('Sending message to AI:', userMessage);
            const response = await api.post('/ai/analyze', { message: userMessage });
            console.log('AI Response:', response.data);
            const { recommendation: role, reasoning } = response.data;

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: reasoning,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            setRecommendation({ role, reasoning });
            toast.info('New message from AI Assistant');

        } catch (error: any) {
            console.error('AI Error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Connection Error Details: ${error.message || 'Unknown error'}. Status: ${error.response?.status || 'No status'}. URL: ${error.config?.url || 'Unknown URL'}. Please try again.`,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!recommendation) return;
        setLoading(true);
        try {
            const userMessage = messages.find(m => m.sender === 'user')?.text || '';

            const response = await api.post('/ai/allocate', {
                role: recommendation.role,
                aiAnalysis: userMessage
            });
            const professional = response.data.professional;

            await api.post('/ai/mark-first-login-complete');

            onConnect(professional);
            onClose();
        } catch (error: any) {
            console.error('Allocation Error:', error);
            const errorMessage = error.response?.data?.message || 'Could not find an available professional at this moment. Please try again later.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header" style={{ background: 'linear-gradient(135deg, #4ECDC4, #7EDDD6)' }}>
                    <h3>🤖 AI Support Assistant</h3>
                    <button className="chat-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="chat-messages-container">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message-item ${msg.sender === 'user' ? 'my-message' : 'other-message'}`}
                        >
                            <div className="message-bubble" style={msg.sender === 'ai' ? { background: '#E0F7FA', border: 'none' } : {}}>
                                <p>{msg.text}</p>
                                <span className="message-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {!recommendation && (
                        <div className="keyword-selection" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px', margin: '12px 0' }}>
                            <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>Select keywords that describe your situation:</h4>

                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#9B7EDE' }}>Emotional Support:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {keywords.emotional.map(keyword => (
                                        <button
                                            key={keyword}
                                            onClick={() => toggleKeyword(keyword)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                border: selectedKeywords.includes(keyword) ? '2px solid #9B7EDE' : '2px solid #ddd',
                                                background: selectedKeywords.includes(keyword) ? '#E8DEFF' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#4ECDC4' }}>Legal Assistance:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {keywords.legal.map(keyword => (
                                        <button
                                            key={keyword}
                                            onClick={() => toggleKeyword(keyword)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                border: selectedKeywords.includes(keyword) ? '2px solid #4ECDC4' : '2px solid #ddd',
                                                background: selectedKeywords.includes(keyword) ? '#D4F4F1' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {keyword}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                                <button
                                    onClick={() => setShowCustomInput(!showCustomInput)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '2px solid #FFB74D',
                                        background: showCustomInput ? '#FFF3E0' : 'white',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        width: '100%'
                                    }}
                                >
                                    {showCustomInput ? '✓ Custom Message' : '+ Add Custom Message'}
                                </button>
                            </div>

                            {showCustomInput && (
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Describe your situation in your own words..."
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '2px solid #ddd',
                                        fontSize: '14px',
                                        minHeight: '80px',
                                        marginBottom: '12px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            )}

                            <Button
                                variant="primary"
                                onClick={handleAnalyze}
                                disabled={loading || (selectedKeywords.length === 0 && !customMessage.trim())}
                                fullWidth
                            >
                                {loading ? <LoadingSpinner size="small" /> : 'Analyze & Get Recommendation'}
                            </Button>
                        </div>
                    )}

                    {recommendation && (
                        <div className="chat-message-item other-message">
                            <div className="message-bubble" style={{ background: '#FFF3E0', border: '1px solid #FFE0B2', width: '100%' }}>
                                <p><strong>Recommendation:</strong> Based on your input, I recommend connecting with a <strong>{recommendation.role === 'legal' ? 'Legal Advisor' : 'Counsellor'}</strong>.</p>
                                <div style={{ marginTop: '16px' }}>
                                    <Button
                                        variant="primary"
                                        onClick={handleConnect}
                                        disabled={loading}
                                        fullWidth
                                        style={{
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            background: recommendation.role === 'legal' ? '#4ECDC4' : '#9B7EDE',
                                            border: 'none',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {loading ? <LoadingSpinner size="small" /> : `Connect with ${recommendation.role === 'legal' ? 'Legal Advisor' : 'Counsellor'}`}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default AIChatModal;

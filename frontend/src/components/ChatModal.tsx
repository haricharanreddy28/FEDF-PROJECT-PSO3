import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../utils/storage';
import api from '../utils/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessage {
  _id: string;
  senderId: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  } | string;
  receiverId: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  } | string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUserId: string;
  otherUserName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, otherUserId, otherUserName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferReason, setTransferReason] = useState('');
  const [transferring, setTransferring] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen && otherUserId) {
      loadMessages();

      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!otherUserId) return;

    try {
      setLoading(true);
      const response = await api.get(`/chat/messages/${otherUserId}`);
      setMessages(response.data);
    } catch (error: any) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUserId || sending) return;

    try {
      setSending(true);
      const response = await api.post('/chat/send', {
        receiverId: otherUserId,
        message: newMessage.trim(),
      });

      if (response.data) {
        setMessages([...messages, response.data]);
        setNewMessage('');
      } else {
        throw new Error('No data received from server');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        receiverId: otherUserId,
        currentUser: currentUser?.id,
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const handleTransferChat = async () => {
    if (!transferReason.trim()) {
      alert('Please provide a reason for transfer');
      return;
    }

    setTransferring(true);
    try {
      const newProfessionalType = currentUser?.role === 'counsellor' ? 'legal' : 'counsellor';
      const response = await api.post('/ai/transfer', {
        victimId: otherUserId,
        newProfessionalType,
        reason: transferReason
      });

      alert(`Chat transferred successfully to ${response.data.newProfessional.name}`);
      setShowTransferDialog(false);
      setTransferReason('');
      onClose();
    } catch (error: any) {
      console.error('Transfer error:', error);
      alert(error.response?.data?.message || 'Failed to transfer chat');
    } finally {
      setTransferring(false);
    }
  };

  if (!isOpen) return null;

  const isMyMessage = (message: ChatMessage) => {
    let senderId: string | undefined;
    if (typeof message.senderId === 'object') {
      senderId = message.senderId._id || message.senderId.id;
    } else {
      senderId = message.senderId;
    }
    const currentUserId = currentUser?.id;
    return senderId?.toString() === currentUserId?.toString() || senderId === currentUserId;
  };

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <h3>💬 Chat with {otherUserName}</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {(currentUser?.role === 'counsellor' || currentUser?.role === 'legal') && (
              <button
                onClick={() => setShowTransferDialog(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#FF9800',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Transfer to {currentUser.role === 'counsellor' ? 'Legal' : 'Counsellor'}
              </button>
            )}
            <button className="chat-modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="chat-messages-container">
          {loading && messages.length === 0 ? (
            <div className="chat-loading">
              <LoadingSpinner size="small" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat-message-item ${isMyMessage(message) ? 'my-message' : 'other-message'}`}
              >
                <div className="message-bubble">
                  <p>{message.message}</p>
                  <span className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="chat-input-field"
            disabled={sending}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <LoadingSpinner size="small" /> : 'Send'}
          </Button>
        </form>

        {/* Transfer Dialog */}
        {showTransferDialog && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '400px',
              width: '90%'
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: '16px' }}>Transfer Chat</h3>
              <p style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
                Transfer this chat to a {currentUser?.role === 'counsellor' ? 'Legal Advisor' : 'Counsellor'}?
              </p>
              <textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Reason for transfer (required)..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '80px',
                  marginBottom: '16px',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTransferDialog(false);
                    setTransferReason('');
                  }}
                  disabled={transferring}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleTransferChat}
                  disabled={transferring || !transferReason.trim()}
                >
                  {transferring ? <LoadingSpinner size="small" /> : 'Transfer'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;


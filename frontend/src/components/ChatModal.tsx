import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../utils/storage';
import api from '../utils/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import './ChatModal.css';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (isOpen && otherUserId) {
      loadMessages();
      // Poll for new messages every 3 seconds
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
          <button className="chat-modal-close" onClick={onClose}>×</button>
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
      </div>
    </div>
  );
};

export default ChatModal;


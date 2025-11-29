import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getLegalRights, getSupportServices, getCaseNotes } from '../utils/storage';
import { CaseNote, User } from '../types';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import ChatModal from '../components/ChatModal';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const VictimDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [legalRights, setLegalRights] = useState(getLegalRights());
  const [supportServices, setSupportServices] = useState(getSupportServices());
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [showStealthMode, setShowStealthMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [counsellors, setCounsellors] = useState<User[]>([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const notes = getCaseNotes().filter(note => note.survivorId === user.id);
      setCaseNotes(notes);
      
      // Fetch counsellors from API
      const fetchCounsellors = async () => {
        try {
          const response = await api.get('/users');
          const allUsers = response.data;
          const counsellorUsers = allUsers.filter((u: User) => u.role === 'counsellor');
          setCounsellors(counsellorUsers);
          
          // If there's a counsellor from case notes, set as default
          if (notes.length > 0 && counsellorUsers.length > 0) {
            const counsellorId = notes[0].counsellorId;
            const counsellor = counsellorUsers.find((c: User) => c.id === counsellorId || c.id.toString() === counsellorId);
            if (counsellor) {
              setSelectedCounsellor(counsellor);
            } else {
              setSelectedCounsellor(counsellorUsers[0]);
            }
          } else if (counsellorUsers.length > 0) {
            setSelectedCounsellor(counsellorUsers[0]);
          }
        } catch (error) {
          console.error('Error fetching counsellors:', error);
        }
      };
      
      fetchCounsellors();
    }
  }, [user]);

  return (
    <Layout title="My Dashboard">
      <div className="dashboard">
        {/* Quick Actions */}
        <section className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <Button variant="primary" size="large" onClick={() => window.open('tel:1091')}>
              🆘 Get Help Now (1091)
            </Button>
            <Button 
              variant="secondary" 
              size="large" 
              onClick={() => {
                if (selectedCounsellor) {
                  setChatOpen(true);
                } else {
                  alert('No counsellor available. Please contact support.');
                }
              }}
            >
              💬 Chat with Counsellor
            </Button>
            <Button variant="outline" size="large" onClick={() => setShowStealthMode(!showStealthMode)}>
              {showStealthMode ? '👁️ Show Account' : '🫥 Hide Account'}
            </Button>
          </div>
        </section>

        {/* Stealth Mode UI */}
        {showStealthMode && (
          <section className="dashboard-section stealth-mode">
            <Card>
              <h3>📚 General Information Portal</h3>
              <p>This appears as a regular information website to protect your privacy.</p>
            </Card>
          </section>
        )}

        {/* Legal Rights */}
        <section className="dashboard-section">
          <h2 className="section-title">Know Your Rights</h2>
          <div className="cards-grid">
            {legalRights.map((right) => (
              <Card key={right.id} className="info-card">
                <h3>{right.title}</h3>
                <p>{right.description}</p>
                <span className="category-badge">{right.category}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Services */}
        <section className="dashboard-section">
          <h2 className="section-title">Support Services</h2>
          <div className="cards-grid">
            {supportServices.map((service) => (
              <Card key={service.id} className="info-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <p><strong>Contact:</strong> {service.contact}</p>
                  <p><strong>Location:</strong> {service.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Progress Notes from Counsellor */}
        <section className="dashboard-section">
          <h2 className="section-title">Progress Notes</h2>
          {caseNotes.length > 0 ? (
            <div className="notes-list">
              {caseNotes.map((note) => (
                <Card key={note.id} className="note-card">
                  <div className="note-header">
                    <span className="note-date">{new Date(note.date).toLocaleDateString()}</span>
                    <span className={`risk-badge risk-${note.riskLevel}`}>
                      {note.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="note-content">{note.notes}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p>No progress notes available yet. Your counsellor will add notes after sessions.</p>
            </Card>
          )}
        </section>

        {/* Chat Modal */}
        {selectedCounsellor && (
          <ChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            otherUserId={selectedCounsellor.id.toString()}
            otherUserName={selectedCounsellor.name}
          />
        )}
        {!selectedCounsellor && chatOpen && (
          <div className="chat-error">
            <p>No counsellor available. Please contact support.</p>
            <Button onClick={() => setChatOpen(false)}>Close</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VictimDashboard;


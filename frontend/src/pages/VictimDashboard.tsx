import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getLegalRights, getSupportServices, getCaseNotes } from '../utils/storage';
import { CaseNote, User } from '../types';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import ChatModal from '../components/ChatModal';
import AIChatModal from '../components/AIChatModal';
import api from '../utils/api';


const VictimDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [legalRights] = useState(getLegalRights());
  const [supportServices] = useState(getSupportServices());
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [showStealthMode, setShowStealthMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [selectedProfessional, setSelectedProfessional] = useState<User | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const notes = getCaseNotes().filter(note => note.survivorId === user.id);
      setCaseNotes(notes);

      // Fetch assigned professionals
      const fetchAssignments = async () => {
        try {
          console.log('Fetching assignments...');
          const response = await api.get('/ai/assignments');
          console.log('Assignments response:', response.data);
          const assignments = response.data.professionals;

          // If no assignments exist, auto-open AI chat (first login)
          if (assignments.length === 0) {
            console.log('No assignments found, opening AI chat');
            setAiChatOpen(true);
          } else {
            // Set the assigned professional for chat
            const counsellorAssignment = assignments.find((a: any) => a.professionalType === 'counsellor');
            const legalAssignment = assignments.find((a: any) => a.professionalType === 'legal');

            if (counsellorAssignment) {
              console.log('Found counsellor assignment:', counsellorAssignment);
              setSelectedProfessional({
                id: counsellorAssignment.id,
                name: counsellorAssignment.name,
                email: counsellorAssignment.email,
                role: counsellorAssignment.role,
                password: '',
                createdAt: new Date().toISOString()
              });
            } else if (legalAssignment) {
              console.log('Found legal assignment:', legalAssignment);
              setSelectedProfessional({
                id: legalAssignment.id,
                name: legalAssignment.name,
                email: legalAssignment.email,
                role: legalAssignment.role,
                password: '',
                createdAt: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      };

      fetchAssignments();

      // Fetch counsellors (backup)
      const fetchCounsellors = async () => {
        try {
          const response = await api.get('/users');
          const allUsers = response.data;
          const counsellorUsers = allUsers.filter((u: User) => u.role === 'counsellor');
          // setCounsellors(counsellorUsers);

          // Set fallback counsellor if no assignment exists
          if (!selectedProfessional && counsellorUsers.length > 0) {
            if (notes.length > 0) {
              const counsellorId = notes[0].counsellorId;
              const counsellor = counsellorUsers.find((c: User) => c.id === counsellorId || c.id.toString() === counsellorId);
              if (counsellor) {
                setSelectedProfessional(counsellor);
              } else {
                setSelectedProfessional(counsellorUsers[0]);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching counsellors:', error);
        }
      };

      fetchCounsellors();
    }
  }, [user]);

  const handleConnectProfessional = (professional: User) => {
    console.log('Connecting to professional:', professional);
    setSelectedProfessional(professional);
    setAiChatOpen(false);
    // Automatically open chat with the assigned professional
    setChatOpen(true);
  };

  return (
    <Layout title="My Dashboard">
      <div className="dashboard">
        <section className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <Button variant="primary" size="large" onClick={() => window.open('tel:1091')}>
              🆘 Get Help Now (1091)
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => setAiChatOpen(true)}
            >
              🤖 AI Assistant & Connect
            </Button>
            <Button variant="outline" size="large" onClick={() => setShowStealthMode(!showStealthMode)}>
              {showStealthMode ? '👁️ Show Account' : '🫥 Hide Account'}
            </Button>
          </div>
        </section>

        {showStealthMode && (
          <section className="dashboard-section stealth-mode">
            <Card>
              <h3>📚 General Information Portal</h3>
              <p>This appears as a regular information website to protect your privacy.</p>
            </Card>
          </section>
        )}

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

        <AIChatModal
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
          onConnect={handleConnectProfessional}
        />

        {selectedProfessional && (
          <ChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            otherUserId={selectedProfessional.id.toString()}
            otherUserName={selectedProfessional.name}
          />
        )}
        {!selectedProfessional && chatOpen && (
          <div className="chat-error">
            <p>No professional available. Please contact support.</p>
            <Button onClick={() => setChatOpen(false)}>Close</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VictimDashboard;


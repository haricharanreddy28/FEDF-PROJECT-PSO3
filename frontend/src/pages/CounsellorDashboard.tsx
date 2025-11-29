import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getCaseNotes, saveCaseNote, deleteCaseNote } from '../utils/storage';
import { User, CaseNote } from '../types';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ChatModal from '../components/ChatModal';
import api from '../utils/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './Dashboard.css';

const caseNoteSchema = yup.object({
  notes: yup.string().required('Notes are required'),
  riskLevel: yup.string().oneOf(['low', 'medium', 'high']).required('Risk level is required'),
});

interface CaseNoteFormData {
  notes: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const CounsellorDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [survivors, setSurvivors] = useState<User[]>([]);
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [selectedSurvivor, setSelectedSurvivor] = useState<User | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState<CaseNote | null>(null);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSurvivor, setChatSurvivor] = useState<User | null>(null);

  useEffect(() => {
    // Fetch survivors from API
    const fetchSurvivors = async () => {
      try {
        const response = await api.get('/users');
        const allUsers = response.data;
        const victimUsers = allUsers.filter((u: User) => u.role === 'victim');
        setSurvivors(victimUsers);
      } catch (error) {
        console.error('Error fetching survivors:', error);
      }
    };

    fetchSurvivors();

    if (user) {
      const notes = getCaseNotes().filter(note => note.counsellorId === user.id);
      setCaseNotes(notes);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseNoteFormData>({
    resolver: yupResolver(caseNoteSchema),
    defaultValues: {
      notes: '',
      riskLevel: 'low' as 'low' | 'medium' | 'high',
    },
  });

  const onSubmit = (data: CaseNoteFormData) => {
    if (!user || !selectedSurvivor) return;

    const note: CaseNote = {
      id: editingNote?.id || `note-${Date.now()}`,
      survivorId: selectedSurvivor.id,
      counsellorId: user.id,
      date: editingNote?.date || new Date().toISOString(),
      notes: data.notes,
      riskLevel: data.riskLevel,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
    };

    saveCaseNote(note);
    setCaseNotes(getCaseNotes().filter(n => n.counsellorId === user.id));
    setShowNoteModal(false);
    setEditingNote(null);
    reset();
  };

  const handleEdit = (note: CaseNote) => {
    setEditingNote(note);
    const survivor = survivors.find(s => s.id === note.survivorId);
    setSelectedSurvivor(survivor || null);
    reset({
      notes: note.notes,
      riskLevel: note.riskLevel,
    });
    setShowNoteModal(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this case note?')) {
      deleteCaseNote(noteId);
      if (user) {
        setCaseNotes(getCaseNotes().filter(n => n.counsellorId === user.id));
      }
    }
  };

  return (
    <Layout title="Counsellor Dashboard">
      <div className="dashboard">
        {/* Assigned Survivors */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Assigned Survivors</h2>
            <Button variant="primary" onClick={() => setShowRiskAssessment(true)}>
              📋 Risk Assessment Form
            </Button>
          </div>
          <div className="cards-grid">
            {survivors.map((survivor) => (
              <Card key={survivor.id} className="survivor-card">
                <h3>{survivor.name}</h3>
                <p>{survivor.email}</p>
                <div className="card-actions">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setSelectedSurvivor(survivor);
                      reset({ notes: '', riskLevel: 'low' });
                      setShowNoteModal(true);
                    }}
                  >
                    Add Note
                  </Button>
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => {
                      setChatSurvivor(survivor);
                      setChatOpen(true);
                    }}
                  >
                    💬 Chat
                  </Button>
                  <Button variant="outline" size="small">
                    📞 Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Case Notes */}
        <section className="dashboard-section">
          <h2 className="section-title">Case Notes</h2>
          {caseNotes.length > 0 ? (
            <div className="notes-list">
              {caseNotes.map((note) => {
                const survivor = survivors.find(s => s.id === note.survivorId);
                return (
                  <Card key={note.id} className="note-card">
                    <div className="note-header">
                      <div>
                        <strong>{survivor?.name || 'Unknown'}</strong>
                        <span className="note-date">{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`risk-badge risk-${note.riskLevel}`}>
                        {note.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="note-content">{note.notes}</p>
                    <div className="note-actions">
                      <Button variant="outline" size="small" onClick={() => handleEdit(note)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDelete(note.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <p>No case notes yet. Add notes for your assigned survivors.</p>
            </Card>
          )}
        </section>

        {/* Schedule Sessions */}
        <section className="dashboard-section">
          <h2 className="section-title">Schedule Sessions</h2>
          <Card>
            <p>Session scheduling feature (Frontend mock)</p>
            <Button variant="primary" onClick={() => alert('Session scheduling feature - to be integrated')}>
              Schedule New Session
            </Button>
          </Card>
        </section>

        {/* Case Note Modal */}
        <Modal
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setEditingNote(null);
            reset();
          }}
          title={editingNote ? 'Edit Case Note' : 'Add Case Note'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <label>Survivor</label>
              <select defaultValue={selectedSurvivor?.id || ''} disabled>
                <option value={selectedSurvivor?.id || ''}>
                  {selectedSurvivor?.name || 'Select survivor'}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Risk Level</label>
              <select {...register('riskLevel')} className={errors.riskLevel ? 'input-error' : ''}>
                <option value="">Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.riskLevel && <span className="error-message">{errors.riskLevel.message}</span>}
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                {...register('notes')}
                rows={6}
                className={errors.notes ? 'input-error' : ''}
                placeholder="Enter case notes..."
              />
              {errors.notes && <span className="error-message">{errors.notes.message}</span>}
            </div>
            <Button type="submit" variant="primary" fullWidth>
              {editingNote ? 'Update Note' : 'Save Note'}
            </Button>
          </form>
        </Modal>

        {/* Risk Assessment Modal */}
        <Modal
          isOpen={showRiskAssessment}
          onClose={() => setShowRiskAssessment(false)}
          title="Risk Assessment Form"
          size="large"
        >
          <form className="form">
            <div className="form-group">
              <label>Select Survivor</label>
              <select>
                <option value="">Select survivor</option>
                {survivors.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Risk Level</label>
              <select>
                <option value="">Select risk level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Risk Factors (select all that apply)</label>
              <div className="checkbox-group">
                <label><input type="checkbox" /> Physical violence</label>
                <label><input type="checkbox" /> Threats</label>
                <label><input type="checkbox" /> Isolation</label>
                <label><input type="checkbox" /> Financial control</label>
                <label><input type="checkbox" /> Stalking</label>
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea rows={6} placeholder="Enter assessment notes..." />
            </div>
            <Button type="submit" variant="primary" fullWidth>
              Submit Assessment
            </Button>
          </form>
        </Modal>

        {/* Chat Modal */}
        {chatSurvivor && (
          <ChatModal
            isOpen={chatOpen}
            onClose={() => {
              setChatOpen(false);
              setChatSurvivor(null);
            }}
            otherUserId={chatSurvivor.id.toString()}
            otherUserName={chatSurvivor.name}
          />
        )}
      </div>
    </Layout>
  );
};

export default CounsellorDashboard;


import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/storage';
import { getLegalRights, saveLegalRight, deleteLegalRight } from '../utils/storage';
import { LegalRight, User } from '../types';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ChatModal from '../components/ChatModal';
import api from '../utils/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const legalRightSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
});

interface LegalRightFormData {
  title: string;
  description: string;
  category: string;
}

const LegalDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [legalRights, setLegalRights] = useState<LegalRight[]>([]);
  const [survivors, setSurvivors] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRight, setEditingRight] = useState<LegalRight | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [chatSurvivor, setChatSurvivor] = useState<User | null>(null);

  useEffect(() => {
    setLegalRights(getLegalRights());


    const fetchSurvivors = async () => {
      try {
        const response = await api.get('/api/ai/assigned-victims');
        setSurvivors(response.data.victims);
      } catch (error) {
        console.error('Error fetching survivors:', error);
      }
    };

    fetchSurvivors();
    const interval = setInterval(fetchSurvivors, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LegalRightFormData>({
    resolver: yupResolver(legalRightSchema),
  });

  const onSubmit = (data: LegalRightFormData) => {
    if (!user) return;

    const right: LegalRight = {
      id: editingRight?.id || `right-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      updatedAt: new Date().toISOString(),
      updatedBy: user.name,
    };

    saveLegalRight(right);
    setLegalRights(getLegalRights());
    setShowModal(false);
    setEditingRight(null);
    reset();
  };

  const handleEdit = (right: LegalRight) => {
    setEditingRight(right);
    reset({
      title: right.title,
      description: right.description,
      category: right.category,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this legal right?')) {
      deleteLegalRight(id);
      setLegalRights(getLegalRights());
    }
  };

  return (
    <Layout title="Legal Advisor Dashboard">
      <div className="dashboard">
        {/* ... (Legal Guidelines section) ... */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Legal Guidelines</h2>
            <Button
              variant="primary"
              onClick={() => {
                setEditingRight(null);
                reset();
                setShowModal(true);
              }}
            >
              + Add New Law
            </Button>
          </div>
          <div className="cards-grid">
            {legalRights.map((right) => (
              <Card key={right.id} className="info-card">
                <div className="card-header">
                  <h3>{right.title}</h3>
                  <span className="category-badge">{right.category}</span>
                </div>
                <p>{right.description}</p>
                <div className="card-footer">
                  <small>Updated by {right.updatedBy}</small>
                  <div className="card-actions">
                    <Button variant="outline" size="small" onClick={() => handleEdit(right)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="small" onClick={() => handleDelete(right.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Assigned Clients</h2>
          {survivors.length > 0 ? (
            <div className="cards-grid">
              {survivors.map((survivor: any) => (
                <Card key={survivor.id} className="survivor-card">
                  <h3>{survivor.name}</h3>
                  <p>{survivor.email}</p>
                  {survivor.aiAnalysis && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      background: '#f5f5f5',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      <strong>Initial Analysis:</strong>
                      <p style={{ margin: '4px 0 0', color: '#666' }}>{survivor.aiAnalysis}</p>
                    </div>
                  )}
                  <div style={{ marginTop: '16px' }}>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setChatSurvivor(survivor);
                        setChatOpen(true);
                      }}
                    >
                      💬 Chat with Client
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p>No clients assigned yet.</p>
            </Card>
          )}
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Provide Legal Action Guidance</h2>
          <Card>
            <p>Guidance form for legal actions (Frontend mock)</p>
            <Button variant="primary" onClick={() => alert('Legal guidance form - to be integrated')}>
              Provide Guidance
            </Button>
          </Card>
        </section>

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRight(null);
            reset();
          }}
          title={editingRight ? 'Edit Legal Right' : 'Add New Legal Right'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                {...register('title')}
                className={errors.title ? 'input-error' : ''}
                placeholder="Enter title"
              />
              {errors.title && <span className="error-message">{errors.title.message}</span>}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select {...register('category')} className={errors.category ? 'input-error' : ''}>
                <option value="">Select category</option>
                <option value="Legal Protection">Legal Protection</option>
                <option value="Legal Rights">Legal Rights</option>
                <option value="Financial Rights">Financial Rights</option>
                <option value="Privacy Rights">Privacy Rights</option>
                <option value="Legal Aid">Legal Aid</option>
                <option value="Domestic Violence Act">Domestic Violence Act</option>
                <option value="Criminal Law">Criminal Law</option>
              </select>
              {errors.category && <span className="error-message">{errors.category.message}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                {...register('description')}
                rows={6}
                className={errors.description ? 'input-error' : ''}
                placeholder="Enter description"
              />
              {errors.description && <span className="error-message">{errors.description.message}</span>}
            </div>
            <Button type="submit" variant="primary" fullWidth>
              {editingRight ? 'Update' : 'Save'}
            </Button>
          </form>
        </Modal>

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

export default LegalDashboard;


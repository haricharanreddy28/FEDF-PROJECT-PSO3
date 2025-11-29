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
import './Dashboard.css';

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
  const [selectedSurvivor, setSelectedSurvivor] = useState<User | null>(null);
  const [chatSurvivor, setChatSurvivor] = useState<User | null>(null);

  useEffect(() => {
    setLegalRights(getLegalRights());
    
    // Fetch survivors from API
    const fetchSurvivors = async () => {
      try {
        const response = await api.get('/users');
        const allUsers = response.data;
        setSurvivors(allUsers.filter((u: User) => u.role === 'victim'));
      } catch (error) {
        console.error('Error fetching survivors:', error);
      }
    };

    fetchSurvivors();
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
        {/* Legal Guidelines Management */}
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

        {/* Document Upload */}
        <section className="dashboard-section">
          <h2 className="section-title">Upload Documents</h2>
          <Card>
            <p>Upload legal documents, laws, and procedures</p>
            <input type="file" accept=".pdf,.doc,.docx" className="file-input" />
            <Button variant="primary" onClick={() => alert('Document upload feature - to be integrated')}>
              Upload Document
            </Button>
          </Card>
        </section>

        {/* Chat with Survivors */}
        <section className="dashboard-section">
          <h2 className="section-title">Chat with Survivors</h2>
          <div className="cards-grid">
            {survivors.map((survivor) => (
              <Card key={survivor.id} className="survivor-card">
                <h3>{survivor.name}</h3>
                <p>{survivor.email}</p>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setChatSurvivor(survivor);
                    setChatOpen(true);
                  }}
                >
                  💬 Chat
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal Action Guidance */}
        <section className="dashboard-section">
          <h2 className="section-title">Provide Legal Action Guidance</h2>
          <Card>
            <p>Guidance form for legal actions (Frontend mock)</p>
            <Button variant="primary" onClick={() => alert('Legal guidance form - to be integrated')}>
              Provide Guidance
            </Button>
          </Card>
        </section>

        {/* Legal Right Modal */}
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

export default LegalDashboard;


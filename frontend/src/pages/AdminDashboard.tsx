import React, { useState, useEffect } from 'react';

import {
  getUsers,
  addUser,
  saveUser,
  deleteUser,
  getLegalRights,
  getSupportServices,
  saveSupportService,
  deleteSupportService,
} from '../utils/storage';
import { User, SupportService, UserRole } from '../types';
import Layout from '../components/Layout';
import Button from '../components/Button';
import AdminAnalytics from '../components/AdminAnalytics';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['admin', 'victim', 'counsellor', 'legal']).required('Role is required'),
});

const serviceSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  contact: yup.string().required('Contact is required'),
  location: yup.string().required('Location is required'),
  category: yup.string().required('Category is required'),
});

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface ServiceFormData {
  name: string;
  description: string;
  contact: string;
  location: string;
  category: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [legalRights] = useState(getLegalRights());
  const [supportServices, setSupportServices] = useState<SupportService[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingService, setEditingService] = useState<SupportService | null>(null);

  useEffect(() => {
    setUsers(getUsers());
    setSupportServices(getSupportServices());
  }, []);

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
    reset: resetUser,
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
  });

  const {
    register: registerService,
    handleSubmit: handleSubmitService,
    formState: { errors: serviceErrors },
    reset: resetService,
  } = useForm<ServiceFormData>({
    resolver: yupResolver(serviceSchema),
  });

  const onSubmitUser = (data: UserFormData) => {
    if (editingUser) {
      const updatedUser: User = {
        ...editingUser,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };
      saveUser(updatedUser);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        createdAt: new Date().toISOString(),
      };
      addUser(newUser);
    }
    setUsers(getUsers());
    setShowUserModal(false);
    setEditingUser(null);
    resetUser();
  };

  const onSubmitService = (data: ServiceFormData) => {
    const service: SupportService = {
      id: editingService?.id || `service-${Date.now()}`,
      name: data.name,
      description: data.description,
      contact: data.contact,
      location: data.location,
      category: data.category,
    };
    saveSupportService(service);
    setSupportServices(getSupportServices());
    setShowServiceModal(false);
    setEditingService(null);
    resetService();
  };

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    resetUser({
      name: userToEdit.name,
      email: userToEdit.email,
      password: userToEdit.password,
      role: userToEdit.role,
    });
    setShowUserModal(true);
  };

  const handleEditService = (serviceToEdit: SupportService) => {
    setEditingService(serviceToEdit);
    resetService({
      name: serviceToEdit.name,
      description: serviceToEdit.description,
      contact: serviceToEdit.contact,
      location: serviceToEdit.location,
      category: serviceToEdit.category,
    });
    setShowServiceModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setUsers(getUsers());
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteSupportService(serviceId);
      setSupportServices(getSupportServices());
    }
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="dashboard">
        <section className="dashboard-section">
          <h2 className="section-title">Analytics Overview</h2>
          <AdminAnalytics />
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">User Management</h2>
            <Button
              variant="primary"
              onClick={() => {
                setEditingUser(null);
                resetUser();
                setShowUserModal(true);
              }}
            >
              + Add User
            </Button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="role-badge">{u.role}</span></td>
                    <td>
                      <div className="table-actions">
                        <Button variant="outline" size="small" onClick={() => handleEditUser(u)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="small" onClick={() => handleDeleteUser(u.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">Legal Rights Content</h2>
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
          <div className="section-header">
            <h2 className="section-title">Support Services</h2>
            <Button
              variant="primary"
              onClick={() => {
                setEditingService(null);
                resetService();
                setShowServiceModal(true);
              }}
            >
              + Add Service
            </Button>
          </div>
          <div className="cards-grid">
            {supportServices.map((service) => (
              <Card key={service.id} className="info-card">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-details">
                  <p><strong>Contact:</strong> {service.contact}</p>
                  <p><strong>Location:</strong> {service.location}</p>
                  <p><strong>Category:</strong> {service.category}</p>
                </div>
                <div className="card-actions">
                  <Button variant="outline" size="small" onClick={() => handleEditService(service)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleDeleteService(service.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">System Logs</h2>
          <Card>
            <p>Login activity and system logs (Frontend mock)</p>
            <Button variant="primary" onClick={() => alert('Logs feature - to be integrated')}>
              View Logs
            </Button>
          </Card>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">API Monitoring</h2>
          <Card>
            <div className="api-status">
              <div className="status-item">
                <span className="status-indicator status-ok"></span>
                <span>API Status: Operational</span>
              </div>
              <div className="status-item">
                <span className="status-indicator status-ok"></span>
                <span>Response Time: 120ms</span>
              </div>
            </div>
            <Button variant="primary" onClick={() => alert('API monitoring - to be integrated')}>
              View Detailed Metrics
            </Button>
          </Card>
        </section>

        <Modal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
            resetUser();
          }}
          title={editingUser ? 'Edit User' : 'Add New User'}
        >
          <form onSubmit={handleSubmitUser(onSubmitUser)} className="form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                {...registerUser('name')}
                className={userErrors.name ? 'input-error' : ''}
              />
              {userErrors.name && <span className="error-message">{userErrors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...registerUser('email')}
                className={userErrors.email ? 'input-error' : ''}
              />
              {userErrors.email && <span className="error-message">{userErrors.email.message}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                {...registerUser('password')}
                className={userErrors.password ? 'input-error' : ''}
              />
              {userErrors.password && <span className="error-message">{userErrors.password.message}</span>}
            </div>
            <div className="form-group">
              <label>Role</label>
              <select {...registerUser('role')} className={userErrors.role ? 'input-error' : ''}>
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="victim">Victim/Survivor</option>
                <option value="counsellor">Counsellor</option>
                <option value="legal">Legal Advisor</option>
              </select>
              {userErrors.role && <span className="error-message">{userErrors.role.message}</span>}
            </div>
            <Button type="submit" variant="primary" fullWidth>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </form>
        </Modal>

        <Modal
          isOpen={showServiceModal}
          onClose={() => {
            setShowServiceModal(false);
            setEditingService(null);
            resetService();
          }}
          title={editingService ? 'Edit Service' : 'Add New Service'}
        >
          <form onSubmit={handleSubmitService(onSubmitService)} className="form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                {...registerService('name')}
                className={serviceErrors.name ? 'input-error' : ''}
              />
              {serviceErrors.name && <span className="error-message">{serviceErrors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                {...registerService('description')}
                rows={4}
                className={serviceErrors.description ? 'input-error' : ''}
              />
              {serviceErrors.description && <span className="error-message">{serviceErrors.description.message}</span>}
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                {...registerService('contact')}
                className={serviceErrors.contact ? 'input-error' : ''}
              />
              {serviceErrors.contact && <span className="error-message">{serviceErrors.contact.message}</span>}
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                {...registerService('location')}
                className={serviceErrors.location ? 'input-error' : ''}
              />
              {serviceErrors.location && <span className="error-message">{serviceErrors.location.message}</span>}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select {...registerService('category')} className={serviceErrors.category ? 'input-error' : ''}>
                <option value="">Select category</option>
                <option value="Emergency">Emergency</option>
                <option value="Legal Support">Legal Support</option>
                <option value="Legal Aid">Legal Aid</option>
                <option value="Support Services">Support Services</option>
                <option value="Child Support">Child Support</option>
                <option value="Counseling">Counseling</option>
                <option value="Shelter">Shelter</option>
                <option value="Medical">Medical</option>
              </select>
              {serviceErrors.category && <span className="error-message">{serviceErrors.category.message}</span>}
            </div>
            <Button type="submit" variant="primary" fullWidth>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default AdminDashboard;


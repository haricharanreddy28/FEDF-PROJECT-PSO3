import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../utils/auth';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import './AuthPage.css';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(data.email, data.password);
      
      if (result.success && result.user) {
        // Redirect based on role
        const role = result.user.role;
        switch (role) {
          case 'admin':
            navigate('/dashboard/admin');
            break;
          case 'counsellor':
            navigate('/dashboard/counsellor');
            break;
          case 'legal':
            navigate('/dashboard/legal');
            break;
          case 'victim':
            navigate('/dashboard/victim');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'input-error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Login'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;


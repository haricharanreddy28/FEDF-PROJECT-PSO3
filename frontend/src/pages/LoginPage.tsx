import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../utils/auth';
import api from '../utils/api';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const fetchCaptcha = async () => {
    try {
      const response = await api.get('/auth/captcha');
      setCaptchaSvg(response.data.svg);
      setCaptchaToken(response.data.token);
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  };

  React.useEffect(() => {
    fetchCaptcha();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    if (!captchaAnswer) {
      setError('Please enter the CAPTCHA');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginUser(data.email, data.password, captchaAnswer, captchaToken);

      if (result.success && result.user) {

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
        fetchCaptcha(); // Refresh captcha on failure
        setCaptchaAnswer('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      fetchCaptcha();
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

          <div className="form-group">
            <label>Security Check</label>
            <div
              dangerouslySetInnerHTML={{ __html: captchaSvg }}
              style={{ marginBottom: '10px', borderRadius: '4px', overflow: 'hidden' }}
              onClick={fetchCaptcha}
              title="Click to refresh"
            />
            <input
              type="text"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              placeholder="Enter the characters above"
              className="form-control"
            />
            <small style={{ color: '#666', cursor: 'pointer' }} onClick={fetchCaptcha}>
              Click image to refresh
            </small>
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


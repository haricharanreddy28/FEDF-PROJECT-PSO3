import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';

const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Payment Successful">
            <div className="success-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
                <Card>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
                    <h2 style={{ color: 'var(--success-green)', marginBottom: '16px' }}>Thank You!</h2>
                    <p style={{ fontSize: '18px', marginBottom: '24px' }}>
                        Your donation has been successfully processed. Your support makes a huge difference in helping victims of domestic violence.
                    </p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Return to Home
                    </Button>
                </Card>
            </div>
        </Layout>
    );
};

export default PaymentSuccessPage;

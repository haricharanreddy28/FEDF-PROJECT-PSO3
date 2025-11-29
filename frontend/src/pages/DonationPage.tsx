import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { useRazorpay } from 'react-razorpay';
import { toast } from 'react-toastify';
import api from '../utils/api';

const DonationPage: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(500);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { Razorpay, isLoading, error: razorpayError } = useRazorpay();

    const handlePayment = async () => {
        if (!name || !email) {
            toast.error('Please enter your name and email');
            return;
        }

        if (isLoading) {
            toast.info('Razorpay is loading, please wait...');
            return;
        }

        if (razorpayError) {
            toast.error(`Razorpay Error: ${razorpayError}`);
            return;
        }

        if (!Razorpay) {
            toast.error('Razorpay is not available. Please refresh the page.');
            return;
        }

        let razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        
        if (!razorpayKey) {
            toast.error('Razorpay Key is not configured. Please check your environment variables.');
            console.error('VITE_RAZORPAY_KEY_ID is not set in environment variables');
            return;
        }

        razorpayKey = String(razorpayKey)
            .trim()
            .replace(/\s+/g, '')
            .replace(/\n/g, '')
            .replace(/\r/g, '')
            .replace(/\t/g, '')
            .replace(/['"]/g, '');
        
        if (razorpayKey.length < 20) {
            toast.error('Invalid Razorpay Key. Please check your environment variables.');
            console.error('Razorpay key seems invalid (too short):', razorpayKey.length, 'characters');
            return;
        }

        if (!razorpayKey.startsWith('rzp_live_') && !razorpayKey.startsWith('rzp_test_')) {
            toast.error('Invalid Razorpay Key format. Key should start with rzp_live_ or rzp_test_');
            console.error('Invalid Razorpay key format. Key starts with:', razorpayKey.substring(0, 10));
            return;
        }

        if (razorpayKey.includes(' ') || razorpayKey.includes('\n') || razorpayKey.includes('\r') || razorpayKey.includes('\t')) {
            toast.error('Razorpay Key contains invalid characters. Please check your .env file.');
            console.error('Key still contains whitespace after cleaning');
            return;
        }

        console.log('✅ Razorpay Key validated successfully');
        console.log('Key preview:', razorpayKey.substring(0, 15) + '...' + razorpayKey.substring(razorpayKey.length - 4));
        console.log('Key length:', razorpayKey.length, 'characters');
        console.log('Key type:', razorpayKey.startsWith('rzp_live_') ? 'Production' : 'Test');

        setLoading(true);

        try {
            console.log('Creating order for amount:', amount * 100);
            const orderResponse = await api.post('/payment/create-order', {
                amount: amount * 100,
                currency: "INR"
            });

            console.log('Order Response:', orderResponse.data);
            const orderData = orderResponse.data;

            if (!orderData) {
                console.error('No order data received');
                throw new Error('No order data received from server');
            }

            if (!orderData.id) {
                console.error('Invalid order data - missing ID:', orderData);
                throw new Error(orderData?.message || 'Order ID not received from server');
            }

            if (!orderData.amount || orderData.amount <= 0) {
                console.error('Invalid order amount:', orderData);
                throw new Error('Invalid order amount received from server');
            }

            console.log('Order created successfully:', {
                id: orderData.id,
                amount: orderData.amount,
                currency: orderData.currency,
                status: orderData.status
            });

            console.log('Preparing Razorpay options...');
            console.log('Order ID:', orderData.id);
            console.log('Amount:', orderData.amount);
            console.log('Currency:', orderData.currency);

            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency || 'INR',
                name: "SafeSpace",
                description: "Donation for Victim Support",
                image: "https://example.com/logo.png",
                order_id: orderData.id,
                handler: async (response: any) => {
                    console.log('Payment Response:', response);
                    setLoading(true);
                    
                    if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
                        toast.error('Invalid payment response received');
                        setLoading(false);
                        return;
                    }
                    
                    try {
                        const verifyResponse = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        const verifyData = verifyResponse.data;
                        console.log('Verification Response:', verifyData);

                        if (verifyData && (verifyData.success || verifyData.message)) {
                            toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                            navigate('/payment-success');
                        } else {
                            toast.error(`Payment Verification Failed: ${verifyData?.message || 'Unknown error'}`);
                        }
                    } catch (verifyError: any) {
                        console.error('Verification Error:', verifyError);
                        toast.error(`Verification Error: ${verifyError.message || 'Failed to verify payment'}`);
                    } finally {
                        setLoading(false);
                    }
                },
                notes: {
                    name: name,
                    email: email
                },
                handler: async (response: any) => {
                    console.log('Payment Response:', response);
                    setLoading(true);
                    
                    try {
                        const verifyResponse = await api.post('/payment/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        const verifyData = verifyResponse.data;
                        console.log('Verification Response:', verifyData);

                        if (verifyData && (verifyData.success || verifyData.message)) {
                            toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                            navigate('/payment-success');
                        } else {
                            toast.error(`Payment Verification Failed: ${verifyData?.message || 'Unknown error'}`);
                        }
                    } catch (verifyError: any) {
                        console.error('Verification Error:', verifyError);
                        toast.error(`Verification Error: ${verifyError.message}`);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: "9999999999",
                },
                theme: {
                    color: "#9B7EDE",
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                        toast.info('Payment cancelled by user');
                    }
                }
            };

            if (!Razorpay) {
                throw new Error('Razorpay is not initialized');
            }

            console.log('Initializing Razorpay with options:', {
                key_preview: razorpayKey.substring(0, 12) + '...',
                key_length: razorpayKey.length,
                order_id: orderData.id,
                amount: orderData.amount,
                currency: orderData.currency
            });

            console.log('Final Razorpay options check:', {
                key_length: options.key.length,
                key_starts_with: options.key.substring(0, 9),
                order_id: options.order_id,
                amount: options.amount
            });

            let rzp1;
            try {
                rzp1 = new Razorpay(options);
                console.log('✅ Razorpay instance created successfully');
            } catch (initError: any) {
                setLoading(false);
                console.error('❌ Error creating Razorpay instance:', initError);
                toast.error(`Failed to initialize payment: ${initError.message || 'Unknown error'}`);
                return;
            }
            
            rzp1.on("payment.failed", function (response: any) {
                setLoading(false);
                console.error('Payment Failed Response:', JSON.stringify(response, null, 2));
                const errorMsg = response.error?.description || 
                                response.error?.reason || 
                                response.error?.code || 
                                response.error?.source || 
                                'Payment failed. Please try again.';
                toast.error(`Payment Failed: ${errorMsg}`);
            });

            rzp1.on("payment.authorized", function (response: any) {
                console.log('Payment Authorized:', response);
            });

            rzp1.on("payment.captured", function (response: any) {
                console.log('Payment Captured:', response);
            });

            rzp1.on("error", function (error: any) {
                setLoading(false);
                console.error('Razorpay Error:', JSON.stringify(error, null, 2));
                let errorMsg = 'Unknown error';
                if (error.description) {
                    errorMsg = error.description;
                } else if (error.message) {
                    errorMsg = error.message;
                } else if (error.reason) {
                    errorMsg = error.reason;
                }
                
                if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
                    toast.error('Authentication failed. Please check your Razorpay key configuration.');
                } else {
                    toast.error(`Razorpay Error: ${errorMsg}`);
                }
            });

            try {
                console.log('🚀 Opening Razorpay checkout...');
                rzp1.open();
                setLoading(false);
                console.log('✅ Razorpay checkout opened successfully');
            } catch (openError: any) {
                setLoading(false);
                console.error('❌ Error opening Razorpay:', openError);
                toast.error(`Failed to open payment gateway: ${openError.message || 'Unknown error'}`);
            }

        } catch (error: any) {
            setLoading(false);
            console.error('Payment Error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            
            let errorMessage = 'Failed to initiate payment';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(`Error: ${errorMessage}`);
        }
    };

    return (
        <Layout title="Support Our Cause">
            <div className="donation-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <Card title="Make a Donation">
                    {!Razorpay && !isLoading && (
                        <div style={{ 
                            padding: '12px', 
                            marginBottom: '20px', 
                            background: '#FFEBEE', 
                            color: '#C62828', 
                            borderRadius: '8px',
                            border: '1px solid #E57373'
                        }}>
                            ⚠️ Razorpay is not loaded. Please refresh the page.
                        </div>
                    )}
                    {razorpayError && (
                        <div style={{ 
                            padding: '12px', 
                            marginBottom: '20px', 
                            background: '#FFEBEE', 
                            color: '#C62828', 
                            borderRadius: '8px',
                            border: '1px solid #E57373'
                        }}>
                            ⚠️ Razorpay Error: {razorpayError}
                        </div>
                    )}
                    <p style={{ marginBottom: '20px' }}>
                        Your donation helps us provide legal aid, counseling, and emergency support to victims of domestic violence.
                    </p>

                    <div className="amount-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {[100, 500, 1000, 5000].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    border: amount === val ? '2px solid #9B7EDE' : '1px solid #ddd',
                                    background: amount === val ? '#E8DEFF' : 'white',
                                    cursor: 'pointer',
                                    fontWeight: amount === val ? 'bold' : 'normal'
                                }}
                            >
                                ₹{val}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Custom Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {isLoading && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#9B7EDE' }}>
                            Loading Razorpay...
                        </div>
                    )}
                    {razorpayError && (
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: '#E57373' }}>
                            Error: {razorpayError}
                        </div>
                    )}
                    <Button 
                        variant="primary" 
                        fullWidth 
                        onClick={handlePayment}
                        disabled={loading || isLoading || !Razorpay}
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </Button>
                </Card>
            </div>
        </Layout>
    );
};

export default DonationPage;

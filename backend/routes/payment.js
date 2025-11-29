import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpayKeyId = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim().replace(/\s+/g, '') : null;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim().replace(/\s+/g, '') : null;

if (!razorpayKeyId || !razorpayKeySecret) {
    console.error('⚠️  WARNING: Razorpay keys are not set in environment variables!');
    console.error('Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file');
} else {
    console.log('✅ Razorpay keys loaded successfully');
    console.log('Key ID:', razorpayKeyId.substring(0, 15) + '...');
    console.log('Key Secret:', razorpayKeySecret.substring(0, 10) + '...');
    console.log('⚠️  IMPORTANT: Make sure VITE_RAZORPAY_KEY_ID in frontend/.env matches RAZORPAY_KEY_ID in backend/.env');
}

const razorpay = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        if (!razorpayKeyId || !razorpayKeySecret) {
            return res.status(500).json({ 
                message: 'Razorpay keys are not configured. Please contact administrator.',
                error: 'Missing Razorpay credentials'
            });
        }

        const { amount, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: `receipt_${Date.now()}`
        };

        console.log('Creating Razorpay order with options:', JSON.stringify(options, null, 2));
        
        try {
            const order = await razorpay.orders.create(options);
            console.log('Order created successfully:', order.id);
            res.json(order);
        } catch (razorpayError) {
            console.error('Razorpay API Error:', razorpayError);
            console.error('Razorpay Error Details:', JSON.stringify(razorpayError, null, 2));
            
            if (razorpayError.error) {
                const errorMsg = razorpayError.error.description || razorpayError.error.reason || razorpayError.message;
                return res.status(500).json({ 
                    message: errorMsg || 'Failed to create payment order',
                    error: razorpayError.error,
                    code: razorpayError.error.code
                });
            }
            
            throw razorpayError;
        }
    } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error stack:', error.stack);
        
        let errorMessage = 'Something went wrong while creating payment order';
        if (error.message) {
            errorMessage = error.message;
        }
        if (error.error?.description) {
            errorMessage = error.error.description;
        }
        
        res.status(500).json({ 
            message: errorMessage,
            error: error.error || error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Verify Payment
router.post('/verify-payment', (req, res) => {
    try {
        if (!razorpayKeySecret) {
            return res.status(500).json({ 
                message: 'Razorpay key secret is not configured',
                error: 'Missing Razorpay credentials'
            });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        console.log('Verifying payment:', {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature_present: !!razorpay_signature
        });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.error('Missing payment details:', { razorpay_order_id, razorpay_payment_id, razorpay_signature });
            return res.status(400).json({ message: 'Missing payment details' });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(sign.toString())
            .digest("hex");

        console.log('Signature verification:', {
            received: razorpay_signature,
            expected: expectedSign,
            match: razorpay_signature === expectedSign
        });

        if (razorpay_signature === expectedSign) {
            console.log('Payment verified successfully');
            res.json({ 
                success: true,
                message: "Payment verified successfully",
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id
            });
        } else {
            console.error('Signature mismatch!');
            res.status(400).json({ 
                success: false,
                message: "Invalid signature sent!" 
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: error.message 
        });
    }
});

export default router;

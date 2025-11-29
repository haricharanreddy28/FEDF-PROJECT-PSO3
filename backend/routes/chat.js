import express from 'express';
import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;


    const userIdObj = new mongoose.Types.ObjectId(userId);
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: userIdObj },
            { receiverId: userIdObj },
          ],
        },
      },
      {
        $project: {
          otherUserId: {
            $cond: [
              { $eq: ['$senderId', userIdObj] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: '$$ROOT',
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
      {
        $group: {
          _id: '$otherUserId',
          lastMessage: { $first: '$lastMessage' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$lastMessage.receiverId', userIdObj] },
                    { $eq: ['$lastMessage.read', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);


    const populatedConversations = await ChatMessage.populate(conversations, {
      path: '_id',
      select: 'name email role',
    });

    res.json(populatedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/messages/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;


    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
      return res.status(400).json({ message: 'Invalid current user ID format' });
    }

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid other user ID format' });
    }

    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId);
    const otherUserIdObj = new mongoose.Types.ObjectId(otherUserId);

    const messages = await ChatMessage.find({
      $or: [
        { senderId: currentUserIdObj, receiverId: otherUserIdObj },
        { senderId: otherUserIdObj, receiverId: currentUserIdObj },
      ],
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: 1 });


    await ChatMessage.updateMany(
      {
        senderId: otherUserIdObj,
        receiverId: currentUserIdObj,
        read: false,
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
});


router.post('/send', authenticate, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    console.log('=== SEND MESSAGE ===');
    console.log('Sender ID:', senderId);
    console.log('Receiver ID:', receiverId);
    console.log('Message:', message);

    if (!receiverId || !message) {
      console.log('❌ Missing receiver ID or message');
      return res.status(400).json({ message: 'Receiver ID and message are required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      console.log('❌ Invalid sender ID format');
      return res.status(400).json({ message: 'Invalid sender ID format' });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.log('❌ Invalid receiver ID format:', receiverId);
      return res.status(400).json({ message: 'Invalid receiver ID format' });
    }

    const senderIdObj = new mongoose.Types.ObjectId(senderId);
    const receiverIdObj = new mongoose.Types.ObjectId(receiverId);

    const chatMessage = new ChatMessage({
      senderId: senderIdObj,
      receiverId: receiverIdObj,
      message: message.trim(),
    });

    await chatMessage.save();
    await chatMessage.populate('senderId', 'name email role');
    await chatMessage.populate('receiverId', 'name email role');

    console.log('✓ Message sent successfully');
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: error.message || 'Failed to send message' });
  }
});


router.put('/read/:userId', authenticate, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;


    const currentUserIdObj = mongoose.Types.ObjectId.isValid(currentUserId)
      ? new mongoose.Types.ObjectId(currentUserId)
      : currentUserId;
    const otherUserIdObj = mongoose.Types.ObjectId.isValid(otherUserId)
      ? new mongoose.Types.ObjectId(otherUserId)
      : otherUserId;

    await ChatMessage.updateMany(
      {
        senderId: otherUserIdObj,
        receiverId: currentUserIdObj,
        read: false,
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;


import User from '../models/User.js';
import VictimAssignment from '../models/VictimAssignment.js';

export const analyzeSituation = async (req, res) => {
  try {
    console.log('=== AI ANALYZE REQUEST ===');
    console.log('Request body:', req.body);
    const { message } = req.body;

    if (!message) {
      console.log('❌ Message is missing');
      return res.status(400).json({ message: 'Message is required' });
    }

    // Mock AI Analysis Logic
    // In a real app, this would call an LLM API (OpenAI, Gemini, etc.)
    const lowerMessage = message.toLowerCase();

    const legalKeywords = ['law', 'legal', 'court', 'police', 'rights', 'divorce', 'custody', 'judge', 'lawyer', 'fir', 'complaint', 'case', 'protection order'];
    const counsellorKeywords = ['sad', 'depressed', 'scared', 'fear', 'anxiety', 'cry', 'emotional', 'trauma', 'help', 'suicide', 'hurt', 'alone', 'hopeless', 'abuse'];

    let legalScore = 0;
    let counsellorScore = 0;

    legalKeywords.forEach(word => {
      if (lowerMessage.includes(word)) legalScore++;
    });

    counsellorKeywords.forEach(word => {
      if (lowerMessage.includes(word)) counsellorScore++;
    });

    let recommendation = 'counsellor'; // Default
    let reasoning = 'Based on your emotional distress, we recommend speaking with a counsellor first.';

    if (legalScore > counsellorScore) {
      recommendation = 'legal';
      reasoning = 'It seems you have legal concerns. We recommend speaking with a legal advisor.';
    }

    res.json({
      recommendation,
      reasoning,
      analysis: {
        legalScore,
        counsellorScore,
        message: message
      }
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ message: 'Error analyzing situation' });
  }
};

export const allocateProfessional = async (req, res) => {
  try {
    const { role, aiAnalysis } = req.body;
    const victimId = req.user.id;

    console.log('=== ALLOCATE PROFESSIONAL ===');
    console.log('Victim ID:', victimId);
    console.log('Requested role:', role);
    console.log('AI Analysis:', aiAnalysis);

    if (!['counsellor', 'legal'].includes(role)) {
      console.log('❌ Invalid role specified');
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if victim already has an assignment for this role
    const existingAssignment = await VictimAssignment.findOne({
      victimId,
      professionalType: role
    }).populate('assignedProfessionalId');

    if (existingAssignment) {
      console.log('✓ Found existing assignment:', existingAssignment.assignedProfessionalId.name);
      return res.json({
        professional: {
          id: existingAssignment.assignedProfessionalId._id.toString(),
          name: existingAssignment.assignedProfessionalId.name,
          role: existingAssignment.assignedProfessionalId.role,
          email: existingAssignment.assignedProfessionalId.email
        },
        isExisting: true
      });
    }

    // Find all users with this role
    const professionals = await User.find({ role: role });
    console.log(`Found ${professionals.length} professionals with role: ${role}`);

    if (professionals.length === 0) {
      console.log(`❌ No ${role} available`);
      return res.status(404).json({ message: `No ${role} available at the moment. Please contact support.` });
    }

    // Simple random allocation
    const allocatedProfessional = professionals[Math.floor(Math.random() * professionals.length)];
    console.log('✓ Allocated professional:', allocatedProfessional.name);

    // Save the assignment
    const assignment = new VictimAssignment({
      victimId,
      assignedProfessionalId: allocatedProfessional._id,
      professionalType: role,
      aiAnalysis: aiAnalysis || '',
    });
    await assignment.save();
    console.log('✓ Assignment saved to database');

    const professionalData = {
      id: allocatedProfessional._id.toString(),
      name: allocatedProfessional.name,
      role: allocatedProfessional.role,
      email: allocatedProfessional.email
    };
    console.log('✓ Returning professional data:', professionalData);

    res.json({
      professional: professionalData,
      isExisting: false
    });

  } catch (error) {
    console.error('❌ Allocation Error:', error);
    res.status(500).json({ message: 'Error allocating professional: ' + error.message });
  }
};

// Get assigned professionals for a victim
export const getAssignedProfessionals = async (req, res) => {
  try {
    const victimId = req.user.id;

    const assignments = await VictimAssignment.find({ victimId }).populate('assignedProfessionalId');

    const professionals = assignments.map(assignment => ({
      id: assignment.assignedProfessionalId._id,
      name: assignment.assignedProfessionalId.name,
      role: assignment.assignedProfessionalId.role,
      email: assignment.assignedProfessionalId.email,
      professionalType: assignment.professionalType,
      assignedAt: assignment.assignedAt,
      isFirstLogin: assignment.isFirstLogin
    }));

    res.json({ professionals });

  } catch (error) {
    console.error('Get Assignments Error:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

// Mark first login as complete
export const markFirstLoginComplete = async (req, res) => {
  try {
    const victimId = req.user.id;

    await VictimAssignment.updateMany(
      { victimId, isFirstLogin: true },
      { isFirstLogin: false }
    );

    res.json({ success: true });

  } catch (error) {
    console.error('Mark First Login Error:', error);
    res.status(500).json({ message: 'Error updating first login status' });
  }
};

// Get assigned victims for a professional (counsellor or legal advisor)
export const getAssignedVictims = async (req, res) => {
  try {
    const professionalId = req.user.id;
    const professionalRole = req.user.role;

    if (!['counsellor', 'legal'].includes(professionalRole)) {
      return res.status(403).json({ message: 'Only counsellors and legal advisors can access this endpoint' });
    }

    const assignments = await VictimAssignment.find({
      assignedProfessionalId: professionalId
    }).populate('victimId');

    const victims = assignments.map(assignment => ({
      id: assignment.victimId._id,
      name: assignment.victimId.name,
      email: assignment.victimId.email,
      assignedAt: assignment.assignedAt,
      aiAnalysis: assignment.aiAnalysis,
      professionalType: assignment.professionalType
    }));

    res.json({ victims });

  } catch (error) {
    console.error('Get Assigned Victims Error:', error);
    res.status(500).json({ message: 'Error fetching assigned victims' });
  }
};

// Transfer chat from one professional to another
export const transferChat = async (req, res) => {
  try {
    const { victimId, newProfessionalType, reason } = req.body;
    const currentProfessionalId = req.user.id;
    const currentProfessionalRole = req.user.role;

    console.log('=== TRANSFER CHAT ===');
    console.log('Current Professional ID:', currentProfessionalId);
    console.log('Current Professional Role:', currentProfessionalRole);
    console.log('Victim ID:', victimId);
    console.log('New Professional Type:', newProfessionalType);
    console.log('Reason:', reason);

    if (!['counsellor', 'legal'].includes(currentProfessionalRole)) {
      return res.status(403).json({ message: 'Only counsellors and legal advisors can transfer chats' });
    }

    if (!['counsellor', 'legal'].includes(newProfessionalType)) {
      return res.status(400).json({ message: 'Invalid professional type' });
    }

    // Find current assignment
    const currentAssignment = await VictimAssignment.findOne({
      victimId,
      assignedProfessionalId: currentProfessionalId
    });

    if (!currentAssignment) {
      return res.status(404).json({ message: 'No assignment found for this victim' });
    }

    // Find a new professional of the requested type
    const newProfessionals = await User.find({ role: newProfessionalType });

    if (newProfessionals.length === 0) {
      return res.status(404).json({ message: `No ${newProfessionalType} available for transfer` });
    }

    // Random allocation
    const newProfessional = newProfessionals[Math.floor(Math.random() * newProfessionals.length)];
    console.log('✓ New professional selected:', newProfessional.name);

    // Update or create new assignment
    const existingNewAssignment = await VictimAssignment.findOne({
      victimId,
      professionalType: newProfessionalType
    });

    if (existingNewAssignment) {
      // Update existing assignment
      existingNewAssignment.assignedProfessionalId = newProfessional._id;
      existingNewAssignment.transferredFrom = currentProfessionalId;
      existingNewAssignment.transferReason = reason || '';
      existingNewAssignment.transferredAt = new Date();
      await existingNewAssignment.save();
      console.log('✓ Updated existing assignment');
    } else {
      // Create new assignment
      const newAssignment = new VictimAssignment({
        victimId,
        assignedProfessionalId: newProfessional._id,
        professionalType: newProfessionalType,
        transferredFrom: currentProfessionalId,
        transferReason: reason || '',
        transferredAt: new Date(),
        isFirstLogin: false
      });
      await newAssignment.save();
      console.log('✓ Created new assignment');
    }

    res.json({
      success: true,
      message: `Chat transferred to ${newProfessionalType}`,
      newProfessional: {
        id: newProfessional._id.toString(),
        name: newProfessional.name,
        role: newProfessional.role,
        email: newProfessional.email
      }
    });

  } catch (error) {
    console.error('❌ Transfer Error:', error);
    res.status(500).json({ message: 'Error transferring chat: ' + error.message });
  }
};

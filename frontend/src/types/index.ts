export type UserRole = 'admin' | 'victim' | 'counsellor' | 'legal';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface LegalRight {
  id: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SupportService {
  id: string;
  name: string;
  description: string;
  contact: string;
  location: string;
  category: string;
}

export interface CaseNote {
  id: string;
  survivorId: string;
  counsellorId: string;
  date: string;
  notes: string;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RiskAssessment {
  id: string;
  survivorId: string;
  counsellorId: string;
  date: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
  notes: string;
}

export interface Session {
  id: string;
  survivorId: string;
  counsellorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}


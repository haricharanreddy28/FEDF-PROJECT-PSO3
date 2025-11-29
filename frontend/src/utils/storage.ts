import { User, LegalRight, SupportService, CaseNote } from '../types';

const STORAGE_KEYS = {
  USERS: 'dv_app_users',
  CURRENT_USER: 'dv_app_current_user',
  LEGAL_RIGHTS: 'dv_app_legal_rights',
  SUPPORT_SERVICES: 'dv_app_support_services',
  CASE_NOTES: 'dv_app_case_notes',
  CHAT_MESSAGES: 'dv_app_chat_messages',
  THEME: 'dv_app_theme',
};


export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id || u.email === user.email);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
};


export const getCurrentUser = (): User | null => {
  const data = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};


export const getLegalRights = (): LegalRight[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LEGAL_RIGHTS);
  return data ? JSON.parse(data) : [];
};

export const saveLegalRight = (right: LegalRight): void => {
  const rights = getLegalRights();
  const existingIndex = rights.findIndex(r => r.id === right.id);
  if (existingIndex >= 0) {
    rights[existingIndex] = right;
  } else {
    rights.push(right);
  }
  localStorage.setItem(STORAGE_KEYS.LEGAL_RIGHTS, JSON.stringify(rights));
};

export const deleteLegalRight = (id: string): void => {
  const rights = getLegalRights();
  const filtered = rights.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.LEGAL_RIGHTS, JSON.stringify(filtered));
};


export const getSupportServices = (): SupportService[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SUPPORT_SERVICES);
  return data ? JSON.parse(data) : [];
};

export const saveSupportService = (service: SupportService): void => {
  const services = getSupportServices();
  const existingIndex = services.findIndex(s => s.id === service.id);
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push(service);
  }
  localStorage.setItem(STORAGE_KEYS.SUPPORT_SERVICES, JSON.stringify(services));
};

export const deleteSupportService = (id: string): void => {
  const services = getSupportServices();
  const filtered = services.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SUPPORT_SERVICES, JSON.stringify(filtered));
};


export const getCaseNotes = (): CaseNote[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CASE_NOTES);
  return data ? JSON.parse(data) : [];
};

export const saveCaseNote = (note: CaseNote): void => {
  const notes = getCaseNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  localStorage.setItem(STORAGE_KEYS.CASE_NOTES, JSON.stringify(notes));
};

export const deleteCaseNote = (id: string): void => {
  const notes = getCaseNotes();
  const filtered = notes.filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.CASE_NOTES, JSON.stringify(filtered));
};


export const getTheme = (): 'light' | 'dark' => {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  return (theme as 'light' | 'dark') || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};


export const clearSessionData = (): void => {
  sessionStorage.clear();
};


export const clearAllData = (): void => {
  localStorage.clear();
  sessionStorage.clear();
};


export const initializeDefaultData = (): void => {
  
  if (getLegalRights().length === 0) {
    const defaultRights: LegalRight[] = [
      {
        id: '1',
        title: 'Constitutional Right to Equality (Article 14 & 15)',
        description: 'The Constitution of India guarantees you the right to equality before law (Article 14) and prohibits discrimination on grounds of religion, race, caste, sex, or place of birth (Article 15). You have equal protection of laws and equal access to justice regardless of your gender.',
        category: 'Constitutional Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '2',
        title: 'Right to Life and Personal Liberty (Article 21)',
        description: 'Article 21 of the Constitution guarantees your right to life and personal liberty, which includes the right to live with dignity, free from violence and abuse. This fundamental right cannot be taken away except by procedure established by law.',
        category: 'Constitutional Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '3',
        title: 'Protection of Women from Domestic Violence Act, 2005',
        description: 'Under this Act, you can seek: (1) Protection Orders to prevent further violence, (2) Residence Orders to stay in the shared household, (3) Monetary Relief for expenses and losses, (4) Custody Orders for children, (5) Compensation Orders. File a complaint with the Protection Officer or directly approach the Magistrate under Section 12.',
        category: 'Domestic Violence Act',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '4',
        title: 'Right to File FIR (Section 154 CrPC)',
        description: 'You have the absolute right to file a First Information Report (FIR) at any police station, regardless of jurisdiction. Under Section 154 of CrPC, the police MUST register your complaint. If refused, you can: (1) Approach the Superintendent of Police, (2) File online FIR, (3) Approach the Magistrate under Section 156(3) CrPC, (4) File a complaint with the State Human Rights Commission.',
        category: 'Criminal Law',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '5',
        title: 'Protection under Section 498A IPC (Cruelty by Husband)',
        description: 'Section 498A of the Indian Penal Code makes cruelty by husband or relatives a cognizable, non-bailable, and non-compoundable offence. Cruelty includes: (1) Willful conduct causing mental or physical harm, (2) Harassment for dowry, (3) Any act endangering your life or health. Punishment: Up to 3 years imprisonment and fine.',
        category: 'Criminal Law',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '6',
        title: 'Right to Maintenance (Section 125 CrPC & DV Act)',
        description: 'You have the right to claim maintenance under: (1) Section 125 CrPC - If you are unable to maintain yourself, you can claim maintenance from your husband, (2) Section 20 of DV Act - Monetary relief for expenses, losses, and maintenance, (3) Hindu Marriage Act Section 24 - Interim maintenance during proceedings. The amount depends on your needs and the respondent\'s income.',
        category: 'Financial Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '7',
        title: 'Right to Residence (Section 17 & 19 DV Act)',
        description: 'Under Section 17 of the Domestic Violence Act, you have the right to reside in the shared household. Section 19 allows the Magistrate to pass residence orders: (1) Restraining the respondent from dispossessing you, (2) Directing the respondent to provide alternate accommodation, (3) Restraining the respondent from entering the shared household. This right cannot be taken away even if you have no title or rights in the property.',
        category: 'Domestic Violence Act',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '8',
        title: 'Right to Custody of Children (Section 21 DV Act)',
        description: 'Under Section 21 of the Domestic Violence Act, the Magistrate can grant you temporary custody of children and visitation rights. The welfare of the child is the paramount consideration. You can also seek custody under the Guardians and Wards Act, 1890, and the Hindu Minority and Guardianship Act, 1956.',
        category: 'Domestic Violence Act',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '9',
        title: 'Protection from Sexual Harassment (Section 354A, 354B, 354C, 354D IPC)',
        description: 'The Indian Penal Code provides protection against: (1) Section 354A - Sexual harassment (punishment: 1-3 years), (2) Section 354B - Assault or use of criminal force with intent to disrobe (punishment: 3-7 years), (3) Section 354C - Voyeurism (punishment: 1-3 years), (4) Section 354D - Stalking (punishment: up to 3 years). All are cognizable and non-bailable offences.',
        category: 'Criminal Law',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '10',
        title: 'Right to Free Legal Aid (Legal Services Authorities Act, 1987)',
        description: 'Under Section 12 of the Legal Services Authorities Act, you are entitled to free legal services if: (1) You are a woman, (2) Your annual income is below the prescribed limit, (3) You are a victim of trafficking or domestic violence. Contact your nearest District Legal Services Authority (DLSA), Taluk Legal Services Committee (TLSC), or State Legal Services Authority (SLSA) for assistance.',
        category: 'Legal Aid',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '11',
        title: 'Right to Privacy and Confidentiality',
        description: 'Your privacy is protected under: (1) Section 327 CrPC - Court proceedings can be held in camera (private) to protect your identity, (2) Section 228A IPC - Disclosure of identity of rape victim is punishable, (3) Section 23 of DV Act - Proceedings are confidential, (4) Right to Privacy is a fundamental right under Article 21. Media cannot publish your name or photograph without consent.',
        category: 'Privacy Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '12',
        title: 'Right to Compensation (Section 357 CrPC & DV Act)',
        description: 'You have the right to claim compensation: (1) Section 357 CrPC - Court can order compensation to victims, (2) Section 22 of DV Act - Compensation for injuries, mental trauma, and losses, (3) Victim Compensation Scheme - State governments provide compensation ranging from ₹50,000 to ₹10,00,000 depending on the nature of the offence. Apply through the District Legal Services Authority.',
        category: 'Financial Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '13',
        title: 'Protection from Dowry Harassment (Section 498A & Dowry Prohibition Act)',
        description: 'The Dowry Prohibition Act, 1961 makes giving, taking, or demanding dowry illegal. Section 498A IPC makes dowry harassment a serious offence. If you face harassment for dowry, you can: (1) File FIR under Section 498A IPC, (2) File complaint under Dowry Prohibition Act, (3) Seek protection orders under DV Act. Punishment: Up to 3 years imprisonment and fine.',
        category: 'Criminal Law',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '14',
        title: 'Right to Medical Examination and Treatment',
        description: 'You have the right to: (1) Free medical examination at government hospitals, (2) Medical treatment for injuries sustained, (3) Medical evidence collection for legal proceedings, (4) Access to One Stop Centres (Sakhi) for integrated medical, legal, and psychological support. Medical reports are crucial evidence in court proceedings.',
        category: 'Medical Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '15',
        title: 'Right to Protection Orders (Section 18-23 DV Act)',
        description: 'The Magistrate can pass various protection orders: (1) Section 18 - Protection Orders to prevent further acts of domestic violence, (2) Section 19 - Residence Orders for housing rights, (3) Section 20 - Monetary Relief for expenses and maintenance, (4) Section 21 - Custody Orders for children, (5) Section 22 - Compensation Orders. These orders are enforceable and violation is punishable under Section 31.',
        category: 'Domestic Violence Act',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '16',
        title: 'Right to Approach Women\'s Commission',
        description: 'You can approach: (1) National Commission for Women (NCW) - For complaints and legal assistance, (2) State Commission for Women - State-level support and intervention, (3) District Women\'s Protection Committee - Local level support. These commissions can: investigate complaints, recommend action, provide legal aid, and monitor implementation of laws.',
        category: 'Legal Support',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '17',
        title: 'Right to Divorce and Separation',
        description: 'You can seek divorce under: (1) Hindu Marriage Act Section 13 - On grounds of cruelty, desertion, adultery, etc., (2) Special Marriage Act - For inter-religious marriages, (3) Muslim Personal Law - Talaq and Khula provisions, (4) Christian Marriage Act - For Christian marriages. You can also seek judicial separation under Section 10 of Hindu Marriage Act as an alternative to divorce.',
        category: 'Family Law',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
      {
        id: '18',
        title: 'Right to Property and Inheritance',
        description: 'You have inheritance rights under: (1) Hindu Succession Act, 1956 - Equal rights in ancestral and self-acquired property, (2) Section 14 of Hindu Succession Act - Absolute ownership of property, (3) Muslim Personal Law - Inheritance as per Sharia, (4) Indian Succession Act - For other communities. You cannot be deprived of your property rights due to domestic violence.',
        category: 'Property Rights',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.LEGAL_RIGHTS, JSON.stringify(defaultRights));
  }

  
  if (getSupportServices().length === 0) {
    const defaultServices: SupportService[] = [
      {
        id: '1',
        name: 'Women Helpline (All India)',
        description: '24/7 women support and protection helpline',
        contact: '1091',
        location: 'All India',
        category: 'Emergency',
      },
      {
        id: '2',
        name: 'Police Emergency',
        description: 'Immediate police assistance and emergency response',
        contact: '100',
        location: 'All India',
        category: 'Emergency',
      },
      {
        id: '3',
        name: 'National Commission for Women',
        description: 'Women rights protection, legal support, and complaint redressal',
        contact: '011-23237166',
        location: 'New Delhi',
        category: 'Legal Support',
      },
      {
        id: '4',
        name: 'Child Helpline',
        description: '24/7 child protection and support services',
        contact: '1098',
        location: 'All India',
        category: 'Child Support',
      },
      {
        id: '5',
        name: 'One Stop Centre (Sakhi)',
        description: 'Integrated support center providing medical, legal, psychological, and shelter support',
        contact: '181',
        location: 'Multiple States',
        category: 'Support Services',
      },
      {
        id: '6',
        name: 'District Legal Services Authority (DLSA)',
        description: 'Free legal aid, counseling, and legal representation',
        contact: 'Contact local DLSA office',
        location: 'All Districts',
        category: 'Legal Aid',
      },
      {
        id: '7',
        name: 'Women Protection Cell',
        description: 'Specialized police unit for handling cases of violence against women',
        contact: 'Contact local police station',
        location: 'All Districts',
        category: 'Legal Support',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SUPPORT_SERVICES, JSON.stringify(defaultServices));
  }

  
  if (getUsers().length === 0) {
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@safeplace.com',
      password: 'admin123', 
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    addUser(adminUser);
  }
};


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import LegalRight from '../models/LegalRight.js';
import SupportService from '../models/SupportService.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();


    await User.deleteMany({});
    await LegalRight.deleteMany({});
    await SupportService.deleteMany({});


    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@safeplace.com',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('✅ Admin user created');

    // Create Counsellors with South Indian names
    const counsellors = [
      {
        name: 'Dr. Lakshmi Venkataraman',
        email: 'lakshmi.v@safeplace.com',
        password: 'counsellor123',
        role: 'counsellor',
      },
      {
        name: 'Dr. Priya Ramachandran',
        email: 'priya.r@safeplace.com',
        password: 'counsellor123',
        role: 'counsellor',
      },
      {
        name: 'Dr. Meenakshi Subramanian',
        email: 'meenakshi.s@safeplace.com',
        password: 'counsellor123',
        role: 'counsellor',
      },
      {
        name: 'Dr. Kavitha Narayanan',
        email: 'kavitha.n@safeplace.com',
        password: 'counsellor123',
        role: 'counsellor',
      },
      {
        name: 'Dr. Anjali Krishnamurthy',
        email: 'anjali.k@safeplace.com',
        password: 'counsellor123',
        role: 'counsellor',
      },
    ];

    for (const counsellorData of counsellors) {
      const counsellor = new User(counsellorData);
      await counsellor.save();
    }
    console.log('✅ 5 Counsellors created');

    // Create Legal Advisors with South Indian names
    const legalAdvisors = [
      {
        name: 'Adv. Raghavan Iyer',
        email: 'raghavan.i@safeplace.com',
        password: 'legal123',
        role: 'legal',
      },
      {
        name: 'Adv. Suresh Kumar',
        email: 'suresh.k@safeplace.com',
        password: 'legal123',
        role: 'legal',
      },
      {
        name: 'Adv. Vijayalakshmi Reddy',
        email: 'vijaya.r@safeplace.com',
        password: 'legal123',
        role: 'legal',
      },
      {
        name: 'Adv. Balakrishnan Nair',
        email: 'balakrishnan.n@safeplace.com',
        password: 'legal123',
        role: 'legal',
      },
      {
        name: 'Adv. Padmavathi Srinivasan',
        email: 'padmavathi.s@safeplace.com',
        password: 'legal123',
        role: 'legal',
      },
    ];

    for (const legalData of legalAdvisors) {
      const legal = new User(legalData);
      await legal.save();
    }
    console.log('✅ 5 Legal Advisors created');


    const legalRights = [
      {
        title: 'Constitutional Right to Equality (Article 14 & 15)',
        description: 'The Constitution of India guarantees you the right to equality before law (Article 14) and prohibits discrimination on grounds of religion, race, caste, sex, or place of birth (Article 15). You have equal protection of laws and equal access to justice regardless of your gender.',
        category: 'Constitutional Rights',
        updatedBy: 'System',
      },
      {
        title: 'Right to Life and Personal Liberty (Article 21)',
        description: 'Article 21 of the Constitution guarantees your right to life and personal liberty, which includes the right to live with dignity, free from violence and abuse. This fundamental right cannot be taken away except by procedure established by law.',
        category: 'Constitutional Rights',
        updatedBy: 'System',
      },
      {
        title: 'Protection of Women from Domestic Violence Act, 2005',
        description: 'Under this Act, you can seek: (1) Protection Orders to prevent further violence, (2) Residence Orders to stay in the shared household, (3) Monetary Relief for expenses and losses, (4) Custody Orders for children, (5) Compensation Orders. File a complaint with the Protection Officer or directly approach the Magistrate under Section 12.',
        category: 'Domestic Violence Act',
        updatedBy: 'System',
      },
    ];

    await LegalRight.insertMany(legalRights);
    console.log('✅ Legal rights seeded');


    const supportServices = [
      {
        name: 'Women Helpline (All India)',
        description: '24/7 women support and protection helpline',
        contact: '1091',
        location: 'All India',
        category: 'Emergency',
      },
      {
        name: 'Police Emergency',
        description: 'Immediate police assistance and emergency response',
        contact: '100',
        location: 'All India',
        category: 'Emergency',
      },
      {
        name: 'National Commission for Women',
        description: 'Women rights protection, legal support, and complaint redressal',
        contact: '011-23237166',
        location: 'New Delhi',
        category: 'Legal Support',
      },
    ];

    await SupportService.insertMany(supportServices);
    console.log('✅ Support services seeded');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();


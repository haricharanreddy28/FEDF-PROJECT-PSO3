import React from 'react';
import { getLegalRights } from '../utils/storage';
import Card from '../components/Card';
import SafeExitButton from '../components/SafeExitButton';

const RightsPage: React.FC = () => {
  const legalRights = getLegalRights();

  return (
    <div className="rights-page">
      <SafeExitButton />
      <div className="rights-container">
        <div className="rights-hero">
          <h1>Know Your Rights</h1>
          <p>Understanding your legal rights is an important step towards safety and justice.</p>
        </div>

        <section className="rights-content">
          {legalRights.length > 0 ? (
            <div className="rights-grid">
              {legalRights.map((right) => (
                <Card key={right.id} className="right-card">
                  <div className="right-header">
                    <h3>{right.title}</h3>
                    <span className="category-badge">{right.category}</span>
                  </div>
                  <p className="right-description">{right.description}</p>
                  <div className="right-footer">
                    <small>Last updated: {new Date(right.updatedAt).toLocaleDateString()}</small>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p>No legal rights information available at this time.</p>
            </Card>
          )}
        </section>

        <section className="rights-info">
          <Card>
            <h2>Important Information About Your Rights</h2>
            <ul>
              <li><strong>Constitutional Protection:</strong> Your rights are protected under the Constitution of India (Articles 14, 15, 21)</li>
              <li><strong>Legal Protection:</strong> Multiple laws protect you including the Protection of Women from Domestic Violence Act, 2005, and various sections of the Indian Penal Code</li>
              <li><strong>Right to File Complaint:</strong> You can file an FIR at any police station - they cannot refuse to register your complaint</li>
              <li><strong>Free Legal Aid:</strong> You are entitled to free legal services under the Legal Services Authorities Act, 1987</li>
              <li><strong>Privacy Rights:</strong> Your identity and case details are protected - court proceedings can be held in private</li>
              <li><strong>Financial Rights:</strong> You have the right to claim maintenance, compensation, and monetary relief</li>
              <li><strong>Residence Rights:</strong> You have the right to stay in the shared household under the Domestic Violence Act</li>
              <li><strong>Medical Rights:</strong> You have the right to free medical examination and treatment at government hospitals</li>
              <li><strong>Support Services:</strong> You can access One Stop Centres (Sakhi), Women Helpline (1091), and District Legal Services Authority</li>
              <li><strong>No Time Limit:</strong> There is no time limit to file a complaint under the Domestic Violence Act - you can file anytime</li>
            </ul>
            <div className="legal-note">
              <p><strong>Note:</strong> These rights are guaranteed by the Indian Constitution and various Acts of Parliament. If your rights are violated, you can approach the police, Protection Officer, Magistrate, or Women's Commission for redressal.</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default RightsPage;


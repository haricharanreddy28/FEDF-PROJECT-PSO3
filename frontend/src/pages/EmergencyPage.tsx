import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import SafeExitButton from '../components/SafeExitButton';

const EmergencyPage: React.FC = () => {
  const emergencyNumbers = [
    { name: 'Police Emergency', number: '100', description: 'Immediate Police Assistance' },
    { name: 'Women Helpline (All India)', number: '1091', description: '24/7 Women Support & Protection' },
    { name: 'Child Helpline', number: '1098', description: '24/7 Child Protection Services' },
    { name: 'National Commission for Women', number: '011-23237166', description: 'Women Rights & Legal Support' },
    { name: 'Domestic Violence Helpline (Delhi)', number: '181', description: 'Delhi Women Helpline' },
    { name: 'Emergency Medical Services', number: '108', description: 'Ambulance & Medical Emergency' },
  ];

  return (
    <div className="emergency-page">
      <SafeExitButton />
      <div className="emergency-container">
        <Card className="emergency-hero">
          <h1>🆘 Emergency Help</h1>
          <p className="emergency-subtitle">If you are in immediate danger, please call 100 (Police) or 1091 (Women Helpline)</p>
          <div className="emergency-buttons">
            <Button
              variant="danger"
              size="large"
              onClick={() => window.open('tel:100')}
            >
              Call Police (100)
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={() => window.open('tel:1091')}
            >
              Women Helpline (1091)
            </Button>
          </div>
        </Card>

        <section className="emergency-section">
          <h2>Emergency Contacts</h2>
          <div className="emergency-grid">
            {emergencyNumbers.map((contact, index) => (
              <Card key={index} className="emergency-card">
                <h3>{contact.name}</h3>
                <p className="emergency-number">{contact.number}</p>
                <p className="emergency-description">{contact.description}</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (contact.number.includes('Text')) {
                      alert(`Text ${contact.number.split('Text ')[1]}`);
                    } else {
                      window.open(`tel:${contact.number.replace(/-/g, '')}`);
                    }
                  }}
                >
                  Contact
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="safety-tips">
          <Card>
            <h2>Safety Tips</h2>
            <ul>
              <li>If you are in immediate danger, call 100 (Police) or 1091 (Women Helpline)</li>
              <li>Have a safety plan ready and keep emergency numbers saved</li>
              <li>Keep important documents (Aadhaar, PAN, etc.) in a safe place</li>
              <li>Trust your instincts and seek help immediately</li>
              <li>Reach out to trusted friends, family, or local women's organizations</li>
              <li>You can file a complaint under the Protection of Women from Domestic Violence Act, 2005</li>
              <li>Contact your nearest police station or women's protection cell</li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default EmergencyPage;


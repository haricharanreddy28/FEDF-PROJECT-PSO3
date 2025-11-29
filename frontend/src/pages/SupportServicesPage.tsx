import React from 'react';
import { getSupportServices } from '../utils/storage';
import Card from '../components/Card';
import SafeExitButton from '../components/SafeExitButton';

const SupportServicesPage: React.FC = () => {
  const services = getSupportServices();

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="support-services-page">
      <SafeExitButton />
      <div className="services-container">
        <div className="services-hero">
          <h1>Support Services</h1>
          <p>Find the help and resources you need in your area.</p>
        </div>

        {Object.keys(servicesByCategory).length > 0 ? (
          Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <section key={category} className="services-section">
              <h2 className="category-title">{category} Services</h2>
              <div className="services-grid">
                {categoryServices.map((service) => (
                  <Card key={service.id} className="service-card">
                    <h3>{service.name}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-details">
                      <div className="detail-item">
                        <strong>📞 Contact:</strong> {service.contact}
                      </div>
                      <div className="detail-item">
                        <strong>📍 Location:</strong> {service.location}
                      </div>
                    </div>
                    <button
                      className="contact-button"
                      onClick={() => {
                        if (service.contact.includes('Text')) {
                          alert(`Text ${service.contact.split('Text ')[1]}`);
                        } else {
                          window.open(`tel:${service.contact.replace(/-/g, '')}`);
                        }
                      }}
                    >
                      Contact Now
                    </button>
                  </Card>
                ))}
              </div>
            </section>
          ))
        ) : (
          <Card>
            <p>No support services available at this time.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupportServicesPage;


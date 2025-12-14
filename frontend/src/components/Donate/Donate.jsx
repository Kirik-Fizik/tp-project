import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Donate.css';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const amounts = [5, 10, 25, 50, 100];

  const handleDonate = (e) => {
    e.preventDefault();
    const amount = selectedAmount || parseInt(customAmount);
    if (amount > 0) {
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    }
  };

  return (
    <div className="donate-page">
      <header className="donate-header">
        <div className="header-content">
          <Link to="/" className="back-btn">← Back to Home</Link>
          <h1>Support Startup Flow</h1>
          <div></div>
        </div>
      </header>

      <div className="donate-container">
        <div className="donate-hero">
          <div className="hero-icon">💝</div>
          <h2>Help Us Grow</h2>
          <p>
            Your donations help us maintain and improve the platform, 
            making it easier for startups to connect with their first customers.
          </p>
        </div>

        <div className="donate-card">
          <h3>Choose an Amount</h3>
          
          <div className="amount-buttons">
            {amounts.map((amount) => (
              <button
                key={amount}
                className={`amount-btn ${selectedAmount === amount ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
              >
                ${amount}
              </button>
            ))}
          </div>

          <div className="custom-amount">
            <label>Or enter custom amount</label>
            <div className="custom-input">
              <span className="currency">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="0"
                min="1"
              />
            </div>
          </div>

          <button 
            className="donate-btn"
            onClick={handleDonate}
            disabled={!selectedAmount && !customAmount}
          >
            Donate ${selectedAmount || customAmount || 0}
          </button>

          {showThankYou && (
            <div className="thank-you-message">
              Thank you for your generous donation! 🎉
            </div>
          )}
        </div>

        <div className="benefits-section">
          <h3>How Your Donation Helps</h3>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🚀</div>
              <h4>Platform Development</h4>
              <p>Fund new features and improvements to make the platform better for everyone.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h4>Server Costs</h4>
              <p>Keep the platform running smoothly with reliable hosting and infrastructure.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h4>Community Growth</h4>
              <p>Help us reach more startups and create a thriving ecosystem.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💡</div>
              <h4>Innovation</h4>
              <p>Support new tools and resources for startup founders.</p>
            </div>
          </div>
        </div>

        <div className="other-ways">
          <h3>Other Ways to Support</h3>
          <div className="support-options">
            <div className="support-option">
              <span className="support-icon">📢</span>
              <div>
                <h4>Spread the Word</h4>
                <p>Share Startup Flow with your network and help us grow organically.</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">💬</span>
              <div>
                <h4>Leave Feedback</h4>
                <p>Help us improve by sharing your suggestions and ideas.</p>
              </div>
            </div>
            <div className="support-option">
              <span className="support-icon">⭐</span>
              <div>
                <h4>Review Projects</h4>
                <p>Help startups grow by leaving constructive reviews on their projects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;

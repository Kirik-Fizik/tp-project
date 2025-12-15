import React from 'react';
import { Link } from 'react-router-dom';
import './Rules.css';

const Rules = () => {
  return (
    <div className="rules-page">
      <header className="rules-header">
        <div className="header-content">
          <Link to="/" className="back-btn">← Back to Home</Link>
          <h1>Platform Rules</h1>
          <div></div>
        </div>
      </header>

      <div className="rules-container">
        <section className="rules-section">
          <h2>General Guidelines</h2>
          <div className="rule-card">
            <h3>1. Respect Others</h3>
            <p>Treat all users with respect. No harassment, hate speech, or discriminatory behavior will be tolerated.</p>
          </div>
          <div className="rule-card">
            <h3>2. Authentic Projects Only</h3>
            <p>Only submit projects that you have created or have permission to share. Plagiarism is strictly prohibited.</p>
          </div>
          <div className="rule-card">
            <h3>3. Quality Content</h3>
            <p>Provide accurate descriptions and working links. Projects should be functional and add value to the community.</p>
          </div>
        </section>

        <section className="rules-section">
          <h2>Project Submission Rules</h2>
          <div className="rule-card">
            <h3>4. Clear Descriptions</h3>
            <p>Write clear, informative descriptions that explain what your project does and its key features.</p>
          </div>
          <div className="rule-card">
            <h3>5. Valid URLs</h3>
            <p>Ensure all project URLs are valid and lead to accessible content. Broken links will be removed.</p>
          </div>
          <div className="rule-card">
            <h3>6. No Spam</h3>
            <p>Do not submit duplicate projects or use the platform for advertising unrelated products or services.</p>
          </div>
        </section>

        <section className="rules-section">
          <h2>Review Guidelines</h2>
          <div className="rule-card">
            <h3>7. Constructive Feedback</h3>
            <p>Reviews should be helpful and constructive. Provide specific feedback that helps project creators improve.</p>
          </div>
          <div className="rule-card">
            <h3>8. Honest Ratings</h3>
            <p>Rate projects honestly based on your genuine experience. Do not manipulate ratings.</p>
          </div>
          <div className="rule-card">
            <h3>9. No Fake Reviews</h3>
            <p>Do not create fake accounts to boost your own projects or leave negative reviews on competitors.</p>
          </div>
        </section>

        <section className="rules-section">
          <h2>Prohibited Content</h2>
          <div className="rule-card warning">
            <h3>10. Illegal Content</h3>
            <p>No projects involving illegal activities, malware, or content that violates laws or regulations.</p>
          </div>
          <div className="rule-card warning">
            <h3>11. Adult Content</h3>
            <p>Adult or explicit content is not permitted on this platform.</p>
          </div>
          <div className="rule-card warning">
            <h3>12. Harmful Content</h3>
            <p>No projects that could harm users, spread misinformation, or violate privacy.</p>
          </div>
        </section>

        <section className="rules-section">
          <h2>Enforcement</h2>
          <p className="enforcement-text">
            Violation of these rules may result in content removal, account suspension, or permanent ban. 
            We reserve the right to remove any content that violates these guidelines without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Rules;

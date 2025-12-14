import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import projectStore from '../../stores/projectStore';
import './AddProjectModal.css';

const AddProjectModal = observer(({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectStore.createProject(formData.title, formData.description, formData.projectUrl);
      onSuccess();
      onClose();
      setFormData({ title: '', description: '', projectUrl: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="project-modal-overlay" onClick={handleOverlayClick}>
      <div className="project-modal">
        <button className="close-button" onClick={onClose}>
          <img src="/Close_round.svg" alt="Close" />
        </button>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">Название проекта</label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={handleChange('title')}
              required
              disabled={projectStore.isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="textarea-field"
              value={formData.description}
              onChange={handleChange('description')}
              rows="4"
              required
              disabled={projectStore.isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ссылка</label>
            <input
              type="url"
              className="input-field"
              value={formData.projectUrl}
              onChange={handleChange('projectUrl')}
              required
              disabled={projectStore.isLoading}
            />
          </div>

          {projectStore.error && (
            <div className="error-message">{projectStore.error}</div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={projectStore.isLoading}
          >
            {projectStore.isLoading ? '...' : 'OK'}
          </button>
        </form>
      </div>
    </div>
  );
});

export default AddProjectModal;

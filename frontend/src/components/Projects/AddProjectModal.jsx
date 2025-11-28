import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import projectStore from '../../stores/projectStore';
import Input from '../UI/Input';
import Button from '../UI/Button';

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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Project</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Enter project name"
            required
          />
          
          <div className="input-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe your project..."
              rows="4"
              required
            />
          </div>

          <Input
            label="Project URL"
            type="url"
            value={formData.projectUrl}
            onChange={handleChange('projectUrl')}
            placeholder="https://your-project.com"
            required
          />

          {projectStore.error && (
            <div className="error-message">{projectStore.error}</div>
          )}

          <div className="form-actions">
            <Button type="button" onClick={onClose} className="secondary">
              Cancel
            </Button>
            <Button type="submit" loading={projectStore.isLoading}>
              Add Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddProjectModal;
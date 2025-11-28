import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-author">by {project.username}</span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-footer">
        <a 
          href={project.project_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="project-link"
        >
          Visit Project →
        </a>
        <span className="project-date">
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
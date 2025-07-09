import React from 'react';
import './TemplateCard.css'; // CORRECTED: This path means "look in the same directory"

const TemplateCard = ({ template, isSelected, onSelect }) => {
  // Apply template-specific styles to the preview elements
  const previewStyles = {
    titleBar: {
      backgroundColor: template.colors['--template-primary'],
    },
    contentBlock: {
      backgroundColor: template.colors['--template-text'],
      opacity: 0.7,
    },
    textLine: {
      backgroundColor: template.colors['--template-light-text'],
      opacity: 0.6,
    },
  };

  // For gradient backgrounds, apply directly to the card preview div
  const cardPreviewBackground = template.colors['--template-background'].startsWith('linear-gradient')
    ? { background: template.colors['--template-background'] }
    : { backgroundColor: template.colors['--template-background'] };

  return (
    <div
      className={`template-card ${isSelected ? 'selected' : ''}`}
      style={{
        backgroundColor: template.styles.slideBackground.startsWith('var(') ? 'var(--template-card-background)' : template.styles.slideBackground,
        borderColor: template.styles.borderColor.startsWith('var(') ? 'var(--template-card-border)' : template.styles.borderColor,
        boxShadow: template.styles.boxShadow.startsWith('var(') ? 'var(--template-card-shadow)' : template.styles.boxShadow,
        color: template.styles.bulletColor.startsWith('var(') ? 'var(--template-card-text)' : template.styles.bulletColor,
      }}
      onClick={() => onSelect(template.id)} // Ensure onSelect is used here
    >
      {isSelected && <div className="selected-checkmark">✓</div>}
      <div className="template-card-preview" style={cardPreviewBackground}>
        {/* Conditional rendering for mini accent shape in template card preview */}
        {template.styles.accentShapeColor && (
          <div className="mini-accent-corner-shape" style={{ backgroundColor: template.styles.accentShapeColor }}></div>
        )}
        <div className="template-card-title-bar" style={previewStyles.titleBar}></div>
        <div className="template-card-content-block" style={previewStyles.contentBlock}></div>
        <div className="template-card-text-line" style={previewStyles.textLine}></div>
      </div>
      <div className="template-card-name">{template.name}</div>
    </div>
  );
};

export default TemplateCard;

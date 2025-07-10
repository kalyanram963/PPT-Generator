import React from 'react';
import '../components/SlideThumbnail.css'; // Assuming you'll have specific styles for thumbnails
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const SlideThumbnail = ({ slide, index, currentSlideIndex, setCurrentSlideIndex, templateStyles, templateColors, onEdit, onDelete, isEditing }) => {
  const isSelected = index === currentSlideIndex;

  // Dynamically apply styles for the visual preview within the thumbnail
  const getStyleValue = (cssVar) => {
    if (cssVar && cssVar.startsWith('var(')) {
      const varName = cssVar.replace('var(', '').replace(')', '').trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    }
    return cssVar;
  };

  const slideBackground = getStyleValue(templateStyles?.slideBackground) || '#FFFFFF';
  const borderColor = getStyleValue(templateStyles?.borderColor) || '#CCCCCC';
  const miniTitleBarColor = getStyleValue(templateStyles?.titleColor) || getStyleValue(templateColors?.['--template-primary']);
  const miniContentBlockColor = getStyleValue(templateStyles?.bulletColor) || getStyleValue(templateColors?.['--template-text']);

  const titleElement = slide.elements?.find(el => el.type === 'title');
  const contentElement = slide.elements?.find(el => el.type === 'bullet-points' || el.type === 'text');
  // const imageElement = slide.elements?.find(el => el.type === 'image'); // Not directly used for snippet

  // Limit content to first few bullet points or a short text snippet
  const displayContent = contentElement
    ? Array.isArray(contentElement.content)
      ? contentElement.content.slice(0, 2).map(point => point.replace(/[\s\-\*\•]+\s*/, '')).join(' ')
      : String(contentElement.content).substring(0, 50) + '...'
    : 'No content';

  return (
    <div
      key={slide.id} // Use slide.id as key for React list rendering
      className={`slide-thumbnail ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}
      onClick={() => setCurrentSlideIndex(index)}
      style={{
        backgroundColor: slideBackground,
        borderColor: borderColor,
        boxShadow: isSelected ? `0 0 15px ${borderColor}` : 'none',
      }}
    >
      <div className="slide-thumbnail-number">Slide {index + 1}</div>
      <div className="slide-thumbnail-visual-preview" style={{
        backgroundColor: slideBackground.includes('gradient') ? 'transparent' : slideBackground,
        backgroundImage: slideBackground.includes('gradient') ? slideBackground : 'none',
        backgroundSize: templateStyles?.backgroundSize || 'auto',
        borderColor: borderColor,
      }}>
        {/* Render the accent shape in the thumbnail preview if applicable */}
        {templateStyles?.accentShapeColor && (
          <div className="mini-accent-corner-shape" style={{ backgroundColor: getStyleValue(templateStyles.accentShapeColor) }}></div>
        )}
        <div className="mini-title-bar" style={{ backgroundColor: miniTitleBarColor }}></div>
        <div className="mini-content-block" style={{ backgroundColor: miniContentBlockColor }}></div>
        <div className="mini-content-block" style={{ backgroundColor: miniContentBlockColor }}></div>
      </div>
      <div className="thumbnail-title">{titleElement ? titleElement.content : `Slide ${index + 1}`}</div>
      {/* Only show snippet if it exists and is not empty */}
      {slide.content && slide.content.length > 0 && (
        <div className="thumbnail-content-snippet">{displayContent}</div>
      )}
      <div className="thumbnail-actions">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(slide.id); }}
          className="thumbnail-action-button edit-button"
          title="Edit Slide"
          disabled={isEditing}
        >
          <FontAwesomeIcon icon={faEdit} /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}
          className="thumbnail-action-button delete-button"
          title="Delete Slide"
          disabled={isEditing}
        >
          <FontAwesomeIcon icon={faTrashAlt} /> Delete
        </button>
      </div>
    </div>
  );
};

export default SlideThumbnail;

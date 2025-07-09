// src/components/SlideThumbnail.js
import React from 'react';
import '../styles/App.css'; // For styling the thumbnails

const SlideThumbnail = ({ slide, index, isSelected, onClick, templateStyles }) => {
  // Use template styles for the thumbnail's text elements
  const thumbnailTitleColor = isSelected ? 'var(--primary-color)' : templateStyles?.titleColor;
  const thumbnailContentColor = isSelected ? 'var(--text-color)' : templateStyles?.bulletColor;

  // Function to truncate content for the preview
  const truncateContent = (text, maxLength) => {
    if (!text) return '';
    const cleanedText = text.replace(/^(-|\*|•)\s*/gm, '').replace(/\n/g, ' '); // Remove bullets and newlines
    if (cleanedText.length <= maxLength) return cleanedText;
    return cleanedText.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`slide-thumbnail ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(index)}
    >
      <div className="slide-thumbnail-number">{index + 1}</div>
      <div className="slide-thumbnail-content">
        {/* Removed the thumbnail-visual-preview div entirely */}
        <div className="thumbnail-title" style={{ color: thumbnailTitleColor }}>{slide.title}</div>
        <div className="thumbnail-content-snippet" style={{ color: thumbnailContentColor }}>
          {truncateContent(slide.content, 60)} {/* Display a truncated content snippet */}
        </div>
      </div>
    </div>
  );
};

export default SlideThumbnail;

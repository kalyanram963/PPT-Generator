import React from 'react';
import './SlideThumbnail.css'; // Assuming you'll have specific styles for thumbnails

const SlideThumbnail = ({ slide, index, currentSlideIndex, setCurrentSlideIndex, templateStyles, templateColors, onEdit, onDelete }) => {
  const isSelected = index === currentSlideIndex;

  // Dynamically apply styles for the visual preview within the thumbnail
  const previewStyles = {
    backgroundColor: templateStyles?.slideBackground?.includes('gradient') ? 'transparent' : templateStyles?.slideBackground,
    backgroundImage: templateStyles?.slideBackground?.includes('gradient') ? templateStyles?.slideBackground : 'none',
    backgroundSize: templateStyles?.backgroundSize || 'auto',
    borderColor: templateStyles?.borderColor,
  };

  const miniTitleBarColor = templateStyles?.titleColor || templateColors?.['--template-primary'];
  const miniContentBlockColor = templateStyles?.bulletColor || templateColors?.['--template-text'];

  return (
    <div
      key={slide.id} // Use slide.id as key for React list rendering
      className={`slide-thumbnail ${isSelected ? 'selected' : ''}`}
      onClick={() => setCurrentSlideIndex(index)} // This is the fix for the onClick error
    >
      <div className="slide-thumbnail-number">Slide {index + 1}</div>
      <div className="slide-thumbnail-visual-preview" style={previewStyles}>
        {/* Render the accent shape in the thumbnail preview if applicable */}
        {templateStyles?.accentShapeColor && (
          <div className="mini-accent-corner-shape" style={{ backgroundColor: templateStyles.accentShapeColor }}></div>
        )}
        <div className="mini-title-bar" style={{ backgroundColor: miniTitleBarColor }}></div>
        <div className="mini-content-block" style={{ backgroundColor: miniContentBlockColor }}></div>
        <div className="mini-content-block" style={{ backgroundColor: miniContentBlockColor }}></div>
      </div>
      <div className="thumbnail-title">{slide.title}</div>
      {/* Only show snippet if it exists and is not empty */}
      {slide.content && slide.content.length > 0 && (
        <div className="thumbnail-content-snippet">{Array.isArray(slide.content) ? slide.content[0] : slide.content.split('\n')[0]}</div>
      )}
      <div className="thumbnail-actions">
        <button onClick={(e) => { e.stopPropagation(); onEdit(slide.id, slide.content); }} className="thumbnail-action-button edit-button" title="Edit Slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.382 2.23L5.25 17.5l2.104.271c.516.067 1.025.177 1.524.322.516.154 1.02.297 1.516.425l.75.165c.424.111.851.216 1.274.316.639.154 1.268.295 1.89.418.585.119 1.164.218 1.735.298l.764.104a.75.75 0 00.765-.765V18.75a.75.75 0 00-.104-.764l-2.121-2.121a.75.75 0 00-.764-.104z" />
          </svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }} className="thumbnail-action-button delete-button" title="Delete Slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.845 48.845 0 013.878.512.75.75 0 11-.233 1.488 47.874 47.874 0 00-3.682-.468l.11-.266m-9.012 0a48.728 48.728 0 013.878.512.75.75 0 11-.233 1.488 47.874 47.874 0 00-3.682-.468l.11-.266m-2.54 1.183v.568c0 .334.262.612.595.624 1.44.079 2.872.183 4.298.307 1.14.104 2.272.24 3.397.41.65.093 1.286.195 1.898.307 1.1.112 2.183.255 3.264.445a.75.75 0 01.416.923 2.515 2.515 0 01-.4.028 49.189 49.189 0 00-3.17-.434c-1.57-.179-3.15-.358-4.734-.538C9.68 15.768 8.13 15.5 6.58 15.223A2.25 2.25 0 014 12.975v-.568a2.25 2.25 0 012.25-2.25h1.372c.516-.054 1.026-.14 1.534-.26a.75.75 0 011.091.213l.01.011zM12 2.25a.75.75 0 01.75.75v.75h3.75a.75.75 0 010 1.5H7.5a.75.75 0 010-1.5h3.75V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SlideThumbnail;

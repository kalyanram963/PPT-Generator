import React, { useState, useEffect, useRef } from 'react';
import '../components/SlidePreview.css';
import Draggable from 'react-draggable';

const SlidePreview = ({ slide, templateStyles, templateColors, isEditing, onElementChange }) => {
  const [currentElements, setCurrentElements] = useState(slide.elements || []);
  const slidePreviewRef = useRef(null);
  const elementRefs = useRef({});

  useEffect(() => {
    setCurrentElements(slide.elements || []);
    elementRefs.current = {};
  }, [slide.elements]);

  const getStyleValue = (cssVar) => {
    if (cssVar && cssVar.startsWith('var(')) {
      const varName = cssVar.replace('var(', '').replace(')', '').trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    }
    return cssVar;
  };

  const slideBackground = getStyleValue(templateStyles?.slideBackground) || '#FFFFFF';
  const borderColor = getStyleValue(templateStyles?.borderColor) || '#CCCCCC';
  const accentColor = getStyleValue(templateColors?.['--template-accent']) || '#FF6B6B';
  const borderRadius = getStyleValue('--border-radius') || '10px';
  const boxShadow = getStyleValue('--box-shadow') || '0 4px 8px rgba(0, 0, 0, 0.1)';

  const titleElement = currentElements.find(el => el.type === 'title');
  const contentElement = currentElements.find(el => el.type === 'bullet-points' || el.type === 'text');
  const imageElement = currentElements.find(el => el.type === 'image');

  const handleDragStop = (elementId) => (e, ui) => {
    if (!isEditing) return;

    setCurrentElements(prevElements => {
      const updatedElements = prevElements.map(el => {
        if (el.id === elementId) {
          const draggableNode = getOrCreateRef(elementId).current;
          if (!draggableNode || !slidePreviewRef.current) {
            console.warn("Draggable node ref or slide preview ref not found for drag calculation.");
            return el;
          }

          const slidePreviewRect = slidePreviewRef.current.getBoundingClientRect();

          const newLeftPx = draggableNode.offsetLeft;
          const newTopPx = draggableNode.offsetTop;

          const newXPercent = (newLeftPx / slidePreviewRect.width) * 100;
          const newYPercent = (newTopPx / slidePreviewRect.height) * 100;

          const newWidthPercent = (draggableNode.offsetWidth / slidePreviewRect.width) * 100;
          const newHeightPercent = (draggableNode.offsetHeight / slidePreviewRect.height) * 100;

          return {
            ...el,
            x: `${newXPercent}%`,
            y: `${newYPercent}%`,
            width: `${newWidthPercent}%`,
            height: `${newHeightPercent}%`
          };
        }
        return el;
      });
      if (onElementChange) {
        onElementChange(slide.id, updatedElements);
      }
      return updatedElements;
    });
  };

  const handleElementChange = (id, field, value) => {
    setCurrentElements(prevElements => {
      const updatedElements = prevElements.map(el =>
        el.id === id ? { ...el, [field]: value } : el
      );
      if (onElementChange) {
        onElementChange(slide.id, updatedElements);
      }
      return updatedElements;
    });
  };

  const getOrCreateRef = (id) => {
    if (!elementRefs.current[id]) {
      elementRefs.current[id] = React.createRef();
    }
    return elementRefs.current[id];
  };

  return (
    <div
      className="slide-preview"
      ref={slidePreviewRef}
      style={{
        backgroundColor: slideBackground,
        borderColor: borderColor,
        borderRadius: borderRadius,
        boxShadow: boxShadow,
      }}
      data-editing={isEditing ? "true" : "false"}
    >
      {templateStyles?.accentShapeColor && (
        <div
          className="accent-corner-shape"
          style={{ backgroundColor: getStyleValue(templateStyles.accentShapeColor) }}
        ></div>
      )}

      {isEditing ? (
        Array.isArray(currentElements) && currentElements.map(element => {
          const elementStyle = {
            position: 'absolute',
            left: element.x || '0%',
            top: element.y || '0%',
            width: element.width || 'auto',
            height: element.height || 'auto',
            zIndex: element.zIndex || 1,
          };

          const draggableProps = {
            onStop: handleDragStop(element.id),
            bounds: 'parent',
            nodeRef: getOrCreateRef(element.id),
          };

          let contentComponent = null;
          switch (element.type) {
            case 'title':
              contentComponent = (
                <input
                  type="text"
                  value={element.content}
                  onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                  className="editable-title-input"
                  style={{ color: getStyleValue(templateStyles?.titleColor) || '#000000', borderBottom: `3px solid ${getStyleValue(templateStyles?.borderColor) || '#CCCCCC'}`, width: '100%', height: 'auto' }}
                />
              );
              break;
            case 'text':
              contentComponent = (
                <textarea
                  value={element.content}
                  onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                  className="editable-content-textarea"
                  style={{ color: getStyleValue(templateStyles?.bulletColor) || '#363636', width: '100%', height: 'auto' }}
                />
              );
              break;
            case 'bullet-points':
              contentComponent = (
                <textarea
                  value={Array.isArray(element.content) ? element.content.join('\n') : element.content}
                  onChange={(e) => handleElementChange(element.id, 'content', e.target.value.split('\n'))}
                  className="editable-content-textarea"
                  style={{ color: getStyleValue(templateStyles?.bulletColor) || '#363636', width: '100%', height: 'auto' }}
                />
              );
              break;
            case 'image':
              contentComponent = (
                <>
                  <input
                    type="text"
                    value={element.imagePrompt || ''}
                    onChange={(e) => handleElementChange(element.id, 'imagePrompt', e.target.value)}
                    placeholder="Image prompt"
                    className="editable-image-prompt-input"
                    style={{ color: getStyleValue(templateStyles?.bulletColor) || '#363636', width: '100%', marginBottom: '5px' }}
                  />
                  {element.src && (
                    <img
                      src={element.src}
                      alt={element.imagePrompt || 'Slide Image'}
                      className="slide-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </>
              );
              break;
            default:
              contentComponent = null;
          }

          return (
            <Draggable
              key={element.id}
              {...draggableProps}
            >
              <div
                className={`slide-element slide-${element.type}-element`}
                ref={getOrCreateRef(element.id)}
                style={{
                  ...elementStyle,
                  border: '1px dashed #00c9ff',
                  cursor: 'grab',
                  resize: 'both',
                  overflow: 'auto',
                  padding: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: element.type === 'image' ? 'center' : 'flex-start',
                  alignItems: element.type === 'image' ? 'center' : 'flex-start',
                }}
              >
                {contentComponent}
              </div>
            </Draggable>
          );
        })
      ) : (
        <div className="slide-content-layout">
          {titleElement && (
            <div className="slide-element slide-title-element">
              <h2 style={{ color: getStyleValue(templateStyles?.titleColor) || '#000000', borderBottom: `3px solid ${getStyleValue(templateStyles?.borderColor) || '#CCCCCC'}` }}>
                {titleElement.content}
              </h2>
            </div>
          )}

          {contentElement && (
            <div className="slide-element slide-content-element">
              {contentElement.type === 'bullet-points' ? (
                <ul className="slide-content-list" style={{ color: getStyleValue(templateStyles?.bulletColor) || '#363636' }}>
                  {Array.isArray(contentElement.content) && contentElement.content.map((point, index) => (
                    <li key={index} className="slide-bullet-point">
                      <span className="bullet-icon" style={{ color: accentColor }}>•</span>
                      {point.replace(/[\s\-\*\•]+\s*/, '')}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="slide-text-content" style={{ color: getStyleValue(templateStyles?.bulletColor) || '#363636' }}>
                  {contentElement.content.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {imageElement && imageElement.src && (
            <div className="slide-element slide-image-element">
              <img
                src={imageElement.src}
                alt={imageElement.imagePrompt || 'Slide Image'}
                className="slide-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlidePreview;

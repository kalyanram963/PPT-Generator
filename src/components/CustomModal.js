import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.css'; // For modal styling

const CustomModal = ({ message, type, onClose, onConfirm, initialInput = '' }) => {
  const [inputValue, setInputValue] = useState(initialInput);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input field if it's a prompt type modal
    if (type === 'prompt' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [type]);

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm(true); // For 'confirm' type, pass true
    }
    onClose();
  };

  const handleCancel = () => {
    if (type === 'prompt') {
      onConfirm(null); // For 'prompt' type, pass null if cancelled
    } else {
      onConfirm(false); // For 'confirm' type, pass false
    }
    onClose();
  };

  return (
    <div className="custom-modal-overlay">
      <div className={`custom-modal-content ${type}`}>
        <h3>{message}</h3>
        {type === 'prompt' && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
            placeholder="Enter content..."
          />
        )}
        <div className="custom-modal-buttons">
          {(type === 'confirm' || type === 'prompt') && (
            <button className="cancel-button" onClick={handleCancel}>
              {type === 'prompt' ? 'Cancel' : 'No'}
            </button>
          )}
          <button className="confirm-button" onClick={handleConfirm}>
            {type === 'confirm' ? 'Yes' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

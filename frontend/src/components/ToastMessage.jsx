// src/components/ToastMessage.js
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export default function ToastMessage({ show, onClose, message, variant = 'success' }) {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
      <Toast bg={variant} show={show} onClose={onClose} delay={4000} autohide>
        <Toast.Header>
          <strong className="me-auto">
            {variant === 'success' && 'Success'}
            {variant === 'danger' && 'Error'}
            {variant === 'warning' && 'Warning'}
            {variant === 'info' && 'Info'}
          </strong>
        </Toast.Header>
        <Toast.Body className={variant === 'light' ? 'text-dark' : 'text-white'}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

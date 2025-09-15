'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ type: ToastProps['type']; isClosing: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease-in-out;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background: #f0fff4;
          border-left: 4px solid #38a169;
          color: #22543d;
        `;
      case 'error':
        return `
          background: #fed7d7;
          border-left: 4px solid #e53e3e;
          color: #742a2a;
        `;
      case 'warning':
        return `
          background: #fffbeb;
          border-left: 4px solid #ed8936;
          color: #9c4221;
        `;
      case 'info':
        return `
          background: #ebf8ff;
          border-left: 4px solid #3182ce;
          color: #2b6cb0;
        `;
    }
  }}
`;

const IconContainer = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const MessageContainer = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 1;
  }
`;

const getIcon = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
  }
};

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // 애니메이션 시간과 맞춤
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <ToastContainer type={type} isClosing={isClosing}>
      <IconContainer>{getIcon(type)}</IconContainer>
      <MessageContainer>{message}</MessageContainer>
      <CloseButton onClick={handleClose}>×</CloseButton>
    </ToastContainer>
  );
}

// Toast Manager Context
interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastProps['type'], duration = 5000) => {
    const id = Date.now().toString();
    const newToast: ToastItem = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

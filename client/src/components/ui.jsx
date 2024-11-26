import React from 'react';

export const Button = ({ onClick, children, variant = 'primary', disabled = false }) => {
  const baseStyles = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: '#F97316',
      color: 'white',
      '&:hover': {
        backgroundColor: '#EA580C',
      },
    },
    secondary: {
      backgroundColor: '#F3F4F6',
      color: '#4B5563',
      '&:hover': {
        backgroundColor: '#E5E7EB',
      },
    },
    danger: {
      backgroundColor: '#FEE2E2',
      color: '#DC2626',
      '&:hover': {
        backgroundColor: '#FEE2E2',
      },
    },
  };

  const style = {
    ...baseStyles,
    ...variants[variant],
  };

  return (
    <button
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Input = ({ value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB',
        width: '100%',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out',
        '&:focus': {
          borderColor: '#F97316',
        },
      }}
    />
  );
};

export const Select = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid #E5E7EB',
        backgroundColor: 'white',
        width: '100%',
        fontSize: '1rem',
        outline: 'none',
        cursor: 'pointer',
        color: '#333',
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
          borderColor: '#F97316',
          boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)',
        },
        '&:hover': {
          borderColor: '#F97316',
        },
      }}
    >
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          style={{
            color: '#333',
            backgroundColor: 'white',
            padding: '0.5rem'
          }}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const Card = ({ children, padding = '1rem' }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        border: '1px solid #E5E7EB',
      }}
    >
      {children}
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: 'inline-block',
        width: '2rem',
        height: '2rem',
        border: '2px solid #E5E7EB',
        borderRadius: '50%',
        borderTopColor: '#F97316',
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

// Add this to your global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

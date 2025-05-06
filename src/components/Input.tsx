import React from 'react';
import './Input.css';

interface InputProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  value,
  onChange,
  placeholder,
  error
}) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const RegisterForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    
    let hasError = false;
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      hasError = true;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
      hasError = true;
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      setIsLoading(false);
      
      if (response.status === 'success') {
        if (onSuccess) {
          onSuccess(response.data.user);
        }
        navigate('/');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {errors.general && <div className="error-message mb-3">{errors.general}</div>}
      
      <div className="form-group">
        <label className="form-label" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <div className="error-message">{errors.username}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          className="form-control"
          value={formData.confirm_password}
          onChange={handleChange}
        />
        {errors.confirm_password && <div className="error-message">{errors.confirm_password}</div>}
      </div>
      
      <button type="submit" className="btn btn-block app-button" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
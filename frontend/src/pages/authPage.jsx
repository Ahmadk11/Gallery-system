import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/loginForm';
import RegisterForm from '../components/auth/registerForm';
import authService from '../services/authService';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.checkAuth();
        if (response.status === 'success') {
          navigate('/');
        }
      } catch (error) {

      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAuthSuccess = (user) => {
    console.log('Authenticated as:', user);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="auth-container">
          <p className="text-center loading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
        
        {isLogin ? (
          <LoginForm onSuccess={handleAuthSuccess} />
        ) : (
          <RegisterForm onSuccess={handleAuthSuccess} />
        )}
        
        <div className="auth-switch mt-3">
          {isLogin ? (
            <p>Don't have an account? <button onClick={toggleAuthMode} className="btn-link app-button">Register</button></p>
          ) : (
            <p>Already have an account? <button onClick={toggleAuthMode} className="btn-link app-button">Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
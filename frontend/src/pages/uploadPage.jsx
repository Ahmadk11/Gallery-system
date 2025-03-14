import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoUploadForm from '../components/photo/photoUploadForm';
import authService from '../services/authService';

const UploadPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="container">
      <div className="upload-container">
        <h2>Upload Photo</h2>
        <PhotoUploadForm />
      </div>
    </div>
  );
};

export default UploadPage;
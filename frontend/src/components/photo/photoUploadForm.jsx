import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import photoService from '../../services/photoService';

const PhotoUploadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_data: ''
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
 
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ image_data: 'Please select an image file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setFormData({ ...formData, image_data: base64String });
      setPreview(base64String);
      
      if (errors.image_data) {
        setErrors({ ...errors, image_data: '' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    setErrors({});
    
    let hasError = false;
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }
    
    if (!formData.image_data) {
      newErrors.image_data = 'Image is required';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await photoService.uploadPhoto(formData);
      setIsLoading(false);
      
      if (response.status === 'success') {
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
    <form onSubmit={handleSubmit}>
      {errors.general && <div className="error-message mb-3">{errors.general}</div>}
      
      <div className="form-group">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="image">Photo</label>
        <input
          type="file"
          id="image"
          name="image"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
        />
        {errors.image_data && <div className="error-message">{errors.image_data}</div>}
      </div>
      
      {preview && (
        <div className="upload-preview">
          <h4>Preview</h4>
          <img 
            src={preview} 
            alt="Preview" 
            className="upload-preview-img"
          />
        </div>
      )}
      
      <button type="submit" className="btn btn-block mt-3" disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </form>
  );
};

export default PhotoUploadForm;
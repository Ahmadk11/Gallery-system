import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import photoService from '../services/photoService';
import authService from '../services/authService';

const PhotoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      try {
        const response = await photoService.getPhoto(id);
        
        if (response.status === 'success') {
          setPhoto(response.data.photo);
        } else {
          setError('Failed to load photo');
        }
      } catch (error) {
        setError('An error occurred while loading the photo');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await photoService.deletePhoto(id);
        
        if (response.status === 'success') {
          navigate('/');
        } else {
          setError('Failed to delete photo');
        }
      } catch (error) {
        setError('An error occurred while deleting the photo');
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="loading">Loading photo...</div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="error-message">{error || 'Photo not found'}</div>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && photo.user_id === currentUser.id;

  return (
    <div>
      <Header />
      
      <div className="container">
        <div className="photo-details">
          <img 
            src={`data:image/jpeg;base64,${photo.image_data}`} 
            alt={photo.title}
            className="photo-details-img"
          />
          
          <div className="photo-details-info">
            <h1>{photo.title}</h1>
            {photo.description && <p>{photo.description}</p>}
            <p className="photo-date">
              Uploaded on {new Date(photo.created_at).toLocaleDateString()}
            </p>
          </div>
          
          {isOwner && (
            <div className="photo-details-actions">
              <button 
                onClick={() => navigate(`/photo/edit/${photo.id}`)}
                className="btn"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailsPage;
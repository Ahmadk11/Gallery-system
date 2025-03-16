import React, { useState, useEffect } from 'react';
import PhotoGrid from '../components/photo/photoGrid';
import Header from '../components/common/header';
import photoService from '../services/photoService';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await photoService.getAllPhotos();
        
        if (response.status === 'success') {
          setPhotos(response.data.photos);
        } else {
          setError('Failed to load photos');
        }
      } catch (error) {
        setError('An error occurred while loading photos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <Header />
      
      <div className="container">
        <div className="gallery-container">
          <div className="gallery-header">
            <h1 className="gallery-title">Photo Gallery</h1>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <PhotoGrid photos={photos} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
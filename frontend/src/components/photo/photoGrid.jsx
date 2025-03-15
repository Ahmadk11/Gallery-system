import React from 'react';
import PhotoCard from './photoCard';

const PhotoGrid = ({ photos, loading }) => {
  if (loading) {
    return <div className="loading">Loading photos...</div>;
  }

  if (photos.length === 0) {
    return <div className="no-photos">No photos found</div>;
  }

  return (
    <div className="gallery-grid">
      {photos.map(photo => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};

export default PhotoGrid;
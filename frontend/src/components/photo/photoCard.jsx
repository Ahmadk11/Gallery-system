import React from 'react';
import { Link } from 'react-router-dom';

const PhotoCard = ({ photo }) => {
  return (
    <div className="photo-card">
      <Link to={`/photo/${photo.id}`} className="app-link">
        <img 
          src={`data:image/jpeg;base64,${photo.image_data}`} 
          alt={photo.title}
          className="photo-card-img"
        />
      </Link>
      <div className="photo-card-body">
        <h3 className="photo-card-title">{photo.title}</h3>
        {photo.description && (
          <p className="photo-card-description">
            {photo.description.length > 100 
              ? `${photo.description.substring(0, 100)}...` 
              : photo.description}
          </p>
        )}
        <p className="photo-card-date">
          {new Date(photo.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PhotoCard;
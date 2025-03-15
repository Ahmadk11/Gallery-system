import api from './api';

const photoService = {

  uploadPhoto: async (photoData) => {
    return api.post('photos/upload', photoData);
  },
  
  getAllPhotos: async () => {
    return api.get('photos');
  },
  
  getPhoto: async (id) => {
    return api.get(`photos/details?id=${id}`);
  },
  
  updatePhoto: async (photoData) => {
    return api.put('photos/update', photoData);
  },
  
  deletePhoto: async (id) => {
    return api.delete(`photos/delete?id=${id}`);
  }
};

export default photoService;
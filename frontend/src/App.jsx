import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/authPage.jsx';
import GalleryPage from './pages/galleryPage.jsx';
import PhotoDetailsPage from './pages/photoDetailsPage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import UploadPage from './pages/uploadPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App body">
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

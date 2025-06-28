import { createContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import UploadPage from '@/components/pages/UploadPage';
import DownloadPage from '@/components/pages/DownloadPage';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Authentication methods to share via context
  const authMethods = {
    logout: async () => {
      try {
        dispatch(clearUser());
        navigate('/');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/download/:slug" element={<DownloadPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
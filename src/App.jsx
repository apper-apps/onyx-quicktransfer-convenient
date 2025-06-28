import { Routes, Route } from 'react-router-dom';
import UploadPage from '@/components/pages/UploadPage';
import DownloadPage from '@/components/pages/DownloadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/download/:slug" element={<DownloadPage />} />
    </Routes>
  );
}

export default App;
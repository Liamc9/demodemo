// hooks/useUploadFile.js
import { useState } from 'react';
import { uploadFile } from '../services/storageService';

const useUploadFile = () => {
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('');
  const [error, setError] = useState(null);

  const upload = async (file, storagePath) => {
    try {
      const url = await uploadFile(file, storagePath, setProgress);
      setDownloadURL(url);
    } catch (err) {
      setError(err);
    }
  };

  return { upload, progress, downloadURL, error };
};

export default useUploadFile;

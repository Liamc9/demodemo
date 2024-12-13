import React, { useState } from 'react';

/**
 * FileUpload allows users to upload files.
 *
 * @component
 * @param {Object} props
 * @param {function} props.onFileUpload - Callback function when a file is selected.
 * @returns {JSX.Element}
 */
const FileUpload = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <label htmlFor="file" className="cursor-pointer bg-gray-100 p-8 rounded-2xl border-2 border-dashed border-gray-600 shadow-xl hover:bg-gray-200 transition-all duration-300">
        <div className="flex flex-col items-center justify-center gap-2">
          {selectedFile ? (
            <>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="h-24 w-24 object-cover mb-4 rounded-lg"
              />
              <p className="text-gray-600">File Selected: {selectedFile.name}</p>
            </>
          ) : (
            <>
              <svg viewBox="0 0 640 512" className="h-12 w-12 text-gray-700 mb-5 fill-current">
                <path
                  d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                />
              </svg>
              <p className="text-gray-600">Drag and Drop</p>
              <p className="text-gray-600">or</p>
              <span className="bg-gray-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:bg-gray-900">Browse file</span>
            </>
          )}
        </div>
        <input id="file" type="file" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};

export default FileUpload;

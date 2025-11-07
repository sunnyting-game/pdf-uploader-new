import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('請選擇有效的 PDF 檔案');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('請先選擇檔案');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `pdfs/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setShareLink(downloadURL);
    } catch (err) {
      console.error(err);
      setError('上傳失敗，請重試');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('連結已複製！');
  };

  const reset = () => {
    setFile(null);
    setShareLink('');
    setError('');
    };
   const shareViaEmail = () => {
        const subject = encodeURIComponent('PDF 檔案分享');
        const body = encodeURIComponent(`我想與您分享這個 PDF 檔案：\n\n${shareLink}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

   const shareViaWhatsApp = () => {
        const text = encodeURIComponent(`查看這個 PDF 檔案：${shareLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

  return (
    <div className="App">
      <div className="container">
              <h1>PDF Cloud</h1>
                <h2>Upload your PDF and make it to a link</h2>

        {!shareLink ? (
          <div className="upload-section">
            <div className="upload-area">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="upload-label">
                <div className="upload-icon">📤</div>
                <p className="file-name">
                  {file ? file.name : 'Select your PDF here, < 10MB'}
                </p>
                <p className="upload-hint"> PDF ONLY</p>
              </label>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="upload-button"
            >
              {uploading ? '上傳中...' : '上傳'}
            </button>
          </div>
        ) : (
          <div className="success-section">
            <div className="success-icon">✅</div>
            <h2>上傳成功！</h2>

            <div className="link-box">
              <p className="link-label">分享連結：</p>
              <div className="link-display">{shareLink}</div>
              <button onClick={copyToClipboard} className="copy-button">
                複製連結
                              </button>
                              <div style={{ marginTop: '20px' }}>
                                  <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
                                      分享到：
                                  </p>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                      <button onClick={shareViaWhatsApp} style={{
                                          background: '#25D366',
                                          color: 'white',
                                          border: 'none',
                                          padding: '12px',
                                          borderRadius: '10px',
                                          fontSize: '14px',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                      }}>
                                          📱 WhatsApp
                                      </button>

                                      <button onClick={shareViaEmail} style={{
                                          background: '#0078D4',
                                          color: 'white',
                                          border: 'none',
                                          padding: '12px',
                                          borderRadius: '10px',
                                          fontSize: '14px',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                      }}>
                                          ✉️ Email
                                      </button>
                                  </div>
                              </div>

            </div>

            <button onClick={reset} className="reset-button">
              上傳另一個檔案
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
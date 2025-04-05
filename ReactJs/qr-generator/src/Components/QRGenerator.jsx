import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrData, setQrData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('qr-history')) || [];
    setQrData(saved);
  }, []);

  const updateLocalStorage = (data) => {
    localStorage.setItem('qr-history', JSON.stringify(data));
  };

  const handleGenerate = () => {
    if (text.trim()) {
      const newEntry = { text, timestamp: new Date().toISOString() };
      const updated = [newEntry, ...qrData];
      setQrData(updated);
      setText('');
      updateLocalStorage(updated);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('qr-history');
    setQrData([]);
  };

  const handleDelete = (index) => {
    const updated = qrData.filter((_, i) => i !== index);
    setQrData(updated);
    updateLocalStorage(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(qrData[index].text);
  };

  const handleSave = (index) => {
    const updated = [...qrData];
    updated[index].text = editText;
    updated[index].timestamp = new Date().toISOString(); // optional: update timestamp
    setQrData(updated);
    setEditIndex(null);
    setEditText('');
    updateLocalStorage(updated);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditText('');
  };

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter text or URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleGenerate}>Generate QR</button>
      </div>

      <AnimatePresence>
        {qrData.length > 0 && (
          <motion.div
            className="latest-qr"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Latest QR Code</h3>
            <QRCodeCanvas value={qrData[0].text} size={180} style={{border:'10px double', borderRadius:'10px'}}/>
            <p>{qrData[0].text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="history-header">
        <h3>History</h3>
        <button onClick={handleClear}>Clear History</button>
      </div>

      <ul className="history-list">
        <AnimatePresence>
          {qrData.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="qr-item"
            >
              <QRCodeCanvas value={item.text} size={64} style={{border:'10px double', borderRadius:'10px'}}/>
              <div className="qr-info">
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div style={{ marginTop: '6px' }}>
                      <button onClick={() => handleSave(index)}>Save</button>
                      <button onClick={handleCancel} style={{ marginLeft: '8px', backgroundColor: '#ccc' }}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{item.text}</p>
                    <small>{new Date(item.timestamp).toLocaleString()}</small>
                    <div className="qr-actions">
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)} style={{ backgroundColor: '#ff4d4f', marginLeft: '8px' }}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default QRGenerator;

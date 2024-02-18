import React, { useState, useRef } from 'react';
import Button from "@mui/material/Button";
import './DeviceCamera.css'

function DeviceCamera() {
  const [imgSrc, setImgSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setImgSrc(URL.createObjectURL(event.target.files[0]));
  };

  const openCamera = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='device-camera-container'>
      <input
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      <Button
        style={{ cursor: 'pointer', display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        onClick={openCamera}
      >
        Ota kuva
      </Button>

      {/* Short circuit evaluation. Jos ImgSrc on olemassa eikä se ole viallinen, näytä otettu kuva*/}
      {imgSrc && (
        <img
          src={imgSrc}
          alt='Captured'
        />
      )}
    </div>
  );
}

export default DeviceCamera;

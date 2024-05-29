import React, { useState, useRef } from 'react';
import Button from "@mui/material/Button";
import './DeviceCamera.css'
import { FaCamera, FaTrash } from "react-icons/fa";

function DeviceCamera({ onPictureCapture }) {
  const [imgSrc, setImgSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    const imageUrl = URL.createObjectURL(image);
    setImgSrc(imageUrl);
    onPictureCapture(imageUrl); // Pass the image URL to the parent component
  };

  const openCamera = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImgSrc(null);
    onPictureCapture(null); // Pass null to indicate image removal
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
        variant="contained"
        onClick={openCamera}
        startIcon={<FaCamera/>}
        style={{
            backgroundColor: "#3498db",
        }}
      >
        Ota kuva
      </Button>

      {/* Short circuit evaluation. Jos ImgSrc on olemassa eikä se ole viallinen, näytä otettu kuva*/}
      {imgSrc && (
        <div>
          <div className='top-bar'>
              <div
                className='delete-image'
                onClick={removeImage}
              >
                <FaTrash size={20} color='white'/>
              </div>
          </div>
          <img
            src={imgSrc}
            alt='Otettu kuva'
          />
        </div>
      )}
    </div>
  );
}

export default DeviceCamera;

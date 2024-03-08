import React, { useState, useRef } from "react";

const ImageView = ({ imageRef, image, setImage }) => {
  const handleImageUpload = (event) => {
    // Reference: https://javascript.info/file
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = (event) => {
          console.log(file);
          const canvas = imageRef?.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  return (
    <div className="image-view">
      {!image ? (
        <label className="upload-box">
          Click here to upload an image!
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </label>
      ) : (
        <canvas ref={imageRef} alt="ImageView" className="uploaded-image" />
      )}
    </div>
  );
};

export default ImageView;

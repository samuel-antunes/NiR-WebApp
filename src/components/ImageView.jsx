import React, { useState } from "react";

const ImageView = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
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
        <img src={image} alt="ImageView" className="uploaded-image" />
      )}
    </div>
  );
};

export default ImageView;

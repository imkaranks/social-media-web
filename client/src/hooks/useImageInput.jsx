import { useState, useCallback } from "react";

export default function useImageInput() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = useCallback((e, callback) => {
    const file = e.target.files[0];

    setImage(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };

    reader.readAsDataURL(file);

    if (callback) {
      callback(file);
    }
  }, []);

  const resetImage = useCallback(() => {
    setImage(null);
    setImagePreview(null);
  }, []);

  return { image, imagePreview, handleChange, resetImage };
}

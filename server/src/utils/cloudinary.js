import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = (file) => {
  return cloudinary.uploader
    .upload(file, { resource_type: "auto" })
    .then((result) => {
      return { url: result.url, public_id: result.public_id };
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export default upload;

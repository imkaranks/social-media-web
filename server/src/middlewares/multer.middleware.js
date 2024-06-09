import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
    // cb(null, path.join(__dirname, "../files"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
  // destination: (req, file, cb) => {
  //   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  //     cb(null, path.join(__dirname, "../files"));
  //   } else {
  //     cb({ message: "This file is not an image file" }, false);
  //   }
  // },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname);
  // },
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;

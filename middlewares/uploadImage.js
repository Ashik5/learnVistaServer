import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware for handling file upload and Cloudinary upload
const upload = (req, res, next) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error processing file upload' });
    }
    
    // Convert fields to a plain object with single values
    req.body = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    const file = files.image; // Assuming 'image' is the form field name
    if (!file || !file[0].filepath) {
      return res.status(400).json({ error: 'File not provided or invalid' });
    }

    // Validate file type
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file[0].originalFilename).toLowerCase());
    const mimetype = filetypes.test(file[0].mimetype);
    
    if (!mimetype || !extname) {
      return res.status(400).json({ error: 'Images Only!' });
    }

    // Check file size limit (1MB)
    const fileSizeLimit = 1000000; // 1MB
    if (file[0].size > fileSizeLimit) {
      return res.status(400).json({ error: 'File size exceeds limit of 1MB' });
    }
    
    try {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(file[0].filepath, {
        folder: 'uploads', // Cloudinary folder
        public_id: `${file[0].newFilename}-${Date.now()}`,
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
      });
      
      // Attach Cloudinary URL to request for further processing
      req.file = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // Clean up temporary file
      fs.unlinkSync(file[0].filepath);
      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
};

export default upload;
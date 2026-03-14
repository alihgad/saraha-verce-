import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../../config/env.service.js';

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


export default cloudinary
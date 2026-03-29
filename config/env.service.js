import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const mongoURL = process.env.MONGO_URI;
console.log(mongoURL);

const mongoURL_PROD = process.env.MONGO_URI_PROD
const mood = process.env.MOOD
const port = process.env.PORT
const salt = process.env.SALT
const jwt_key = process.env.JWT_KEY
const userSignature = process.env.JWT_USER_SIGNATURE
const adminSignature = process.env.JWT_ADMIN_SIGNATUER
const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE
const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE
const BASE_URL = process.env.BASE_URL
const REDIS_URI = process.env.REDIS_URI
const APP_PASSWORD = process.env.APP_PASSWORD
const APP_EMAIL = process.env.APP_EMAIL
const CLOUD_NAME = process.env.CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const env = {
    port,
    mongoURL,
    mood, salt,
    jwt_key, userSignature,
    adminSignature,
    userRefreshSignature,
    adminRefreshSignature,
    BASE_URL,
    REDIS_URI,
    APP_PASSWORD,
    APP_EMAIL,
    CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    mongoURL_PROD
};
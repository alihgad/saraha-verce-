import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const mongoURL = process.env.MONGO_URI;
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
const APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD
const APP_EMAIL = process.env.EMAIL

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
    mongoURL_PROD
};
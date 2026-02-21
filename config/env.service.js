import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const mongoURL = process.env.MONGO_URI;
const mood = process.env.MOOD
const port = process.env.PORT
const salt = process.env.SALT
const jwt_key = process.env.JWT_KEY
const userSignature = process.env.JWT_USER_SIGNATURE
const adminSignature = process.env.JWT_ADMIN_SIGNATUER
const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE
const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE
export const env = {
    port,
    mongoURL,
    mood, salt,
    jwt_key, userSignature,
    adminSignature,
    userRefreshSignature,
    adminRefreshSignature
};
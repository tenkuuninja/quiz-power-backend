import { configDotenv } from 'dotenv';

configDotenv();

export const DATABASE_URL = process.env.DATABASE_URL;
export const ZUKI_API_KEY = process.env.ZUKI_API_KEY;

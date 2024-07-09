export const CREATE_ADMIN_TOKEN = process.env.CREATE_ADMIN_TOKEN;
export const APP_TIMEOUT = +process.env.APP_TIMEOUT || 10000;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || '1d';

export const ACCESS_TOKEN_SECRET = 'Mysecret';
export const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || '30m';

export const OTP_EXPIRE = +process.env.OTP_EXPIRE || 60000;

export const CHANGE_PASSWORD_TOKEN_SECRET =
  process.env.CHANGE_PASSWORD_TOKEN_SECRET;
export const CHANGE_PASSWORD_TOKEN_EXPIRE =
  process.env.CHANGE_PASSWORD_TOKEN_EXPIRE || '30m';

export const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT;
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

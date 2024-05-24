// Mapper for environment variables
export const node_env = process.env.NODE_ENV;
export const environment = process.env.ENVIRONEMENT;

export const port = process.env.PORT;

export const db = {
  uri: process.env.DB_URI || '',
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  admin_identifier: process.env.ADMIN_ID || '',
  admin_email: process.env.ADMIN_EMAIL || '',
  admin_password: process.env.ADMIN_PWD || '',
  password: process.env.DB_USER_PWD || '',
};


export const JWT_PASSPHRASE = process.env.JWT_PASSPHRASE;
export const CORS_URL = process.env.CORS_URL;
export const UPLOAD_SIZE_LIMIT = process.env.UPLOAD_SIZE_LIMIT;
export const WHITELIST = [process.env.CLIENT_URI, process.env.ADMIN_URI]

export const USER_DETAILS = process.env.USER_DETAILS;

export const TOKEN_INFO = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS || '0'),
  refreshTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};

export const LOG_DIR = process.env.LOG_DIR;
export const MAX_MESSAGES_PER_CONVERSATION = Number(process.env.MAX_MESSAGES_PER_CONVERSATION);

export const CLIENT_URL = process.env.CLIENT_URI;


export const enum ENVIRONEMENT {
  development = "DEV",
  production = "PROD"
}

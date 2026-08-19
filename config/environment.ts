import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, 'env', `.env.${ENV}`) });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const environment = {
  env: ENV,
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.API_BASE_URL || 'http://localhost:8000',
  credentials: {
    patientEmail: 'flowcheck@gmail.com',
    patientOtp: '0000',
    staffUsername: 'admin@srivyn.com',
    staffPassword: 'Password123',
  },
  apiToken: process.env.API_TOKEN || '',
} as const;

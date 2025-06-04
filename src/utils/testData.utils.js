import dotenv from 'dotenv';
dotenv.config();

export const testUser = {
  email: process.env.TEST_EMAIL,
  password: process.env.TEST_PASSWORD,
  firstName: process.env.TEST_USER_NAME,
  lastName: process.env.TEST_USER_LASTNAME,
};

export const baseURL = process.env.BASE_URL;

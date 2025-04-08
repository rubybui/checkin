import { Platform } from 'react-native';

const isDev = __DEV__;

// Get the correct API URL based on platform and environment
const getApiBaseUrl = () => {
  if (isDev) {
    // Development environment - use localhost for all platforms
    // This works because we're allowing all origins in dev mode
    return 'http://localhost:3000/api';
  }
  // Production environment
  return 'https://your-production-api.com/api';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  encryptionKey: 'YOUR_SECRET_HERE', // Replace with your actual encryption key - must match server
  isDev, // Export isDev flag for use in other parts of the app
}; 
const ENV = process.env.NODE_ENV; // 'development', 'production', etc.

const CONFIG = {
  development: {
    API_BASE_URL: "http://localhost:8080",
  },
  production: {
    API_BASE_URL: "https://round-office-437918-e3.ue.r.appspot.com",
  },
  // Add more environments if needed
};

const API_BASE_URL =
  CONFIG[ENV]?.API_BASE_URL || CONFIG.development.API_BASE_URL;

export { API_BASE_URL };

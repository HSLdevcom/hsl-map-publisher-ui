// Runtime config. In the Docker image, docker/generate-config.sh writes config.js
// (window.PublisherUiConfig) at container start from APP_ENV and REACT_APP_* env vars,
// so one image works in every environment. Values missing there fall back to the
// ones baked in at build time (.env.production in the image, .env.* locally).
const runtime = (typeof window !== 'undefined' && window.PublisherUiConfig) || {};

const config = {
  apiUrl: runtime.REACT_APP_API_URL || process.env.REACT_APP_API_URL,
  joreApiUrl: runtime.REACT_APP_JORE_API_URL || process.env.REACT_APP_JORE_API_URL,
  clientId: runtime.REACT_APP_CLIENT_ID || process.env.REACT_APP_CLIENT_ID,
  redirectUri: runtime.REACT_APP_REDIRECT_URI || process.env.REACT_APP_REDIRECT_URI,
  loginProviderUri:
    runtime.REACT_APP_LOGIN_PROVIDER_URI || process.env.REACT_APP_LOGIN_PROVIDER_URI,
  namespace: runtime.REACT_APP_NAMESPACE || process.env.REACT_APP_NAMESPACE,
};

export default config;

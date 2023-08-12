const websocket = {
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
};

const SECRETKEY = import.meta.env.VITE_SECRETKEY

export default {
  websocket,
  SECRETKEY
};

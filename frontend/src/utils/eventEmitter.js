const events = {};

export const subscribe = (event, callback) => {
  if (!events[event]) events[event] = [];
  events[event].push(callback);
  return () => {
    events[event] = events[event].filter((cb) => cb !== callback);
  };
};

export const emit = (event, data) => {
  if (events[event]) {
    events[event].forEach((cb) => cb(data));
  }
};

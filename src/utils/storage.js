export const Storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('Storage.get error', err);
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage.set error', err);
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch(e) {}
  }
};

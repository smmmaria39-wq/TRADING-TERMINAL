export const setItem = (key, value) => {
 try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
};
export const getItem = (key) => {
 try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
};
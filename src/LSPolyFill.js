const ls = {};
global.localStorage = {
  getItem: key => (ls[key] ? ls[key] : null),
  setItem: (key, value) => {
    ls[key] = value;
    return true;
  },
};
const localStorage = global.localStorage;
export default localStorage;

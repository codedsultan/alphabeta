import authModule from "./modules/auth/index.js";
import userModule from "./modules/user/index.js";


const initModules = (app) => {
  authModule.init(app);
  userModule.init(app);
  // 
};

export default initModules;

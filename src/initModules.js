import authModule from "./modules/auth/index.js";
import userModule from "./modules/user/index.js";
import postModule from "./modules/post/index.js";
import notificationModule from "./modules/notification/index.js";
import tagModule from "./modules/hashtag/index.js";
import chatModule from "./modules/chat/index.js";
import locationInfoModule from "./modules/location-info/index.js";


const initModules = (app) => {
  authModule.init(app);
  userModule.init(app);
  tagModule.init(app);
  postModule.init(app);
  notificationModule.init(app);
  chatModule.init(app);
  locationInfoModule.init(app);

};

export default initModules;

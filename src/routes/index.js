const userRoute = require("./user.route");
const postRoute = require("./post.route");
const followsRoute = require("./follows.route");

const configRoutes = (app) => {
  app.use("/users", userRoute);
  app.use("/posts", postRoute);
  app.use("/follows", followsRoute);
};

module.exports = configRoutes;


const auth = require("./auth");
const public = require("./public");

const route = (app) => {
  app.use("/auth", auth);
  // app.use("/", public);
};

module.exports = route;

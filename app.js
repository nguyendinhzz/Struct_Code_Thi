const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const route = require("./src/routers");
const db = require("./src/sequelize");
const PORT = process.env.PORT || 3000;
//swaper
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
async function main() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));
    // app.use('/css', express.static(path.join(__dirname, 'public/css')));
    // app.use('/js', express.static(path.join(__dirname, 'public/js')));
  app.use(express.static(path.join(__dirname, 'public')));

  const options = {
    definition: {
      openapi: "3.0.0",
      info: { title: "API Docs", version: "1.0.0" },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    },
    apis: [path.join(__dirname, "./src/routers/*.js")],

  };
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  route(app);

  // Thêm route mặc định để phục vụ các SPA routes
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'public', 'index.html'));
  // });

  /**
   * Middleware function for handling errors.
   *
   * This function is used as a middleware in the Express.js application to handle any errors that occur during the execution of route handlers.
   * It logs the error message and stack trace, sends a response with the error message and the appropriate status code, and passes control to the next middleware function.
   *
   * @param {Object} err - The error object.
   * @param {Object} req - The Express.js request object.
   * @param {Object} res - The Express.js response object.
   * @param {Function} next - The next middleware function.
   */
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).send(err.message);
    return;
  });

  await db.sequelize.sync({force: false});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();

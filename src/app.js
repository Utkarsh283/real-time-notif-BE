const cors = require("cors");
const express = require("express");
const session = require("express-session");
const { createServer } = require("http");
const morganMiddleware = require("./logger/morgan.logger");
const passport = require("passport");
const { rateLimit } = require("express-rate-limit");
const { ApiError } = require("./utils/ApiError.js");
const { ApiResponse } = require("./utils/ApiResponse.js");
require('dotenv').config();

const app = express();

const httpServer = createServer(app);

app.use(
    cors()
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => {
        return req.ip;
    },
    handler: (_, __, ___, options) => {
        throw new ApiError(
            options.statusCode || 500,
            `There are too many requests. You are only allowed ${options.max} requests per ${options.windowMs / 60000} minutes`
        );
    },
});

app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set secure: true if using HTTPS
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(morganMiddleware);

// App routes
const { errorHandler } = require("./middlewares/error.middlewares.js");
const healthcheckRouter = require("./routes/healthcheck.routes.js");

const userRouter = require("./routes/apps/auth/user.routes.js");

const taskRouter = require("./routes/apps/tasks/task.routes.js");

// * Kitchen sink routes
const statuscodeRouter = require("./routes/kitchen-sink/statuscode.routes.js");

// * SWAGGER DOCS
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

const notificationRouter = require("./routes/apps/notifications/notifications.routes.js");

const adminRouter = require("./routes/apps/auth/admin.routes.js");
app.use("/api/v1/admin", adminRouter);


// * healthcheck
app.use("/api/v1/healthcheck", healthcheckRouter);

// * User APIs
app.use("/api/v1/users", userRouter);


//* Task APIs
app.use("/api/v1", taskRouter);

// * API Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// * Kitchen sink apis
app.use("/api/v1/kitchen-sink/status-codes", statuscodeRouter);

app.use("/api/v1/notifications", notificationRouter);

app.use(errorHandler);

module.exports = { httpServer };

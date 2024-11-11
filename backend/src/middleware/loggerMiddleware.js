// backend/src/middleware/loggerMiddleware.js
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      user: req.user?.email,
      roles: req.user?.roles?.map(r => r.name),
      body: req.body
    });
    next();
  };
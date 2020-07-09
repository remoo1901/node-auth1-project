const Users = require("../../users/users-model");

function restrict() {
  const authError = {
    message: "INVALID CREDENTIALS",
  };

  return async (req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json(authError);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}


module.exports = restrict;
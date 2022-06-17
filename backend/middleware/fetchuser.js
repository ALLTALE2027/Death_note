const jwt = require("jsonwebtoken");
const signature = "welcometoparadise";

const fetchuser = (req, res, next) => {
  //get the user from jwt token(we have to decode it) and add it to req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, signature);
    req.user = data.user;

    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate using valid token" });
  }
};

module.exports = fetchuser;

import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  // Adjust token name if necessary
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Clear cookie if token is invalid
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return res.status(401).json({ error: "Invalid access token" });
    }

    // Attach user to request if token is valid
    req.user = user;
    next();
  });
};

export default checkToken;
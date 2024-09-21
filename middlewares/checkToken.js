import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        // Handle expired access token by checking the refresh token
        if (!refreshToken) {
          return res.status(401).json({ error: "Refresh token is missing" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
          if (err) {
            return res.status(403).json({ error: "Invalid refresh token" });
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            {
              id: user.id,
              username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );

          // Set new access token in httpOnly cookie
          res.cookie("accessToken", newAccessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
          });

          // Attach user to request
          req.user = user;
          next();
        });
      } else {
        return res.status(401).json({ error: "Invalid access token" });
      }
    } else {
      // If access token is valid
      req.user = user;
      next();
    }
  });
};

export default checkToken;

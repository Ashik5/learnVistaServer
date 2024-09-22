import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  // If no tokens are present, redirect to login
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: "No tokens provided. Please log in again." });
  }

  // Check the validity of the access token
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // If the access token is expired or tampered with, check the refresh token
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
          // Check if refresh token exists
          if (!refreshToken) {
            return res.status(401).json({ error: "Session expired. Please log in again." });
          }

          // Verify refresh token to generate a new access token
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
              // Invalid refresh token, redirect to login
              return res.status(403).json({ error: "Invalid refresh token. Please log in again." });
            }

            // Generate new access token
            const newAccessToken = jwt.sign(
              { id: decoded.id, username: decoded.username },
              process.env.JWT_SECRET,
              { expiresIn: "15m" }
            );

            // Set new access token cookie
            res.cookie("accessToken", newAccessToken, {
              maxAge: 15 * 60 * 1000, // 15 minutes
              httpOnly: true,
              secure: true,
              sameSite: "none",
              path: "/",
            });

            req.user = decoded; // Attach user to the request
            next(); // Proceed with request
          });
        } else {
          // If there's another error (not expired or tampered), redirect to login
          return res.status(401).json({ error: "Invalid access token. Please log in again." });
        }
      } else {
        // If access token is valid, attach user and continue
        req.user = user;
        next();
      }
    });
  } else if (refreshToken) {
    // If no access token, but refresh token is present, verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token. Please log in again." });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, username: decoded.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      // Set new access token cookie
      res.cookie("accessToken", newAccessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      req.user = decoded; // Attach user to the request
      next(); // Proceed with request
    });
  } else {
    // No access token and no refresh token, redirect to login
    return res.status(401).json({ error: "No valid tokens. Please log in again." });
  }
};

export default checkToken;

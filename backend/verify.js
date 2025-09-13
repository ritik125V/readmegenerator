import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export default async function verify(req, res, next) {
  const githubToken = req.cookies.githubToken;

  if (!githubToken) {
    console.log("token not found");
    return res.status(401).json({
      success: false,
      message: "Invalid user: Login required",
    });
  }

  try {
    const decoded = jwt.verify(githubToken, jwtSecret);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token could not be verified",
      });
    }
    console.log("token verified");
   
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

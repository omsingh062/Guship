import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // ✅ keep false for localhost
    sameSite: "lax", // ✅ allows cross-origin cookies locally
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

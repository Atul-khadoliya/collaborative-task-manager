import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
};

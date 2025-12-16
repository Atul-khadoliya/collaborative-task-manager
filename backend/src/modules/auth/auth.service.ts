import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterDto, LoginDto } from "./auth.dto";
import * as repo from "./auth.repository";

const SALT_ROUNDS = 10;

export const register = async (input: unknown) => {
  // 1. Validate input
  const data = RegisterDto.parse(input);

  // 2. Check if user already exists
  const existing = await repo.findUserByEmail(data.email);
  if (existing) {
    throw new Error("User already exists");
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // 4. Create user
  const user = await repo.createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const login = async (input: unknown) => {
  // 1. Validate input
  const data = LoginDto.parse(input);

  // 2. Find user
  const user = await repo.findUserByEmail(data.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // 3. Compare passwords
  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // 4. Issue JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

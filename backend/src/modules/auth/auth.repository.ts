// NOTE: Prisma client will be added later.
// For now, we define the repository interface shape.

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// These are placeholders.
// Actual DB implementation will be wired once Prisma is set up.

export const createUser = async (data: CreateUserInput): Promise<User> => {
  throw new Error("createUser not implemented");
};

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  throw new Error("findUserByEmail not implemented");
};

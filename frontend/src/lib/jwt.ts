interface JwtPayload {
  userId: string;
  exp: number;
}

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as JwtPayload;
    return payload.userId;
  } catch {
    return null;
  }
};

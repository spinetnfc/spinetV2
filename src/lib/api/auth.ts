
export const register = async () => {}

export const login = async (email: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async () => {}

export const refreshToken = async () => {}
export const getCurrentUser = async () => {}

export const updateUser = async () => {}


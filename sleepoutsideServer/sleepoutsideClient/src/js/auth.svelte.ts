export type AuthUser = {
  _id: string;
  email: string;
  name: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

type RegisterResponse = {
  message: string;
  user: AuthUser;
};

type ErrorResponse = {
  message?: string;
  error?: {
    message?: string;
  };
};

interface UserStore {
  isLoggedIn: boolean;
  user?: {
    name: string;
    email: string;
    _id: string;
  };
  token: string;
}

export const userStore = $state<UserStore>({
  isLoggedIn: false,
  user: undefined,
  token: "",
});

export const auth = $state<{
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}>({
  token: null,
  user: null,
  isAuthenticated: false,
});

const apiUrl = import.meta.env.PUBLIC_API_URL ?? "http://localhost:3000";

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const body = (await response.json()) as LoginResponse | ErrorResponse;

  if (!response.ok || !("token" in body) || !body.user) {
    const message =
      "message" in body
        ? body.message
        : "error" in body
          ? body.error?.message
          : undefined;

    throw new Error(
      message ?? "Unable to log in. Check your email and password."
    );
  }

  localStorage.setItem("authToken", body.token);
  localStorage.setItem("currentUser", JSON.stringify(body.user));
  userStore.isLoggedIn = true;
  userStore.user = body.user;
  userStore.token = body.token;
  localStorage.setItem("userStore", JSON.stringify(userStore));
  auth.token = body.token;
  auth.user = body.user;
  auth.isAuthenticated = true;

  return body.user;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const body = (await response.json()) as RegisterResponse | ErrorResponse;

  if (!response.ok || !("user" in body) || !body.user) {
    const message =
      "message" in body
        ? body.message
        : "error" in body
          ? body.error?.message
          : undefined;

    throw new Error(message ?? "Unable to create your account.");
  }

  return body.user;
}

export function logout(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userStore");
  userStore.isLoggedIn = false;
  userStore.user = undefined;
  userStore.token = "";
  auth.token = null;
  auth.user = null;
  auth.isAuthenticated = false;
}

export async function checkAuth(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("currentUser");

  if (!token || !storedUser) {
    logout();
    return false;
  }

  try {
    const user = JSON.parse(storedUser) as AuthUser;

    if (
      typeof user._id !== "string" ||
      typeof user.email !== "string" ||
      typeof user.name !== "string"
    ) {
      throw new Error("Stored user data is invalid");
    }

    const response = await fetch(
      `${import.meta.env.PUBLIC_SERVER_URL ?? "http://localhost:3000/api/v1/"}users/protected`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      logout();
      return false;
    }

    auth.token = token;
    auth.user = user;
    auth.isAuthenticated = true;
    userStore.isLoggedIn = true;
    userStore.user = user;
    userStore.token = token;
    return true;
  } catch {
    logout();
    return false;
  }
}
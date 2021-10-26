export default function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return Boolean(localStorage.getItem("login") && localStorage.getItem("password"));
  }

  return false;
}

export function signUp(login: string, password: string): void {
  //TODO: add generating and retrieving jwt

  if (typeof window !== "undefined") {
    localStorage.setItem("login", login);
    localStorage.setItem("password", password);
  }
}

export function signIn(login: string, password: string): void {
  //TODO: add retrieving jwt
}

export function signOut(): void {
  if (typeof window !== "undefined"){
    localStorage.removeItem("login");
    localStorage.removeItem("password");  
  }
}

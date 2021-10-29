import axios from './axios';

export default function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return Boolean(localStorage.getItem("email") && localStorage.getItem("password"));
  }

  return false;
}

export async function signUp(email: string, password: string) {
  //TODO: add generating and retrieving jwt
  try {
    await axios.post('/user/signup', {
      email,
      password
    })
  } catch (error) {
    console.log(error);
    return false;
  };

  return signIn(email, password);
}

export async function signIn(email: string, password: string) {
  try {
    const response = await axios.post('/user/signin', {
      email,
      password
    });
    
    if (typeof window !== "undefined") {
      localStorage.setItem("email", email);
      localStorage.setItem("jwt", response.data);
    }
    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export function signOut(): void {
  if (typeof window !== "undefined"){
    localStorage.removeItem("email");
    localStorage.removeItem("jwt");
  }
}

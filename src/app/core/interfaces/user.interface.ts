export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Ajoutez l'avatar (optionnel)
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  referred_by?: string;
}
export interface UserResponse {
  user: User;
  token: string;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  referred_by?: string;
}
export interface UserResponse {
  user: any;
  token: string;
}

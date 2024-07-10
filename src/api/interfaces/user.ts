export type ID = string | number;

export interface UserDataFromToken {
  user_id: number;
  email: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

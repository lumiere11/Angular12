export interface SessionModel {
  data: UserData;
  tokenSession: string;
}
export interface UserData {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

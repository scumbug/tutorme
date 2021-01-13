export interface Cred {
  username: string;
  password: string;
  token?: string;
}

export interface Title {
  id: number;
  name: string;
  level: string;
  fees: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: number;
  username: string;
  name: string;
  phone: number;
  email: string;
  address: string;
  dob: Date;
}

export interface Subject {
  id?: number;
  name: string;
  level: string;
  fees: number;
}

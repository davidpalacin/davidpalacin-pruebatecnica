import { Role } from "./enums";

export interface UserEntry {
  id: number
  name: string
  email: string
  password: string,
  role: Role
}

export type NonSensitiveInfoUserEntry = Omit<UserEntry, 'password'>

export type NewUserEntry = Omit<UserEntry, 'id'>

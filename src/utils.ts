import { NewUserEntry } from "./types";
import { Role } from "./enums";

const parseName = (nameFromRequest: any): string => {
  if(!isString(nameFromRequest)) {
    throw new Error('Incorrect or missing Name');
  }

  return nameFromRequest
}

const parseEmail = (emailFromRequest: any): string => {
  if(!isString(emailFromRequest)) {
    throw new Error('Incorrect or missing email');
  }

  return emailFromRequest
}

const parsePassword = (passwordFromRequest: any): string => {
  if(!isString(passwordFromRequest)) {
    throw new Error('Incorrect or missing password');
  }
  return passwordFromRequest;
}

const parseRole = (roleFromRequest: any): Role => {
  if(!isString(roleFromRequest) || !isRole(roleFromRequest)) {
    throw new Error('Incorrect or missing role');
  }

  return roleFromRequest
}

const isRole = (role: any): boolean => {
  return Object.values(Role).includes(role)
}

const isString = (string: string): boolean => {
  return typeof string === 'string'
}

const toNewUserEntry = (object: any, hashedPassword: any): NewUserEntry => {

  const newUser: NewUserEntry = {
    name: parseName(object.name),
    email: parseEmail(object.email),
    password: parsePassword(hashedPassword),
    role: parseRole(object.role),
  }

  return newUser
}

export default toNewUserEntry
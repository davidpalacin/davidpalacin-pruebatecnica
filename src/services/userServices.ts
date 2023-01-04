import { NonSensitiveInfoUserEntry, UserEntry } from "../types";

// Recibe usuarios y los devuelve sin la información sensible
export const getUsersWithoutSensitiveInfo = (users: UserEntry[]): NonSensitiveInfoUserEntry[] => {
  return users.map(({id, name,email, role}) => {
    return {id, name, email, role}
  })
};

// Recibe un usuario y lo devuelve sin la información sensible
export const getUserWithoutSensitiveInfo = (user: UserEntry): NonSensitiveInfoUserEntry => {
  return {id: user.id, name: user.name, email: user.email, role: user.role}
};

// Comprueba si queda información por rellenar
export const checkEmptyFields = (object: any): string[] => {
  const errors: string[] = [];

  if(!object.name) {
    errors.push('Name is required');
  }
  if(!object.password) {
    errors.push('Password is required');
  }
  if(!object.role) {
    errors.push('Role is required');
  }

  return errors;
}

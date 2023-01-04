import { NewUserEntry, NonSensitiveInfoUserEntry, UserEntry } from "../types";

const users: UserEntry[] = userData as UserEntry[];

export const getUsers = (users: UserEntry[]): UserEntry[] => users;

export const getUsersWithoutSensitiveInfo = (users: UserEntry[]): NonSensitiveInfoUserEntry[] => {
  return users.map(({id, name,email, role}) => {
    return {id, name, email, role}
  })
};

export const getUserWithoutSensitiveInfo = (user: UserEntry): NonSensitiveInfoUserEntry => {
  return {id: user.id, name: user.name, email: user.email, role: user.role}
};

export const findById = (id: number): NonSensitiveInfoUserEntry | undefined => {
  const entry = users.find((u) => u.id === id);
  if (entry != null) {
    const { password, ...restOfUser } = entry;
    return restOfUser;
  }

  return undefined;
};

export const findByName = (
  name: string
): NonSensitiveInfoUserEntry | undefined => {
  const entry = users.find((u) => u.name === name);
  if (entry != null) {
    const { password, ...restOfUser } = entry;
    return restOfUser;
  }

  return undefined;
};

export const addUser = (newUserEntry: NewUserEntry): NewUserEntry => {
  const newUser = {
    id: Math.max(...users.map((u) => u.id)) + 1,
    ...newUserEntry,
  };

  users.push(newUser);
  return newUser;
};

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

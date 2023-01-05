"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmptyFields = exports.getUserWithoutSensitiveInfo = exports.getUsersWithoutSensitiveInfo = void 0;
// Recibe usuarios y los devuelve sin la información sensible
const getUsersWithoutSensitiveInfo = (users) => {
    return users.map(({ id, name, email, role }) => {
        return { id, name, email, role };
    });
};
exports.getUsersWithoutSensitiveInfo = getUsersWithoutSensitiveInfo;
// Recibe un usuario y lo devuelve sin la información sensible
const getUserWithoutSensitiveInfo = (user) => {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
};
exports.getUserWithoutSensitiveInfo = getUserWithoutSensitiveInfo;
// Comprueba si queda información por rellenar
const checkEmptyFields = (object) => {
    const errors = [];
    if (!object.name) {
        errors.push('Name is required');
    }
    if (!object.password) {
        errors.push('Password is required');
    }
    if (!object.role) {
        errors.push('Role is required');
    }
    return errors;
};
exports.checkEmptyFields = checkEmptyFields;

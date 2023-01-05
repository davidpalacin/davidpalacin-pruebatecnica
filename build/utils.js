"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./enums");
const parseName = (nameFromRequest) => {
    if (!isString(nameFromRequest)) {
        throw new Error('Incorrect or missing Name');
    }
    return nameFromRequest;
};
const parseEmail = (emailFromRequest) => {
    if (!isString(emailFromRequest)) {
        throw new Error('Incorrect or missing email');
    }
    return emailFromRequest;
};
const parsePassword = (passwordFromRequest) => {
    if (!isString(passwordFromRequest)) {
        throw new Error('Incorrect or missing password');
    }
    return passwordFromRequest;
};
const parseRole = (roleFromRequest) => {
    if (!isString(roleFromRequest) || !isRole(roleFromRequest)) {
        throw new Error('Incorrect or missing role');
    }
    return roleFromRequest;
};
const isRole = (role) => {
    return Object.values(enums_1.Role).includes(role);
};
const isString = (string) => {
    return typeof string === 'string';
};
const toNewUserEntry = (object, hashedPassword) => {
    const newUser = {
        name: parseName(object.name),
        email: parseEmail(object.email),
        password: parsePassword(hashedPassword),
        role: parseRole(object.role),
    };
    return newUser;
};
exports.default = toNewUserEntry;

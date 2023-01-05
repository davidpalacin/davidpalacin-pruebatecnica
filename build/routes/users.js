"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userServices = __importStar(require("../services/userServices"));
const db_1 = require("../services/db");
const utils_1 = __importDefault(require("../utils"));
const router = express_1.default.Router();
dotenv_1.default.config();
// Todos los usuarios
router.get("/", (_req, res) => {
    try {
        const sql = "SELECT * FROM users";
        db_1.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const data = userServices.getUsersWithoutSensitiveInfo(rows);
            res.json(data);
        });
    }
    catch (e) {
        res.status(500).send("Internal Server Error");
    }
});
// Usuario por id
router.get("/:id", (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM users WHERE id = ${id}`;
        db_1.db.get(sql, [], (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            else if (row) {
                const data = userServices.getUserWithoutSensitiveInfo(row);
                res.json(data);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        });
    }
    catch (e) {
        res.status(500).send("Internal Server Error");
    }
});
// Usuario por nombre
router.get("/byname/:name", (req, res) => {
    try {
        const name = req.params.name;
        const sql = `SELECT * FROM users WHERE name = '${name}'`;
        db_1.db.get(sql, [], (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            else if (row) {
                const data = userServices.getUserWithoutSensitiveInfo(row);
                res.json(data);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        });
    }
    catch (e) {
        res.status(500).send("Internal Server Error");
    }
});
// Crear un usuario
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Hago una llamada a mi propia API para saber si ese nombre de usuario está registrado
        const call = yield fetch("http://localhost:3000/api/users/byname/" + req.body.name);
        const userExist = yield call.json();
        if (userExist.error) {
            // El usuario no existe porque mi API me devuelve un obj.error, así que se puede usar ese nombre de usuario
            const errors = userServices.checkEmptyFields(req.body);
            // Si falta información, no permito crear el usuario
            if (errors.length > 0) {
                res.status(400).json(errors);
                return;
            }
            else {
                // Hasheamos la contraseña del usuario para no guardar texto plano, creo el objeto de nuevo usuario y se inserta en BD
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
                const newUserEntry = (0, utils_1.default)(req.body, hashedPassword);
                const sql = `INSERT INTO users (name, email, password, role) VALUES
      ('${newUserEntry.name}', '${newUserEntry.email}', '${newUserEntry.password}', '${newUserEntry.role}');`;
                db_1.db.run(sql, [], function (err, _result) {
                    if (err) {
                        res.status(400).json({ error: err.message });
                        return;
                    }
                    res.json({
                        message: `Added ${newUserEntry.name} to database`,
                        data: newUserEntry,
                    });
                });
            }
        }
        else {
            res
                .status(400)
                .json({
                error: "Ese nombre de usuario es existente, por favor, elige otro",
            });
        }
    }
    catch (e) {
        res.status(500).send("Internal Server Error");
    }
}));
// Login de usuario
router.post("/login", (req, res) => {
    // Primero encontramos un usuario con el nombre introducido
    const name = req.body.name;
    const sql = `SELECT * FROM users WHERE name = '${name}'`;
    db_1.db.get(sql, [], (err, row) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        else if (row) {
            console.log(row);
            // Con el usuario encontrado comprobamos si matchea la contraseña introducida con el hash guardado
            const match = yield bcrypt_1.default.compare(req.body.password, row.password);
            // Si matchea entonces podemos crear un token de acceso
            if (match) {
                const accessToken = jsonwebtoken_1.default.sign(JSON.stringify(row), process.env.TOKEN_SECRET);
                res.json({ accessToken: accessToken });
            }
            else {
                res.json({ error: "Credenciales incorrectas" });
            }
        }
        else {
            res.status(404).json({ error: "User not found" });
        }
    }));
});
// Editar/Actualizar a un usuario
router.patch("/update/:id", (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    };
    const sql = `UPDATE users set name = COALESCE(?,name), email = COALESCE(?,email), password = COALESCE(?,password), role = COALESCE(?,role)
  WHERE id = ?`;
    db_1.db.run(sql, [data.name, data.email, data.password, data.role, req.params.id], function (err, _result) {
        if (err) {
            res.status(400).json({ error: err });
            return;
        }
        res.json({
            message: `User with id ${req.params.id} updated.`,
            data: data,
        });
    });
});
// Eliminar un usuario
router.delete("/delete/:id", (req, res) => {
    try {
        const id = req.params.id;
        const sql = `DELETE FROM users WHERE id = ${id}`;
        db_1.db.run(sql, [], function (err, _result) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ message: `Deleted user with id: ${id}` });
        });
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
exports.default = router;

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import * as userServices from "../services/userServices";
import { db } from "../services/db";
import toNewUserEntry from "../utils";

const router = express.Router();
dotenv.config();

// Todos los usuarios
router.get("/", (_req, res) => {
  try {
    const sql = "SELECT * FROM users";

    db.all(sql, [], (err: Error, rows: any) => {
      if (err) {
        throw err;
      }
      const data = userServices.getUsersWithoutSensitiveInfo(rows);
      res.json(data);
    });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Usuario por id
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ${id}`;

    db.get(sql, [], (err: Error, row: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      } else if (row) {
        const data = userServices.getUserWithoutSensitiveInfo(row);
        res.json(data);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Usuario por nombre
router.get("/byname/:name", (req, res) => {
  try {
    const name = req.params.name;
    const sql = `SELECT * FROM users WHERE name = '${name}'`;
    console.log(sql);

    db.get(sql, [], (err: Error, row: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      } else if (row) {
        const data = userServices.getUserWithoutSensitiveInfo(row);
        res.json(data);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Crear un usuario
router.post("/create", async (req, res) => {
  try {
    const errors: string[] = userServices.checkEmptyFields(req.body);
    // Si falta información, no permito crear el usuario
    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    } else {
      // Hasheamos la contraseña del usuario para no guardar texto plano, creo el objeto de nuevo usuario y se inserta en BD
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUserEntry = toNewUserEntry(req.body, hashedPassword);

      const sql = `INSERT INTO users (name, email, password, role) VALUES
      ('${newUserEntry.name}', '${newUserEntry.email}', '${newUserEntry.password}', '${newUserEntry.role}');`;

      db.run(sql, [], function (err: Error, result: any) {
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
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

// Login de usuario
router.post("/login", (req, res) => {
  // Primero encontramos un usuario con el nombre introducido
  const name = req.body.name;
  const sql = `SELECT * FROM users WHERE name = '${name}'`;

  db.get(sql, [], async (err: Error, row: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else if (row) {
      console.log(row);
      // Con el usuario encontrado comprobamos si matchea la contraseña introducida con el hash guardado
      const match = await bcrypt.compare(req.body.password, row.password);

      // Si matchea entonces podemos crear un token de acceso
      if (match) {
        const accessToken = jwt.sign(
          JSON.stringify(row),
          process.env.TOKEN_SECRET as string
        );
        res.json({ accessToken: accessToken });
      } else {
        res.json({error: "Credenciales incorrectas"});
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
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
  db.run(
    sql,
    [data.name, data.email, data.password, data.role, req.params.id],
    function (err: Error, result: any) {
      if (err) {
        res.status(400).json({ error: err });
        return;
      }
      res.json({
        message: `User with id ${req.params.id} updated.`,
        data: data,
      });
    }
  );
});

// Eliminar un usuario
router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM users WHERE id = ${id}`;

    db.run(sql, [], function (err: Error, result: any) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: `Deleted user with id: ${id}` });
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;

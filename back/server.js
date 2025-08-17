
require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Connexion à la base de données Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Stockée dans un fichier .env
    ssl: { rejectUnauthorized: false }, // Requis pour Neon
});

// Middlewares
app.use(cors());
app.use(express.json());

// Route pour récupérer les scores
app.get("/controller", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM scores ORDER BY score DESC LIMIT 5");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour ajouter un score
app.post("/controller", async (req, res) => {
    const { pseudo, score } = req.body;
    try {
        await pool.query("INSERT INTO scores (pseudo, score) VALUES ($1, $2)", [pseudo, score]);
        res.status(201).json({ message: "Score ajouté !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

// Gérer les routes React
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});

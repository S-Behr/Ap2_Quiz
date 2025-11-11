import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, sql } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get("/Kategorie", async (req, res) => {
  try {
    const result = await sql.query`SELECT  * FROM Kategorie`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/Unterkategorie", async (req, res) => {
  try {
    const result = await sql.query`SELECT  * FROM Unterkategorie`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/flashcards/:subtopicId", async (req, res) => {
  const subtopicId = req.params.subtopicId;
  try {
    const cardsResult = await sql.query`
            SELECT ID AS id, Frage AS frage, Antwort AS antwort 
            FROM FrageAntwort 
            WHERE UnterkategorieID = ${subtopicId}`;
    res.json(cardsResult.recordset);
  } catch (err) {
    console.error("Flashcard SQL Fehler:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Flashcards." });
  }
});

app.get("/Quizfragen", async (req, res) => {
  try {
    const result = await sql.query`SELECT  * FROM QuizFragen`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server läuft auf Port ${PORT} (${process.env.NODE_ENV})`);
});

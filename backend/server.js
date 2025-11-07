import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, sql } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.get("/", async (req, res) => {
  try {
    const result = await sql.query`SELECT  * FROM FrageAntwort`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server läuft auf Port ${PORT} (${process.env.NODE_ENV})`);
});

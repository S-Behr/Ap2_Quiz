import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, sql } from "./db.js";

const app = express();
app.disable("etag");
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
  const kategorieId = req.query.KategorieID;

  try {
    let query;

    if (kategorieId) {
      query = sql.query`
        SELECT * FROM Unterkategorie 
        WHERE KategorieID = ${kategorieId}
      `;
    } else {
      query = sql.query`SELECT  * FROM Unterkategorie`;
    }

    const result = await query;
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL Fehler bei Unterkategorie-Abruf:", err);
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

app.get("/quiz-questions", async (req, res) => {
  const requestedLimit = parseInt(req.query.limit, 10);
  const limit = [5, 8].includes(requestedLimit) ? requestedLimit : 1;

  try {
    const questionsResult = await sql.query`
      SELECT TOP (${limit}) FrageID, ArtID, FragenText, Bild 
      FROM QuizFragen
      ORDER BY NEWID() 
    `;
    const question = questionsResult.recordset;
    const questionIds = question.map((f) => f.FrageID);
    const answersSql = `
      SELECT AntwortID, QuizFrageID, AntwortenText
      FROM Antwortmoeglichkeiten
      WHERE QuizFrageID IN (${questionIds.join(",")})
    `;
    const answersResult = await sql.query(answersSql);
    const answers = answersResult.recordset;
    const typeResult = await sql.query`SELECT FragenartID, Art FROM Fragenart`;
    const types = typeResult.recordset;

    const typesMap = types.reduce((map, art) => {
      map[art.FragenartID] = art.Art;
      return map;
    }, {});

    const allMappedQuestions = question.map((f) => {
      const art = typesMap[f.ArtID];
      const relatedAnswers = answers.filter((a) => a.QuizFrageID === f.FrageID);

      return {
        id: f.FrageID,
        text: f.FragenText,
        type: art === "Multiplichoise" ? "multiple" : "single",
        answers: relatedAnswers.map((r) => ({
          id: r.AntwortID,
          text: r.AntwortenText,
        })),
      };
    });

    res.json(allMappedQuestions);
  } catch (err) {
    console.error("Fehler beim Laden der Quizdaten:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Quizdaten." });
  }
});

app.post("/check-answer", async (req, res) => {
  const { questionId } = req.body;
  if (!questionId) {
    return res.status(400).json({ error: "questionId fehlt in der Anfrage." });
  }

  try {
    const result = await sql.query`
    SELECT AntwortID
    FROM Antwortmoeglichkeiten
    WHERE QuizFrageID = ${questionId} AND IstRichtig = 1
    `;

    const correctIds = result.recordset.map((record) => record.AntwortID);
    res.json({ correctIds: correctIds });
  } catch (err) {
    console.error("SQL Fehler bei der Antwortprüfung:", err);
    res
      .status(500)
      .json({ error: "Fehler beim Abrufen der korrekten Antworten." });
  }
});

const getCorrectAnswers = async (questionIds) => {
  if (questionIds.length === 0) return {};

  const idList = questionIds.join(",");

  try {
    const sqlQueryString = `
      SELECT QuizFrageID, AntwortID
      FROM Antwortmoeglichkeiten
      WHERE QuizFrageID IN (${idList}) AND IstRichtig = 1
    `;

    const result = await sql.query(sqlQueryString);

    const correctAnswersMap = result.recordset.reduce((acc, record) => {
      if (!acc[record.QuizFrageID]) {
        acc[record.QuizFrageID] = [];
      }
      acc[record.QuizFrageID].push(record.AntwortID);
      return acc;
    }, {});

    return correctAnswersMap;
  } catch (err) {
    console.error("SQL Fehler beim Abrufen der korrekten Antworten:", err);
    throw new Error("Fehler beim Abrufen der korrekten Antworten.");
  }
};

app.post("/submit-exam", async (req, res) => {
  const { userAnswers } = req.body;

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return res
      .status(400)
      .json({ error: "Keine Antworten zur Auswertung erhalten." });
  }

  try {
    const questionIds = Object.keys(userAnswers).map(Number);
    const correctAnswersMap = await getCorrectAnswers(questionIds);

    let correctCount = 0;
    const totalQuestions = questionIds.length;
    const passingPercentage = 50;
    const questionsDetails = [];

    for (const qId of questionIds) {
      const questionId = qId.toString();

      const userSelectedAnswers = userAnswers[questionId]
        ? userAnswers[questionId].sort((a, b) => a - b)
        : [];
      const correctAnswers = correctAnswersMap[qId]
        ? correctAnswersMap[qId].sort((a, b) => a - b)
        : [];

      const userString = userSelectedAnswers.join(",");
      const correctString = correctAnswers.join(",");

      if (userString === correctString && correctString.length > 0) {
        correctCount++;
      }

      questionsDetails.push({
        questionId: qId,
        correctAnswerIds: correctAnswers,
      });
    }

    const percentage =
      totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const hasPassed = percentage >= passingPercentage;

    res.json({
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      percentage: percentage,
      hasPassed: hasPassed,
      questions: questionsDetails,
    });
  } catch (error) {
    console.error("Fehler bei der Prüfungsabgabe:", error.message);
    res.status(500).json({ error: "Fehler bei der Auswertung der Prüfung." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server läuft auf Port ${PORT} (${process.env.NODE_ENV})`);
});

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, sql } from "./db.js";

const app = express();
app.disable("etag");
app.use(cors());
app.use(express.json());
connectDB();

// app.use(
//   "/static",
//   express.static("build", {
//     etag: false,
//     lastModified: false,
//   })
// );

// app.use((req, res, next) => {
//   if (
//     req.path.includes(".tsx") ||
//     req.path.includes(".ts") ||
//     req.path.includes(".js")
//   ) {
//     res.set("Cache-Control", "no-store, must-revalidate");
//     res.removeHeader("ETag");
//     res.removeHeader("Last-Modified");
//   }
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, max-age=0"
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });

// app.use(
//   express.static("public", {
//     etag: false,
//     lastModified: false,
//     setHeaders: (res) => {
//       res.set(
//         "Cache-Control",
//         "no-store, no-cache, must-revalidate, max-age=0"
//       );
//     },
//   })
// );
// const options = {
//   dotfiles: "ignore",
//   etag: false,
//   extensions: ["htm", "html"],
//   index: false,
//   maxAge: "1d",
//   redirect: false,
//   lastModified: false,
//   setHeaders(res, path, stat) {
//     res.setHeader(
//       "Cache-Control",
//       "no-store, no-cache, must-revalidate, proxy-revalidate"
//     );
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");
//   },
// };
// app.use(express.static("public", options));

// app.use(
//   express.static("build", {
//     etag: false,
//     lastModified: false,
//     setHeaders: (res, path) => {
//       if (
//         path.endsWith(".tsx") ||
//         path.endsWith(".ts") ||
//         path.endsWith(".js")
//       ) {
//         res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//         res.setHeader("Pragma", "no-cache");
//         res.setHeader("Expires", "0");
//       }
//     },
//   })
// );

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

app.get("/Antwortmoeglichkeiten", async (req, res) => {
  try {
    const result = await sql.query`
    SELECT AntwortID, QuizFrageID, AntwortenText 
    FROM Antwortmoeglichkeiten`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/Fragenart", async (req, res) => {
  try {
    const result = await sql.query`SELECT  * FROM Fragenart`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const passingPercentage = 50; // Bestehensgrenze

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
    }

    const percentage =
      totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const hasPassed = percentage >= passingPercentage;

    res.json({
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      percentage: percentage,
      hasPassed: hasPassed,
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

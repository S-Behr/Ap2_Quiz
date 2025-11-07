import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUSTCERT === "false",
  },
};

export async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log(" Verbindung zu Azure SQL erfolgreich hergestellt");
  } catch (err) {
    console.error(" Azure SQL Verbindung fehlgeschlagen:", err.message);
  }
}

export { sql };

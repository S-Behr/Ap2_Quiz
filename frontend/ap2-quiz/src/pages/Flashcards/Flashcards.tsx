import React, { useState } from "react";
import "./flashcards.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface Subtopic {
  title: string;
  path: string;
}

interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

const initialLernfelder: Topic[] = [
  {
    id: "kunden",
    title: "Kundenbeziehung",
    subtopics: [
      {
        title: "Rechtliche & betriebliche Grundsätze",
        path: "k_RbG",
      },
      {
        title: "Kundengesprächs-Management (Vorbereitung & Nachbereitung)",
        path: "k_KgM",
      },
      {
        title: "Relationship Marketing (Kundenprozesse)",
        path: "k_RM",
      },
      {
        title: "Customer Relationship Management (CRM)",
        path: "k_CRM",
      },
      {
        title: "Gesetz gegen unlauteren Wettbewerb",
        path: "k_GuW",
      },
      {
        title: "AGB-Gesetz",
        path: "k_AGB",
      },
      {
        title: "Regelkonformität",
        path: "k_Regel",
      },
      {
        title: "Compliance-Regelungen",
        path: "k_CR",
      },
      {
        title: "Ethik",
        path: "k_Ethik",
      },
    ],
  },
  {
    id: "präsentieren",
    title: "Präsentieren",
    subtopics: [
      { title: "Situationsgerechte Gesprächsführung", path: "p_SG" },
      { title: "Multimediale Datenaufbereitung", path: "p_MD" },
      { title: "Softwarebasierte Sachpräsentation", path: "p_SSp" },
      { title: "Kommunikations- & Argumentationstechniken", path: "p_KA" },
      { title: "Präsentationstechniken", path: "p_Pt" },
      { title: "Visualisierung & Mediengestaltung", path: "p_VM" },
      { title: "Tabellenkalkulation", path: "p_Tk" },
      { title: "Präsentationssoftware", path: "p_Ps" },
      { title: "Multimediale Content-Tools", path: "p_MCT" },
      { title: "Corporate Identity (CI)", path: "p_CI" },
      { title: "Marktübliche Präsentationssoftware", path: "p_MPs" }, //hier bin ich
      {
        title: "Präsentationsmanagement (Vorbereitung/Nachbereitung)",
        path: "p_VuNb",
      },
      { title: "Präsentationselemente: Regeln & Farbwirkung", path: "p_PeRF" },
      { title: "Rhetorik & Sprechtechnik", path: "p_RSt" },
    ],
  },
  {
    id: "trends",
    title: "Trends",
    subtopics: [
      {
        title: "Auswirkungen von IT-Trends (Wirtschaft, Soziales, Beruf)",
        path: "t_AT",
      },
      { title: "Einflussfaktoren auf IT-Einsatzfelder", path: "t_EfE" },
      { title: "Trend- & Innovationsfelder (Identifikation)", path: "t_TI" },
      { title: "Informationen zu Unternehmenseinfluss", path: "t_IzU" },
      {
        title: "Aktive Informationsbeschaffung (Newsfeeds/Newsletter)",
        path: "t_AINews",
      },
      { title: "Quellen zur Trendwahrnehmung (Messen, Foren)", path: "t_QT" },
      { title: "Prüfung neuer IT-Einsatzgebiete", path: "t_PITe" },
    ],
  },
  {
    id: "datenbanken",
    title: "Datenbanken",
    subtopics: [
      { title: "SQL Grundlagen", path: "db_sql" },
      { title: "Normalisierung", path: "db_norm" },
    ],
  },
  {
    id: "quali",
    title: "Qualitätssicherung",
    subtopics: [
      { title: "Testverfahren", path: "qs_test" },
      { title: "Metriken", path: "qs_metrik" },
    ],
  },
  {
    id: "itsicher",
    title: "IT-Sicherheit",
    subtopics: [
      { title: "Authentifizierung", path: "sec_auth" },
      { title: "Kryptografie", path: "sec_krypto" },
    ],
  },
  {
    id: "daten",
    title: "Datenschutz",
    subtopics: [
      { title: "DSGVO", path: "dsgvo" },
      { title: "Rechte Betroffener", path: "ds_rechte" },
    ],
  },
  {
    id: "netzwerk",
    title: "Netzwerktechnik",
    subtopics: [
      { title: "OSI-Modell", path: "nt_osi" },
      { title: "IP-Adressierung", path: "nt_ip" },
    ],
  },
  {
    id: "speicher",
    title: "Speicherlösungen",
    subtopics: [
      { title: "RAID", path: "sp_raid" },
      { title: "Cloud-Speicher", path: "sp_cloud" },
    ],
  },
  {
    id: "software",
    title: "Softwarelösungen",
    subtopics: [
      { title: "Agile Methoden", path: "sw_agile" },
      { title: "Lizenzmodelle", path: "sw_lizenz" },
    ],
  },
];

const Flashcards: React.FC = () => {
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const handleToggle = (topicId: string) => {
    setOpenTopic(openTopic === topicId ? null : topicId);
  };

  return (
    <>
      <div className="flashcards-wrapper">
        <h1>Lernkarten</h1>
        <div className="grid-wrapper">
          <h2>Lernfelder</h2>
          <div className="category-grid">
            {initialLernfelder.map((topic) => (
              <div
                key={topic.id}
                className={`topic-container ${
                  openTopic === topic.id ? "active" : ""
                }`}
              >
                <button
                  className="topic-header"
                  onClick={() => handleToggle(topic.id)}
                >
                  {topic.title}
                  <span className="expand-icon">
                    {openTopic === topic.id ? "▲" : "▼"}
                  </span>
                </button>
                {openTopic === topic.id && (
                  <div className="subtopic-menu">
                    {topic.subtopics.map((subtopic) => (
                      <Link
                        key={subtopic.path}
                        to={`/flashcards/${subtopic.path}`}
                        className="subtopic-link"
                      >
                        {subtopic.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button variant="outlined" component={Link} to="/">
          zurück zur Startseite
        </Button>
      </div>
    </>
  );
};

export default Flashcards;

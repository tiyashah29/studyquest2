const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./studyquest.db');

db.serialize(() => {
    // Users: Stores XP and Level
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
    )`);

    // Quizzes: Categorized by Language and Difficulty
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT,
        difficulty TEXT,
        xp_reward INTEGER
    )`);

    // Questions: Links 10 questions to each quiz
    db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        question_text TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option INTEGER, 
        FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    )`);
});

module.exports = db;
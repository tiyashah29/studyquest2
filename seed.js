const db = require('./database');

db.serialize(() => {
    // 1. Create Quizzes Table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        language TEXT,
        difficulty TEXT,
        xp_reward INTEGER
    )`);

    // 2. Insert diverse Quizzes
    const quizzes = [
        { lang: 'Python', diff: 'Easy', xp: 500 },
        { lang: 'JavaScript', diff: 'Medium', xp: 1000 },
        { lang: 'C++', diff: 'Hard', xp: 1500 },
        { lang: 'Java', diff: 'Medium', xp: 1000 }
    ];

    quizzes.forEach(q => {
        db.run(`INSERT INTO quizzes (language, difficulty, xp_reward) VALUES (?, ?, ?)`, [q.lang, q.diff, q.xp]);
    });

    // 3. Insert 10 Questions for each Quiz (Example for Python Easy)
    const stmt = db.prepare(`INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    for (let i = 1; i <= 10; i++) {
        stmt.run(1, `Python Easy Q${i}: What is the output of print(2**3)?`, "6", "8", "9", "12", 1);
        stmt.run(2, `JS Medium Q${i}: Which keyword is used to define a constant?`, "var", "let", "const", "def", 2);
    }
    stmt.finalize();
    console.log("Database seeded with multiple languages and difficulties!");
});
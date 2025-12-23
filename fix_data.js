const db = require('./database');

db.serialize(() => {
    // Delete existing questions for Quiz 1 to avoid duplicates
    db.run("DELETE FROM questions WHERE quiz_id = 1");

    const stmt = db.prepare(`INSERT INTO questions 
        (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`);

    for (let i = 1; i <= 10; i++) {
        stmt.run(
            1,
            `Question ${i}: What is ${i} + ${i}?`,
            `${i * 2}`, `${i + 1}`, `${i - 1}`, `${i + 10}`,
            0 // Option A is correct
        );
    }

    stmt.finalize(() => {
        db.get("SELECT COUNT(*) as total FROM questions WHERE quiz_id = 1", (err, row) => {
            console.log("SUCCESS! Database now has " + row.total + " questions for Quiz 1.");
            process.exit();
        });
    });
});
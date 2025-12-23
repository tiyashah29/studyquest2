const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'studyquest-key', resave: false, saveUninitialized: true }));

// --- ROUTES ---

app.get('/', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (user) {
            req.session.userId = user.id;
            req.session.username = user.username;
            res.redirect('/dashboard');
        } else {
            res.send("Invalid Login. <a href='/'>Try again</a>");
        }
    });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    db.get(`SELECT * FROM users WHERE id = ?`, [req.session.userId], (err, user) => {
        res.render('dashboard', { user });
    });
});

// FIX: Added the missing /quiz-select route
app.get('/quiz-select', (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    db.all(`SELECT * FROM quizzes`, [], (err, rows) => {
        res.render('quiz-select', { quizzes: rows });
    });
});

app.get('/quiz/:id', (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    res.render('quiz', { quizId: req.params.id });
});

// --- API ENDPOINTS ---

app.get('/api/leaderboard', (req, res) => {
    db.all(`SELECT username, xp, level FROM users ORDER BY xp DESC LIMIT 10`, [], (err, rows) => {
        res.json(rows);
    });
});

app.get('/api/quiz-questions/:id', (req, res) => {
    // We order by RANDOM() so every time they play, it feels unique
    db.all(`SELECT * FROM questions WHERE quiz_id = ? ORDER BY RANDOM() LIMIT 10`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(`Serving ${rows.length} questions for Quiz ID ${req.params.id}`);
        res.json(rows);
    });
});

// Fetch all users sorted by XP descending
app.get('/api/leaderboard', (req, res) => {
    db.all(`SELECT username, xp, level FROM users WHERE xp > 0 ORDER BY xp DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Show Sign Up Page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle Sign Up Logic
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // Insert new user with 0 XP and Level 1
    db.run(`INSERT INTO users (username, password, xp, level) VALUES (?, ?, 0, 1)`,
        [username, password],
        function (err) {
            if (err) {
                return res.send("Username taken or error occurred. <a href='/signup'>Try again</a>");
            }
            res.redirect('/'); // Redirect to login after successful sign up
        }
    );
});

app.post('/api/anticheat/log', (req, res) => {
    const { type } = req.body;
    console.log(`Violation by ${req.session.username}: ${type}`);
    db.run(`INSERT INTO cheat_logs (user_id, type) VALUES (?, ?)`, [req.session.userId, type]);
    res.sendStatus(200);
});

// Endpoint to update XP after a quiz
app.post('/api/update-xp', (req, res) => {
    const userId = req.session.userId;
    const { xpGained } = req.body;

    if (!userId) return res.status(401).json({ error: "Not logged in" });

    // Update XP and Level (1 Level per 500 XP)
    db.run(
        `UPDATE users SET xp = xp + ?, level = ((xp + ?) / 500) + 1 WHERE id = ?`,
        [xpGained, xpGained, userId],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
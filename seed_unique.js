const db = require('./database');

const fullQuizData = [
    {
        id: 1, lang: 'Python', diff: 'Easy',
        questions: [
            ["Py: Which symbol is used for comments?", "#", "//", "/*", "--", 0],
            ["Py: Correct file extension?", ".py", ".pt", ".pyt", ".pyc", 0],
            ["Py: How to start a function?", "def", "func", "create", "function", 0],
            ["Py: Which is a list?", "[1,2]", "{1,2}", "(1,2)", "<1,2>", 0],
            ["Py: Output function?", "echo", "log", "print()", "write", 2],
            ["Py: Logical 'and' symbol?", "&&", "and", "&", "||", 1],
            ["Py: Variable x=5 is what type?", "float", "string", "int", "bool", 2],
            ["Py: Add to list end?", "push", "add", "append", "insert", 2],
            ["Py: Result of 2**3?", "6", "8", "9", "12", 1],
            ["Py: Which is a tuple?", "[1,2]", "(1,2)", "{1,2}", "<1,2>", 2]
        ]
    },
    {
        id: 2, lang: 'JavaScript', diff: 'Medium',
        questions: [
            ["JS: How to declare a constant?", "const", "var", "let", "constant", 0],
            ["JS: Which is NOT a primitive type?", "string", "number", "object", "boolean", 2],
            ["JS: Equality without type coercion?", "==", "===", "=", "!=", 1],
            ["JS: Select by ID function?", "getID()", "query()", "getElementById()", "find()", 2],
            ["JS: Arrow function syntax?", "()=>{}", "()->{}", "=>{}", "function=>", 0],
            ["JS: Which is 'Not a Number'?", "null", "NaN", "undefined", "void", 1],
            ["JS: Map function returns what?", "void", "index", "new array", "boolean", 2],
            ["JS: Add to end of array?", "push()", "pop()", "shift()", "add()", 0],
            ["JS: Multi-line comment?", "//", "/* */", "#", "--", 1],
            ["JS: Keyword for current object?", "this", "self", "me", "it", 0]
        ]
    },
    {
        id: 3, lang: 'Java', diff: 'Hard',
        questions: [
            ["Java: Which keyword defines a class?", "class", "Class", "struct", "void", 0],
            ["Java: Entry point method name?", "start", "init", "main", "run", 2],
            ["Java: String is a primitive?", "True", "False", "Sometimes", "Never", 1],
            ["Java: End of statement char?", ":", ".", ";", ",", 2],
            ["Java: Keyword for inheritance?", "implements", "extends", "inherits", "import", 1],
            ["Java: Memory management system?", "Manual", "Garbage Collection", "Pointer", "None", 1],
            ["Java: Access modifier for everywhere?", "private", "protected", "public", "internal", 2],
            ["Java: Create object keyword?", "new", "alloc", "make", "create", 0],
            ["Java: Which is a wrapper class?", "int", "char", "Integer", "float", 2],
            ["Java: Boolean default value?", "true", "false", "0", "null", 1]
        ]
    }
];

db.serialize(() => {
    db.run("DELETE FROM quizzes");
    db.run("DELETE FROM questions");

    const qzStmt = db.prepare("INSERT INTO quizzes (id, language, difficulty, xp_reward) VALUES (?, ?, ?, 1000)");
    const qStmt = db.prepare("INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)");

    fullQuizData.forEach(quiz => {
        qzStmt.run(quiz.id, quiz.lang, quiz.diff);
        quiz.questions.forEach(q => {
            qStmt.run(quiz.id, ...q);
        });
    });

    qzStmt.finalize();
    qStmt.finalize(() => {
        console.log("✅ Success: Created unique questions for all quizzes!");
        process.exit();
    });
});
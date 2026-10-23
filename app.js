
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "todo_user",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "todo_db"
};

let db;

async function connectDB() {
    for (let i = 1; i <= 30; i++) {
        try {
            db = await mysql.createConnection(dbConfig);

            await db.execute(`
                CREATE TABLE IF NOT EXISTS todos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    completed BOOLEAN NOT NULL DEFAULT FALSE
                )
            `);

            console.log("Connected to MySQL successfully!");
            return;
        } catch (err) {
            if (db) {
                await db.end().catch(() => {});
                db = null;
            }
            console.log(`Waiting for MySQL... ${i}/30`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    throw new Error("Could not connect to MySQL.");
}

app.get("/", async (req, res) => {
    try {
        console.log("Loading todos...");

        const [todos] = await db.execute(
            "SELECT * FROM todos ORDER BY id DESC"
        );

        console.log("Todos fetched:", todos);
        res.render("todos", { todos });
    } catch (err) {
        console.error("TODO PAGE ERROR:", err);
        res.status(500).send("Failed to load todos");
    }
});

app.post("/todos", async (req, res) => {
    const title = req.body.title;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).send("Todo title is required");
    }

    await db.execute("INSERT INTO todos (title) VALUES (?)", [title.trim()]);
    res.redirect("/");
});

app.get("/todos/:id/edit", async (req, res) => {
    const [rows] = await db.execute("SELECT * FROM todos WHERE id = ?", [req.params.id]);

    if (!rows.length) return res.status(404).send("Todo not found");

    res.render("edit", { todo: rows[0] });
});

app.post("/todos/:id/edit", async (req, res) => {
    const title = req.body.title;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).send("Todo title is required");
    }

    await db.execute("UPDATE todos SET title = ? WHERE id = ?", [
        title.trim(),
        req.params.id
    ]);

    res.redirect("/");
});

app.post("/todos/:id/toggle", async (req, res) => {
    await db.execute(
        "UPDATE todos SET completed = NOT completed WHERE id = ?",
        [req.params.id]
    );
    res.redirect("/");
});

app.post("/todos/:id/delete", async (req, res) => {
    await db.execute("DELETE FROM todos WHERE id = ?", [req.params.id]);
    res.redirect("/");
});

connectDB()
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

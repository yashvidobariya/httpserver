require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 8000; // Use PORT environment variable or default to 8000

mongoose.connect(process.env.DB)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.send("hello home page");
});

app.get("/users", async (req, res) => {
    const allUsers = await User.find({});
    return res.json(allUsers);
});

app.get("/users/:id", async (req, res) => {
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) return res.status(404).json({ error: "User not found" });
    return res.json(foundUser);
});

app.post("/users", async (req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    const newUser = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender
    });
    console.log(newUser);
    return res.json({ msg: "success", user: newUser });
});

app.patch("/users/:id", async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { first_name: "heni", last_name: "bhalala" });
    return res.json({ status: "success" });
});

app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "success" });
});

app.listen(port, () => console.log(`Server started on port ${port}`));

const express = require("express");
const router = express.Router();
const Question = require("../models/Answer");

// POST /api/answers - Submit an answer
router.post("/", async (req, res) => {
    try {
        const { mentee_id, question_id, answer, is_correct } = req.body;

        // Validate request data
        if (!mentee_id || !question_id || answer === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create a new answer entry
        const newAnswer = new Answer({
            mentee_id,
            question_id,
            answer,
            is_correct, // This can be determined later if needed
        });

        await newAnswer.save();

        res.status(201).json({ message: "Answer submitted successfully", answer: newAnswer });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// GET /api/answers/mentee/:menteeId - Get all answers by a mentee
router.get("/mentee/:menteeId", async (req, res) => {
    try {
        const { menteeId } = req.params;

        const answers = await Answer.find({ mentee_id: menteeId });

        if (!answers.length) {
            return res.status(404).json({ message: "No answers found for this mentee" });
        }

        res.json({ answers });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/answers/question/:questionId - Get all answers for a question
router.get("/question/:questionId", async (req, res) => {
    try {
        const { questionId } = req.params;

        const answers = await Answer.find({ question_id: questionId });

        if (!answers.length) {
            return res.status(404).json({ message: "No answers found for this question" });
        }

        res.json({ answers });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// POST /api/answers/evaluate - Evaluate an answer
router.post("/evaluate", async (req, res) => {
    try {
        const { question_id, answer } = req.body;

        if (!question_id || answer === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch the correct answer for the question
        const question = await Question.findById(question_id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const isCorrect = question.correct_answer === answer;

        res.json({ message: "Answer evaluated", is_correct: isCorrect });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


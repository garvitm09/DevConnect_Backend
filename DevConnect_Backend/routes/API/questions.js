const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// POST /api/questions - Add a new question
router.post("/", async (req, res) => {
    try {
        const { question_text, options, correct_answer, question_type, difficulty_level, created_by } = req.body;

        // Basic validation
        if (!question_text || !correct_answer || !question_type || !difficulty_level || !created_by) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newQuestion = new Question({
            question_text,
            options,
            correct_answer,
            question_type,
            difficulty_level,
            created_by
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/questions/:id - Update a question by ID
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { question_text, options, correct_answer, question_type, difficulty_level } = req.body;

        // Find the question by ID and update it
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { question_text, options, correct_answer, question_type, difficulty_level },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question updated successfully", updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE /api/questions/:id - Delete a question by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the question
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;

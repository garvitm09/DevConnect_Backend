const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
    question_text: { 
        type: String, 
        required: true },
    options: [{ 
        type: String 
    }], // For MCQs
    correct_answer: {
         type: String,
         required: true },
    question_type: { 
        type: String, 
        enum: ["MCQ", "Descriptive", "Practical", "Viva"], 
        required: true },
    difficulty_level: { 
        type: String, 
        enum: ["Easy", "Medium", "Hard"], 
        required: true },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true },
    created_at: { 
        type: Date, 
        default: Date.now },
});

module.exports = Questions = mongoose.model("question", QuestionSchema);

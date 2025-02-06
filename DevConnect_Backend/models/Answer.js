const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    mentee_id: mongoose.Schema.Types.ObjectId,
    question_id: mongoose.Schema.Types.ObjectId,
    answer: String,
    is_correct: Boolean, // Optional: Store evaluation result
    created_at: { type: Date, 
        default: Date.now }
});

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateQuestinoInput(data){
    let errors = {};
    data.question_text = !isEmpty(data.question_text) ? data.question_text: '';
    data.correct_answer = !isEmpty(data.correct_answer) ? data.correct_answer: '';
    data.question_type = !isEmpty(data.question_type) ? data.question_type: '';
    data.difficulty_level = !isEmpty(data.difficulty_level) ? data.difficulty_level: '';
    
    if(Validator.isEmpty(data.question_text)){
        errors.question_text = 'School title field is required';
    }
    if(Validator.isEmpty(data.correct_answer)){
        errors.correct_answer = 'Degree field is required';
    }
    if(Validator.isEmpty(data.question_type)){
        errors.question_type= 'Field of Study is required';
    }
    if(Validator.isEmpty(data.difficulty_level)){
        errors.difficulty_level = 'From data is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

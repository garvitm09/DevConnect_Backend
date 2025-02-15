const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'  //referring to users collection
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'  //referrig to users collection
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'  //referrig to users collection
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
        
})

module.exports = Post = mongoose.model('post', PostSchema);
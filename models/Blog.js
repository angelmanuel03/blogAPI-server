const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: String,
        required: [true, 'Content is required']
    },
    comments: [
        {
            userId: {
                type: String,
                required: [true, 'User ID is required']
            },
            comment: {
                type: String,
                required: [true, 'Comment is required']
            },
            creationDate: {
                type: Date,
                default: Date.now // Each comment gets a timestamp
            }
        }
    ],
    creationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);
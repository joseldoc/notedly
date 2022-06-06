const mongoose = require('mongoose');
// define Note's database Schema
const noteSchema = new mongoose.Schema({
    content : {
        type: String,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoriteCount: {
        type: Number,
        default: 0
    },
    favoriteBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps : true
});
// define Note Model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
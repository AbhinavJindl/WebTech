const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        index: true,
    },
    data: Schema.Types.Mixed
});

module.exports = mongoose.model('Item', itemSchema);
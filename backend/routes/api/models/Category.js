const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    SN: { type: Number, required: true, unique: true }, 
    Name: { type: String, required: true },
    Description: { type: String, default: "" },
    Creator: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedBy: { type: String, required: true },
    UpdatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

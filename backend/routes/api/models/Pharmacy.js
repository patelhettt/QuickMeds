const mongoose = require('mongoose');

const medicineSchema = mongoose.Schema({
    tradeName: { type: String, required: true },
    genericName: { type: String, required: true },
    strength: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true },
    unitType: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    addedBy: { type: String, required: true, default: "admin" },
    addedToDbAt: { type: Date, required: true, default: Date.now }
});

const Pharmacy = new mongoose.model('pharmacy', medicineSchema);

module.exports = { Pharmacy };

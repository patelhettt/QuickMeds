const mongoose = require('mongoose');

const unitTypeSchema = new mongoose.Schema(
    {
        SN: { type: Number, required: true, unique: true },
        Name: { type: String, required: true },
        Description: { type: String, required: true },
        Creator: { type: String, default: "Admin" },
        CreatedAt: { type: Date, default: Date.now },
        UpdatedBy: { type: String, default: "Admin" },
        UpdatedAt: { type: Date, default: Date.now }
    },
    { collection: 'unitTypes' }
);

module.exports = mongoose.model('UnitType', unitTypeSchema);

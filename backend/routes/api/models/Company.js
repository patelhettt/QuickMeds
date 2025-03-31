const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    SN: { type: Number, required: true, unique: true }, // Serial Number
    Name: { type: String, required: true },
    Phone: { type: String, required: true },
    Website: { type: String, required: true },
    Email: { type: String, required: true },
    Address: { type: String, required: true },
    Creator: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    UpdatedBy: { type: String, required: true },
    UpdatedAt: { type: Date, default: Date.now },
    Actions: { type: String, default: "" } // Placeholder for actions
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;

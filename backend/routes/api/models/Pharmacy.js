const mongoose = require('mongoose');

const medicineSchema =  mongoose.Schema({
  tradeName: { type: String, required: true, default: "Unknown Trade Name" },
  genericName: { type: String, required: true, default: "Unknown Generic Name" },
  strength: { type: String, required: true },
  category: { type: String, required: true, default: "General" },
  company: { type: String, required: true, default: "Unknown Company" },
  stock: { type: Number, required: true, default: 100 },
  packType: { type: String, required: true },
  purchaseUnitType: { type: String, required: true },
  purchasePackSize: { type: Number, required: true },
  packTp: { type: Number, required: true },
  unitTp: { type: Number, required: true },
  purchaseVatPercent: { type: Number, required: true },
  purchaseVatTaka: { type: Number, required: true },
  purchaseDiscountPercent: { type: Number, required: true },
  purchaseDiscountTaka: { type: Number, required: true },
  salesUnitType: { type: String, required: true },
  salePackSize: { type: Number, required: true },
  packMrp: { type: Number, required: true },
  unitMrp: { type: Number, required: true },
  salesVatPercent: { type: Number, required: true },
  salesVatTaka: { type: Number, required: true },
  salesDiscountPercent: { type: Number, required: true },
  salesDiscountTaka: { type: Number, required: true },
  addedBy: { type: String, required: true, default: "admin" },
  addedToDbAt: { type: Date, required: true, default: Date.now }
});

const Pharmacy =new mongoose.model('pharmacy', medicineSchema);

module.exports = {Pharmacy};

const mongoose = require('mongoose');

const nonPharmacySchema = mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true, default: "General" },
  strength: { type: String }, // Optional
  company: { type: String },
  stock: { type: Number, required: true, default: 100 },
  packType: { type: String, required: true },
  packSize: { type: Number, required: true },
  packTp: { type: Number, required: true },
  unitTp: { type: Number, required: true },
  packMrp: { type: Number, required: true },
  unitMrp: { type: Number, required: true },
  
  purchaseUnitType: { type: String, required: true },
  purchaseVatPercent: { type: Number, default: 0 },
  purchaseVatTaka: { type: Number, default: 0 },
  purchaseDiscountPercent: { type: Number, default: 0 },
  purchaseDiscountTaka: { type: Number, default: 0 },
  
  salesUnitType: { type: String, required: true },
  salesVatPercent: { type: Number, default: 0 },
  salesVatTaka: { type: Number, default: 0 },
  salesDiscountPercent: { type: Number, default: 0 },
  salesDiscountTaka: { type: Number, default: 0 },

  addedBy: { type: String, required: true, default: "admin" },
  addedToDbAt: { type: Date, required: true, default: Date.now }
});

const NonPharmacy = mongoose.model('nonpharmacy', nonPharmacySchema);

module.exports = { NonPharmacy };

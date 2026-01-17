const mongoose = require("mongoose");

const storeInventorySchema = new mongoose.Schema({
  store: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: String,
  category: String,
  strength: String,
  quantity: { type: Number},
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StoreInventory", storeInventorySchema);

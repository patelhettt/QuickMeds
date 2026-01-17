const mongoose = require('mongoose');
const { Schema } = mongoose;

const saleSchema = new Schema({
  store: {
    type: String, 
    required: true
  },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 }, 
      total: { type: Number, required: true }
    }
  ],
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  soldBy: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', saleSchema);
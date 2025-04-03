const mongoose = require("mongoose");

const requestItemSchema = new mongoose.Schema({
    user: {
        firstName: String,
        lastName: String,
        email: String,
        city: String,
        store_name: String,
    },
    items: [{
        product: {
            tradeName: String,
            category: String,
            company: String,
            stock: Number,
            packType: String,
            unitMrp: Number,
            packMrp: Number,
            salesVatPercent: Number,
            salesDiscountPercent: Number,
        },
        quantityRequested: Number
    }],
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: "Pending" 
    },
    requestedAt: { 
        type: Date, 
        default: Date.now 
    },
    note: {
        type: String,
        default: ''
    }
});

const RequestItem = mongoose.model("RequestItem", requestItemSchema);
module.exports = RequestItem;

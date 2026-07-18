const mongoose = require('mongoose');

const POItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', default: null },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'Nos' },
    unitPrice: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },              // percentage
    // Filled progressively as goods are received (GRN, spec §11).
    receivedQty: { type: Number, default: 0 },
}, { _id: true });

const PurchaseOrderSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    poNumber: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryVendor', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryDepartment', default: null },
    purchaseRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseRequest', default: null },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryWarehouse', default: null }, // receiving store

    items: [POItemSchema],
    discount: { type: Number, default: 0 },         // flat amount
    subTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },

    deliveryAddress: { type: String, default: '' },
    terms: { type: String, default: '' },
    expectedDelivery: { type: Date, default: null },
    signature: { type: String, default: '' },

    // ordered → partially_received → received → cancelled
    status: {
        type: String,
        enum: ['ordered', 'partially_received', 'received', 'cancelled'],
        default: 'ordered',
    },
    // Invoice details (may be captured via OCR-assisted entry, spec §10).
    invoice: {
        number: { type: String, default: '' },
        date: { type: Date, default: null },
        amount: { type: Number, default: 0 },
        fileUrl: { type: String, default: '' },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receivedAt: { type: Date, default: null },
}, { timestamps: true });

PurchaseOrderSchema.index({ school: 1, createdAt: -1 });
PurchaseOrderSchema.index({ school: 1, poNumber: 1 }, { unique: true });
PurchaseOrderSchema.index({ school: 1, status: 1 });
PurchaseOrderSchema.index({ school: 1, vendor: 1 });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

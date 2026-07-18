const mongoose = require('mongoose');

// Immutable ledger of every stock movement (spec §13). Records are never edited
// or deleted — corrections are new adjustment entries.
const InventoryStockTransactionSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryWarehouse', required: true },

    type: {
        type: String,
        required: true,
        enum: ['purchase', 'issue', 'return', 'transfer_in', 'transfer_out', 'damage', 'repair', 'scrap', 'adjustment', 'audit'],
    },
    // Signed quantity delta applied to warehouse stock (+in / -out).
    quantity: { type: Number, required: true },
    balanceAfter: { type: Number, default: 0 },   // resulting on-hand qty (snapshot)
    unitCost: { type: Number, default: 0 },

    // Optional tracking info captured at movement time.
    batchNumber: { type: String, default: '' },
    serialNumbers: { type: [String], default: [] },
    expiryDate: { type: Date, default: null },

    // Loose back-reference to the source document (PO / Issue / GRN / audit…).
    refType: { type: String, default: '' },
    refId: { type: mongoose.Schema.Types.ObjectId, default: null },

    note: { type: String, default: '' },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

InventoryStockTransactionSchema.index({ school: 1, item: 1, createdAt: -1 });
InventoryStockTransactionSchema.index({ school: 1, warehouse: 1, createdAt: -1 });
InventoryStockTransactionSchema.index({ school: 1, type: 1 });

module.exports = mongoose.model('InventoryStockTransaction', InventoryStockTransactionSchema);

const mongoose = require('mongoose');

const RequestItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', default: null },
    itemName: { type: String, required: true },   // free text allowed for not-yet-created items
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'Nos' },
    estimatedPrice: { type: Number, default: 0 }, // per unit
}, { _id: true });

// One step in the approval matrix (spec §7). Stages are resolved dynamically.
const ApprovalStepSchema = new mongoose.Schema({
    stage: { type: String, required: true },       // e.g. Department Head, Principal, Accounts…
    action: { type: String, enum: ['pending', 'approved', 'rejected', 'changes_requested', 'forwarded', 'hold'], default: 'pending' },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comment: { type: String, default: '' },
    signature: { type: String, default: '' },      // digital sign token / name
    actedAt: { type: Date, default: null },
}, { _id: true });

const PurchaseRequestSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    requestNumber: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryDepartment', default: null },
    reason: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },

    items: [RequestItemSchema],
    estimatedTotal: { type: Number, default: 0 },

    // draft is not used (created submitted); lifecycle:
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'converted', 'fulfilled_from_stock', 'cancelled'],
        default: 'pending',
    },
    approvals: [ApprovalStepSchema],

    // System pre-check results surfaced to approvers (spec §5).
    checks: {
        stockAvailable: { type: Boolean, default: false },
        budgetOk: { type: Boolean, default: true },
        possibleDuplicate: { type: Boolean, default: false },
    },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', default: null },
}, { timestamps: true });

PurchaseRequestSchema.index({ school: 1, createdAt: -1 });
PurchaseRequestSchema.index({ school: 1, requestNumber: 1 }, { unique: true });
PurchaseRequestSchema.index({ school: 1, status: 1 });
PurchaseRequestSchema.index({ school: 1, requestedBy: 1 });

module.exports = mongoose.model('PurchaseRequest', PurchaseRequestSchema);

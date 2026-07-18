const mongoose = require('mongoose');

// Categories & Sub-Categories share one model. A sub-category has `parent` set
// to its owning category; a top-level category has parent = null.
const InventoryCategorySchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    name: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryCategory', default: null },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

InventoryCategorySchema.index({ school: 1, parent: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('InventoryCategory', InventoryCategorySchema);

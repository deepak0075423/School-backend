const mongoose = require('mongoose');

// A warehouse / store. `campus` is a free-text label so multiple campuses can be
// supported without a separate master (matches the spec's Campus A / Campus B).
const InventoryWarehouseSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    name: { type: String, required: true, trim: true },     // Main Store, Sports Store…
    campus: { type: String, default: 'Main Campus', trim: true },
    location: { type: String, default: '' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    capacity: { type: Number, default: 0 },                 // optional, informational
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

InventoryWarehouseSchema.index({ school: 1, campus: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('InventoryWarehouse', InventoryWarehouseSchema);

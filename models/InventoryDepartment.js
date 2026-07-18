const mongoose = require('mongoose');

// A budget-holding department (Science Lab, Sports, Computer…). Budget control
// (spec §6) lives here: annualBudget is the yearly allocation, usedBudget is
// incremented as approved purchase orders consume it.
const InventoryDepartmentSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    name: { type: String, required: true, trim: true },
    financialYear: { type: String, default: '' },          // e.g. "2026-2027"
    annualBudget: { type: Number, default: 0 },
    usedBudget: { type: Number, default: 0 },
    headName: { type: String, default: '' },               // department head (label)
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

InventoryDepartmentSchema.virtual('remainingBudget').get(function () {
    return (this.annualBudget || 0) - (this.usedBudget || 0);
});
InventoryDepartmentSchema.set('toJSON', { virtuals: true });
InventoryDepartmentSchema.set('toObject', { virtuals: true });

InventoryDepartmentSchema.index({ school: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('InventoryDepartment', InventoryDepartmentSchema);

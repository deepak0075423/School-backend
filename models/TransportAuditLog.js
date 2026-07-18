const mongoose = require('mongoose');

// Immutable audit trail for the transport module (spec: Audit Logs, Security).
// Written by the controller helper on every create/update/delete/state change.
const TransportAuditLogSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    role: { type: String, default: '' },

    actionType: { type: String, required: true },            // create / update / delete / start_trip / pay …
    entityType: { type: String, required: true },            // Vehicle / Route / Trip / Invoice …
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    description: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

TransportAuditLogSchema.index({ school: 1, createdAt: -1 });
TransportAuditLogSchema.index({ school: 1, entityType: 1, entityId: 1 });

module.exports = mongoose.model('TransportAuditLog', TransportAuditLogSchema);

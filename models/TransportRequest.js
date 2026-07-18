const mongoose = require('mongoose');

// A parent/student transport request with an approval workflow (spec §20).
// Approving certain types mutates the linked assignment (handled in controller).
const TransportRequestSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },

    requestCode: { type: String, default: '' },              // TRQ-YYMM-####
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },

    requestType: {
        type: String,
        enum: ['new_transport', 'route_change', 'stop_change', 'temporary_address', 'permanent_address', 'cancellation'],
        required: true,
    },
    currentAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportAssignment', default: null },

    // Whatever the request proposes (nulls ignored on apply).
    details: {
        route: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute', default: null },
        pickupStop: { type: mongoose.Schema.Types.ObjectId, default: null },
        dropStop: { type: mongoose.Schema.Types.ObjectId, default: null },
        address: { type: String, default: '' },
        fromDate: { type: Date, default: null },
        toDate: { type: Date, default: null },
        reason: { type: String, default: '' },
    },

    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
}, { timestamps: true });

TransportRequestSchema.index({ school: 1, status: 1, createdAt: -1 });
TransportRequestSchema.index({ school: 1, requestedBy: 1 });

module.exports = mongoose.model('TransportRequest', TransportRequestSchema);

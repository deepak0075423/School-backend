const mongoose = require('mongoose');

// Links a Student to a Route + pickup/drop stops + seat (spec §7 and §8).
// One active assignment per student; suspensions/cancellations keep history.
const TransportAssignmentSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },

    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // User w/ role student
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null }, // denormalised from route

    // Stops reference the embedded StopSchema _id inside the route.
    pickupStop: { type: mongoose.Schema.Types.ObjectId, default: null },
    dropStop: { type: mongoose.Schema.Types.ObjectId, default: null },
    shift: { type: String, enum: ['morning', 'evening', 'both'], default: 'both' },

    seatNumber: { type: String, default: '' },
    feePlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportFeePlan', default: null },

    effectiveDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },

    // Temporary assignment / address override (spec §7, §12).
    isTemporary: { type: Boolean, default: false },
    temporaryAddress: { type: String, default: '' },

    status: { type: String, enum: ['active', 'suspended', 'cancelled'], default: 'active' },
    suspensionReason: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TransportAssignmentSchema.index({ school: 1, student: 1, status: 1 });
TransportAssignmentSchema.index({ school: 1, route: 1, status: 1 });
// A student may only have one active assignment at a time.
TransportAssignmentSchema.index(
    { school: 1, student: 1 },
    { unique: true, partialFilterExpression: { status: 'active' } },
);

module.exports = mongoose.model('TransportAssignment', TransportAssignmentSchema);

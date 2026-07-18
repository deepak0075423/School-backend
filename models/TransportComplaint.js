const mongoose = require('mongoose');

// A single action in a complaint's lifecycle (spec §18 workflow).
const TimelineSchema = new mongoose.Schema({
    action: { type: String, required: true },                // created / assigned / commented / resolved / closed
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    byName: { type: String, default: '' },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
}, { _id: true });

// A transport complaint raised by a parent/student/staff (spec §18).
const TransportComplaintSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },

    complaintCode: { type: String, default: '' },            // CMP-YYMM-####
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    raisedByRole: { type: String, default: '' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    category: {
        type: String,
        enum: ['late_bus', 'driver_behavior', 'bus_condition', 'safety', 'delay', 'lost_item', 'overcrowding', 'other'],
        default: 'other',
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '' },

    route: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute', default: null },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportStaff', default: null },

    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolution: { type: String, default: '' },
    rating: { type: Number, default: null },                 // parent satisfaction after resolution

    attachments: { type: [String], default: [] },
    timeline: [TimelineSchema],
}, { timestamps: true });

TransportComplaintSchema.index({ school: 1, status: 1, createdAt: -1 });
TransportComplaintSchema.index({ school: 1, raisedBy: 1 });

module.exports = mongoose.model('TransportComplaint', TransportComplaintSchema);

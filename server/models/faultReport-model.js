const mongoose = require('mongoose');

// Define the schema for fault reports
const faultReportSchema = new mongoose.Schema({
    resourceName: {
        type: String,
        required: true,
    },
    faultDescription: {
        type: String,
        required: true,
    },
    reportedBy: {
        type: String, // Faculty name
        required: true,
    },
    reportedAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date when reported
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending', // Fault status
    },
    resolutionDetails: {
        resolvedBy: { type: String }, // Admin or technical staff who resolves the issue
        resolvedAt: { type: Date },
        remarks: { type: String } // Optional remarks when resolving the fault
    }
});

module.exports = mongoose.model('FaultReport', faultReportSchema);

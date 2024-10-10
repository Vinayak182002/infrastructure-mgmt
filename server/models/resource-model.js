// models/Resource.js

const mongoose = require('mongoose');

// Define the schema for resources
const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Classroom', 'Lab', 'Hall'],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    weeklySchedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true,
        },
        slots: [{
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            subject: { type: String, default: "" },
            yearOfStudents: { type: String, default: "" },
            divisionOfStudents: { type: String, default: "" },
            batchOfStudents: { type: String, default: "" }, // Only needed for labs
            branchOfStudents: { type: String, default: "" },
            facultyName: { type: String, default: "" }, // To be filled by admin during booking
            isBooked: { type: Boolean, default: false },
            bookedByAdmin: { type: Boolean, default: false },
        }],
    }],
});

// Export the model
module.exports = mongoose.model('Resource', resourceSchema);

const {z} = require("zod");

// creatign an object schema for registration form
const registerSchema = z.object({
    name : z
    .string({required_error:"Name should be entered!"})
    .trim()
    .min(4,{message:"Name should be ateast 4 characters long"})
    .max(255,{message:"Name should not exceed 255 characters"}),

    email : z
    .string({required_error:"Email should be entered!"})
    .trim()
    .email({ message: "Invalid email format! Please include '@' and a domain." })
    .min(4,{message:"Email should be ateast 4 characters long"})
    .max(255,{message:"Email should not exceed 255 characters"}),

    password : z
    .string({required_error:"Password should be entered!"})
    .trim()
    .min(4,{message:"Password should be ateast 4 characters long"})
    .max(255,{message:"Password should not exceed 255 characters"}),
});

// / creatign an object schema
const loginSchema = z.object({
    email : z
    .string({required_error:"Email should be entered!"})
    .trim()
    .email({ message: "Invalid email format! Please include '@' and a domain." })  // Adding email format validation
    .min(4,{message:"Email should be ateast 4 characters long"})
    .max(255,{message:"Email should not exceed 255 characters"}),

    password : z
    .string({required_error:"Password should be entered!"})
    .trim()
    .min(4,{message:"Password should be ateast 4 characters long"})
    .max(255,{message:"Password should not exceed 255 characters"}),
});

// creatign resource zod schema
const createResourceSchema = z.object({
    name: z.string({required_error:"Name is required"}),
    type: z.enum(['Classroom', 'Lab', 'Hall'], { message: "Type must be one of Classroom, Lab, or Hall" }),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    weeklySchedule: z.array(
        z.object({
            day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], { message: "Day must be one of Monday, Tuesday, Wednesday, Thursday, Friday, or Saturday" }),
            slots: z.array(
                z.object({
                    startTime: z.string({required_error:"Start Time is required"}),
                    endTime: z.string({required_error:"End Time is required"}),
                    subject: z.string().optional(),
                    yearOfStudents: z.string().optional(),
                    divisionOfStudents: z.string().optional(),
                    batchOfStudents: z.string().optional(), // Only needed for labs
                    branchOfStudents: z.string().optional(),
                    facultyName: z.string().optional(),
                    isBooked: z.boolean().optional(),
                    bookedByAdmin: z.boolean().optional(),
                })
            )
        })
    ).nonempty("Weekly schedule must contain at least one entry"),
});


// slot booking zod schema
const bookingSchema = z.object({
    resourceName: z.string().min(1, "Resource name is required."),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], {
        required_error: "Day is required."
    }),
    startTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format."),
    subject: z.string().min(1, "Subject name is required."),
    yearOfStudents: z.string().min(1, "Year of Students is required."),
    divisionOfStudents: z.string().min(1, "Division of Students is required."),
    batchOfStudents: z.string().optional().default(""),
    branchOfStudents: z.string().min(1, "Branch of Students is required."),
    facultyName: z.string().min(1, "Faculty Name is required."),
});

// report fault schema
const faultReportSchema = z.object({
    resourceName: z.string().min(1, "Resource name is required."),
    faultDescription: z.string().min(1, "Fault Description is required."),
    reportedBy: z.string().min(1, "Faculty name is required."),
    reportedAt: z.date().optional(), // This field is handled by Mongoose; can be omitted from the client input
    status: z.enum(['Pending', 'In Progress', 'Resolved']).optional().default('Pending'), // Defaults to 'Pending'
    resolutionDetails: z.object({
        resolvedBy: z.string().optional(),
        resolvedAt: z.date().optional(),
        remarks: z.string().optional()
    }).optional(), // Resolution details can be optional
});

//slot free zod schema
const freeSlotSchema = z.object({
    resourceName: z.string().min(1, "Resource name is required."),
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format.")
});
// =======
module.exports = {registerSchema , loginSchema, createResourceSchema, bookingSchema, freeSlotSchema, faultReportSchema};
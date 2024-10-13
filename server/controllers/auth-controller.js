const facUser = require("../models/facUser-model");
const Resource = require("../models/resource-model");
const FaultReport = require("../models/faultReport-model");
const adminUser = require("../models/adminUser-model");

//here in this we have the user logged in data as well as the resource details after resourceName is entered
const home = async (req, res) => {
  try {
    // Get user details from the request (assuming the user is added to req.user by your authentication middleware)
    const user = req.user;
    // console.log(user);

    // Get resource name from request parameters or body
    const resourceName = req.params.resourceName || req.body.resourceName;
    console.log(resourceName);
    // Fetch the resource details from the database
    const resource = await Resource.findOne({ name: resourceName });

    // Check if the resource exists
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Prepare the response
    const response = {
      userDetails: {
        id: user._id,
        name: user.name,
        email: user.email,
        // Add any other user details you want to include
      },
      resourceDetails: resource,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
//home controller logic end

// register controller logic
const register = async (req, res) => {
  try {
    // res.status(200).send("this is register controller");
    // console.log(req.body);
    const { name, email, password } = req.body;
    const facUserExist = await facUser.findOne({ email });
    if (facUserExist) {
      res
        .status(400)
        .json({ message: "the faculty user with this email already exists" });
    }
    const facUserCreated = await facUser.create({ name, email, password });
    // console.log(facUserCreated);
    res.status(200).json({
      message: "registration done successfully!",
      token: await facUserCreated.generateToken(),
      userId: facUserCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
    // res.send(400).json({ message: "error in registration!" });
  }
};

// user login logic start
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(password1);
    const facUserExist = await facUser.findOne({ email });

    if (!facUserExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await facUserExist.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await facUserExist.generateToken(),
        userId: facUserExist._id.toString(),
      });
    } else {
      res.status(400).json({ message: "Invalid email or passord " });
    }
  } catch (error) {
    res.status(400).json({ message: "error in login!" });
  }
};
// user login logic end

// getting user data
const user = (req, res) => {
  try {
    const userData = req.user;
    // console.log(userData);
    return res.status(200).json({ userData });
  } catch (error) {
    console.log("Error while getting user data through JWT", error);
  }
};

const loginCheck = (req, res) => {
  res.send({ data: "Already Login" });
};

const adminLoginCheck = (req, res) => {
  res.send({ data: "Already Login" });
};

// Function to get resource by name
const getResourceByName = async (req, res) => {
  try {
    // Get resource name from request parameters or body
    const resourceName = req.params.resourceName || req.body.resourceName;
    // console.log(resourceName);
    // Fetch the resource details from the database
    const resource = await Resource.findOne({ name: resourceName });

    // Check if the resource exists
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Prepare the response
    const response = {
      resourceDetails: resource,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all resources
const getResources = async (req, res) => {
  try {
    // Fetch the resource details from the database
    const resource = await Resource.find();

    // Check if the resource exists
    if (!resource) {
      return res.status(404).json({ message: "Resources not found" });
    }

    // Prepare the response
    const response = {
      resourceDetails: resource,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all classroom resources
const getClassroomResource = async (req, res) => {
  try {
    const classrooms = await Resource.find({ type: "Classroom" });
    if (!classrooms) {
      return res.status(404).json({ message: "Classrooms not found" });
    }

    const response = {
      classroomDetails: classrooms,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all labs resources
const getLabResource = async (req, res) => {
  try {
    const classrooms = await Resource.find({ type: "Lab" });
    if (!classrooms) {
      return res.status(404).json({ message: "Labs not found" });
    }

    const response = {
      labDetails: classrooms,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get all hall resources
const getHallResource = async (req, res) => {
  try {
    const classrooms = await Resource.find({ type: "Hall" });
    if (!classrooms) {
      return res.status(404).json({ message: "Halls not found" });
    }

    const response = {
      hallDetails: classrooms,
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Creating resource controller start
// Create a new resource
const createResource = async (req, res) => {
  try {
    const { name, type, capacity, weeklySchedule } = req.body;

    // Validate the incoming data
    if (!name || !type || !capacity || !weeklySchedule) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if a resource with the same name already exists
    const existingResource = await Resource.findOne({ name });
    if (existingResource) {
      return res
        .status(400)
        .json({ message: "Resource with this name already exists!" });
    }

    // Create the resource
    const newResource = await Resource.create({
      name,
      type,
      capacity,
      weeklySchedule,
    });

    return res.status(200).json({
      message: "Resource created successfully!",
      resource: newResource,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Server error while creating resource." });
  }
};

// Creating resource controller end

// updating the resource controller start

const updateResource = async (req, res) => {
  try {
    const resourceName = req.params.resourceName || req.body.resourceName;

    const resource = await Resource.findOne({ name: resourceName });

    // Check if the resource exists
    if (!resource) {
      return res.status(400).json({ message: "Resource not found" });
    }
    const { name, type, capacity, weeklySchedule } = req.body;
    if (name === resource.name) {
      resource.name = resourceName;
      resource.type = type;
      resource.capacity = capacity;
      resource.weeklySchedule = weeklySchedule;

      await resource.save();
      return res.status(200).json({
        message: "Resource updated successfully!",
        resource: resource,
      });
    } else {
      return res
        .status(400)
        .json({ message: "You are updating wron resource" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Server error while updating resource." });
  }
};

// updating the resource controller end

// Slot Booking controller start
const bookSlot = async (req, res) => {
  // console.log(req.body)
  const {
    resourceName,
    day,
    startTime,
    subject,
    yearOfStudents,
    divisionOfStudents,
    batchOfStudents,
    branchOfStudents,
    facultyName,
  } = req.body;
  try {
    // Find the resource by name
    // console.log(startTime);
    const resource = await Resource.findOne({ name: resourceName });
    // console.log(resource);
    if (!resource) {
      return res.status(400).json({ message: "Resource not found." });
    }

    // Find the specific day's slots
    const daySchedule = resource.weeklySchedule.find(
      (schedule) => schedule.day === day
    );
    // console.log(daySchedule);

    if (!daySchedule) {
      return res.status(400).json({ message: "Day schedule not found." });
    }

    // Find the slot to book
    const slotToBook = daySchedule.slots.find(
      (slot) =>
        slot.startTime === startTime && !slot.isBooked && !slot.bookedByAdmin
    );
    // console.log(slotToBook);

    if (!slotToBook) {
      return res.status(400).json({
        message: "Slot is either not available or already booked by an admin.",
      });
    }

    // Update the slot with faculty details
    // console.log(facultyName);
    slotToBook.isBooked = true;

    if (facultyName) slotToBook.facultyName = facultyName; // Only update if facultyName is provided

    if (subject) slotToBook.subject = subject; // Update only if subject is provided
    if (yearOfStudents) slotToBook.yearOfStudents = yearOfStudents;
    if (divisionOfStudents) slotToBook.divisionOfStudents = divisionOfStudents;
    if (batchOfStudents) slotToBook.batchOfStudents = batchOfStudents;
    if (branchOfStudents) slotToBook.branchOfStudents = branchOfStudents;

    // console.log(slotToBook);

    // Save the updated resource
    await resource.save();

    // =====================
    // Automatically unbook the slot after it has passed
    // Calculate when the slot should be freed
    // const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    // const dayIndex = getDayIndex(day); // Helper function to map day names to day index

    // const daysUntilSlot = (dayIndex + 7 - currentDay) % 7;
    // const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + daysUntilSlot); // Move to the correct day of the week
    // const [hour, minute] = startTime.split(':').map(Number);
    // currentDate.setHours(hour, minute, 0, 0); // Set time of the booked slot

    // const slotDuration = 1 * 60 * 1000; // 1 hour in milliseconds (you can adjust)
    // const timeoutDuration = currentDate.getTime() - Date.now() + slotDuration;
    // console.log(timeoutDuration);
    // if (timeoutDuration > 0) {
    //   setTimeout(async () => {
    //     // Free the slot after the slot's end time
    //     const updatedResource = await Resource.findOne({ name: resourceName });
    //     const updatedDaySchedule = updatedResource.weeklySchedule.find(
    //       (schedule) => schedule.day === day
    //     );
    //     const updatedSlot = updatedDaySchedule.slots.find(
    //       (slot) => slot.startTime === startTime
    //     );

    //     if (updatedSlot && updatedSlot.isBooked) {
    //       updatedSlot.isBooked = false;
    //       updatedSlot.facultyName = "";
    //       updatedSlot.subject = "";
    //       updatedSlot.yearOfStudents = "";
    //       updatedSlot.divisionOfStudents = "";
    //       updatedSlot.batchOfStudents = "";
    //       updatedSlot.branchOfStudents = "";
    //       await updatedResource.save();
    //       console.log("Slot automatically freed after use.");
    //     }
    //   }, timeoutDuration);
    // }
    // ========================
    return res
      .status(200)
      .json({ message: "Slot booked successfully!", resource });
  } catch (error) {
    // console.error(error);
    return res
      .status(400)
      .json({ message: "Server error while booking slot." });
  }
};
// Slot Booking controller end

// Slot free controller start
// will be accessed only by the admin
const lookForFreeSlot = async (req, res) => {
  try {
    const { day, startTime} = req.body;
    // Find the resource by name
    const resources = await Resource.find({
      weeklySchedule: {
        $elemMatch: {
          day: day, // Match the desired day
          slots: {
            $elemMatch: {
              startTime: startTime, // Match the specific startTime
              isBooked: false,  // Ensure slot is not booked
            }
          }
        }
      }
    });

    console.log(resources);
    if (!resources) {
      return res
        .status(404)
        .json({ message: "Free Resource with this slot not found." });
    }

    return res
      .status(200)
      .json({ message: "Slots found successfully.", resources});
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Server error while freeing slot." });
  }
};

// Slot free controller end

// Calculation utilization percentage of a resource controller start
const calculateUtilization = async (req, res) => {
  try {
    const { resourceName } = req.params;

    // Find the resource by name
    const resource = await Resource.findOne({ name: resourceName });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    let totalSlots = 0;
    let bookedSlots = 0;

    // Loop through each day in the weekly schedule
    resource.weeklySchedule.forEach((daySchedule) => {
      // Total slots in this day
      const dayTotalSlots = daySchedule.slots.length;
      totalSlots += dayTotalSlots;

      // Count the booked slots
      const dayBookedSlots = daySchedule.slots.filter(
        (slot) => slot.isBooked
      ).length;
      bookedSlots += dayBookedSlots;
    });

    // Calculate the utilization percentage
    const utilizationPercentage = (bookedSlots / totalSlots) * 100;

    return res.status(200).json({
      resourceName: resourceName,
      totalSlots: totalSlots,
      bookedSlots: bookedSlots,
      utilizationPercentage: utilizationPercentage.toFixed(2) + "%",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while calculating utilization." });
  }
};
// Calculation utilization percentage of a resource controller end

// fault report controller start
const reportResourceFault = async (req, res) => {
  try {
    const { resourceName, faultDescription } = req.body;
    const facultyName = req.user.name; // Assuming the faculty name is available from the logged-in user's details

    // Check if the resource exists
    const resource = await Resource.findOne({ name: resourceName });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Create a new fault report
    const faultReport = new FaultReport({
      resourceName,
      faultDescription,
      reportedBy: facultyName,
      reportedAt: new Date(),
    });

    // Save the fault report
    await faultReport.save();

    return res.status(200).json({
      message: "Fault reported successfully!",
      faultReport,
    });
  } catch (error) {
    // console.error(error);
    return res
      .status(400)
      .json({ message: "Server error while reporting fault." });
  }
};
// fault report controller end

// see all the faultReports submitted by particular faculty
const getResourceFaultForFaculty = async (req, res) => {
  try {
    const facultyName = req.user.name;

    const faultReports = await FaultReport.find({ reportedBy: facultyName });

    return res.status(200).json({
      faultReports,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Server error while reporting fault." });
  }
};

// getting admin data
const admin = (req, res) => {
  try {
    const adminData = req.user;
    return res.status(200).json({ adminData });
  } catch (error) {
    console.log("Error while getting admin data through JWT", error);
  }
};

//fault report update cotroller start
const updateResourceFault = async (req, res) => {
  try {
    const { faultId, resolvedBy, remarks } = req.body;

    // Find the fault report by ID
    // console.log(faultId);
    const faultReport = await FaultReport.findById(faultId);

    if (!faultReport) {
      return res.status(404).json({ message: "Fault report not found." });
    }

    // Update fault status and resolution details
    const status = faultReport.status;

    if (status === "Pending") {
      (faultReport.status = "Resolved"),
        (faultReport.resolutionDetails = {
          resolvedBy,
          resolvedAt: new Date(),
          remarks,
        });
    }

    // Save the updated fault report
    await faultReport.save();

    return res.status(200).json({
      message: "Fault status updated successfully!",
      faultReport,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while updating fault status." });
  }
};

//fault report update cotroller end

// get all resource faults
//fault report update cotroller start
const getResourceFaults = async (req, res) => {
  try {
    const faultReportsPending = await FaultReport.find({ status: "Pending" });
    const faultReportsResolved = await FaultReport.find({ status: "Resolved" });

    if (!faultReportsPending && !faultReportsResolved) {
      return res.status(400).json({ message: "Fault reports not found." });
    }
    return res.status(200).json({
      message: "Fault reports retreived successfully!",
      faultReportsPending,
      faultReportsResolved,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error while updating fault status." });
  }
};

// admin register controller logic
const adminRegister = async (req, res) => {
  try {
    // res.status(200).send("this is register controller");
    // console.log(req.body);
    const { name, email, password } = req.body;
    const adminUserExist = await adminUser.findOne({ email });
    if (adminUserExist) {
      res
        .status(400)
        .json({ message: "the admin user with this email already exists" });
    }
    const adminUserCreated = await adminUser.create({ name, email, password });
    // console.log(adminUserCreated);
    res.status(200).json({
      message: "registration done successfully!",
      token: await adminUserCreated.generateToken(),
      userId: adminUserCreated._id.toString(),
    });
  } catch (error) {
    console.log(error);
    // res.send(400).json({ message: "error in registration!" });
  }
};

// admin user login logic start
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(password1);
    const adminUserExist = await adminUser.findOne({ email });

    if (!adminUserExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await adminUserExist.comparePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await adminUserExist.generateToken(),
        userId: adminUserExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or passord " });
    }
  } catch (error) {
    res.status(400).json({ message: "error in login!" });
  }
};
// user login logic end

module.exports = {
  home,
  register,
  login,
  user,
  createResource,
  bookSlot,
  lookForFreeSlot,
  calculateUtilization,
  reportResourceFault,
  updateResourceFault,
  adminLogin,
  adminRegister,
  loginCheck,
  getResourceByName,
  getClassroomResource,
  getLabResource,
  getHallResource,
  getResources,
  getResourceFaultForFaculty,
  admin,
  adminLoginCheck,
  updateResource,
  getResourceFaults,
};

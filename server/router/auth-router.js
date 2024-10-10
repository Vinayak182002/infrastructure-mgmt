const express = require("express"); 
const router = express.Router(); 
const authControllers = require("../controllers/auth-controller")
const validate = require("../middlewares/auth-middleware");
const zodSchema = require("../validators/auth-validator");
const {authenticate,authenticateAdmin}  = require("../middlewares/user-auth-middleware");
// const authMiddleware = require("../middlewares/user-auth-middleware");

router.route("/user").get(authenticate, authControllers.user);
router.route("/home/:resourceName").post(authenticate,authControllers.home);
router.route("/register").post(validate(zodSchema.registerSchema),authControllers.register);
router.route("/login").post(validate(zodSchema.loginSchema),authControllers.login);
router.route("/create-resource").post(validate(zodSchema.createResourceSchema),authControllers.createResource);
router.route("/book-slot").post(validate(zodSchema.bookingSchema),authControllers.bookSlot);
router.route("/login-check").post(authenticate,authControllers.loginCheck);
router.route("/get-resource/:resourceName").get(authControllers.getResourceByName);
router.route("/get-all-resources").get(authControllers.getResources);
router.route("/get-classrooms").get(authControllers.getClassroomResource);
router.route("/get-labs").get(authControllers.getLabResource);
router.route("/get-halls").get(authControllers.getHallResource);


// accessed by only admin
router.route("/free-slot").post(validate(zodSchema.freeSlotSchema), authenticateAdmin ,authControllers.freeSlot);



router.route("/calc-utilization-resource/:resourceName").get(authControllers.calculateUtilization);

router.route("/submit-fault-report").post(authenticate,authControllers.reportResourceFault);
router.route("/update-fault-report").post(authControllers.updateResourceFault);

router.route("/admin-1987/register").post(validate(zodSchema.registerSchema),authControllers.adminRegister);
router.route("/admin-1987/login").post(validate(zodSchema.loginSchema),authControllers.adminLogin);


module.exports = router;    
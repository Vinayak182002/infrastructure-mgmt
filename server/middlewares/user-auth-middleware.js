const jwt = require("jsonwebtoken");
const FacUser = require("../models/facUser-model");
const adminUser = require("../models/adminUser-model");

const authenticate = async (req, res, next) => { 
  let token = null;
// Accessing the token from the request headers
if (req.headers && req.headers.authorization) {
  token = req.headers.authorization;  
}
  if (!token) {
    // If you attempt to use an expired token, you'll receive a "401 Unauthorized HTTP" response.
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  // Assuming token is in the format "Bearer <jwtToken>, Removing the "Bearer" prefix"
  const jwtToken = token.replace("Bearer", "").trim();
//   console.log(jwtToken);

  try {
    // Verifying the token
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // console.log(isVerified);

    // getting the complete user details & also we don't want password to be sent
    const userData = await FacUser.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.token = token;
    req.user = userData;
    req.userID = userData._id;

    // Move on to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};


const authenticateAdmin = async (req, res, next) => {
  let token = null;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization;  
  }
  if (!token) {
    // If you attempt to use an expired token, you'll receive a "401 Unauthorized HTTP" response.
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  // Assuming token is in the format "Bearer <jwtToken>, Removing the "Bearer" prefix"
  const jwtToken = token.replace("Bearer", "").trim();
//   console.log(jwtToken);

  try {
    // Verifying the token
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // console.log(isVerified);

    // getting the complete user details & also we don't want password to be sent
    const userAdminData = await adminUser.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.token = token;
    req.user = userAdminData;
    req.userID = userAdminData._id;

    // Move on to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = {authenticate, authenticateAdmin};
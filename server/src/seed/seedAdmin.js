import User from "../models/user.js";

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@rapphim.com" });
    if (!existingAdmin) {
      await User.create({
        fullName: "Super Admin",
        email: "admin@gmail.com",
        password: "123456", 
        phone: "0123456789",
        role: "superadmin"
      });
      console.log("Superadmin created ✅");
    } else {
      console.log("Superadmin already exists ✅");
    }
  } catch (error) {
    console.error("Seed admin error:", error.message);
  }
};

export default seedAdmin;

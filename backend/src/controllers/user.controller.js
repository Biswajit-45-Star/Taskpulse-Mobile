export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "Name or email is required to update",
      });
    }

    const user = req.user;

    if (email && email.toLowerCase() !== user.email) {
      const UserModel = (await import("../models/User.js")).default;
      const existing = await UserModel.findOne({ email: email.toLowerCase() });

      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }

      user.email = email.toLowerCase();
    }

    if (name) user.name = name;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
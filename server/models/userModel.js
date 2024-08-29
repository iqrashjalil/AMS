import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["Name is Reuired", true],
  },
  email: {
    type: String,
    required: ["Email is Reuired", true],
  },
  profilePicture: {
    type: String,
  },
  password: {
    type: String,
    required: ["Password is Reuired", true],
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "admin",
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(user.password, saltRound);
    user.password = hashed_password;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);

export default User;

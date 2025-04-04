import { User } from "./modal.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";


export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password} = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = Jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res.status(201).json({
    message: "User created successfully",
    user,
    token,
  });
});

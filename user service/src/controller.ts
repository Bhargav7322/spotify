import { AuthenticatedRequest } from "./middleware.js";
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


export const loginUser= TryCatch(async (req, res) => {
  const { email, password } = req.body;
const user = await User.findOne({ email });
if(!user){
  res.status(404).json({
    message:"User not Exists"
  })
  return
}

const isMATCH = await bcrypt.compare(password, user.password);

if(!isMATCH){
  res.status(400).json({
    message:"Invalid Password"
  })
  return
}
const token = Jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
  expiresIn: "7d",
});

res.status(201).json({
  message: "Loged In successfully",
  user,
  token,
});
})

export const myProfil = TryCatch(async(req:AuthenticatedRequest,res)=>{
  const user = req.user
  res.json(user)
})
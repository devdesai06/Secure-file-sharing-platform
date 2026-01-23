import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
   type: Date,
  },
});


export const User = mongoose.model("UserModel", UserModel);

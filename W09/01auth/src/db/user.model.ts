import bcrypt from "bcryptjs"
import mongoose from "mongoose";
import { UserRole, type UserType } from "@/utils/types"

export const userSchema = new mongoose.Schema<UserType>({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.user,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, {
  timestamps: true,
});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await bcrypt.hash(this.password, 10)
    this.password = hashed
    next()
  }
})


const User = mongoose.model("User", userSchema);

export default User;

import crypto from "crypto";
import { Schema, model, Document } from "mongoose";
import {
  bcryptCompareData,
  bcryptEncryption,
  cryptoEncryption,
} from "../utils/encryptionHandler.utils.js";

export interface UserType {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  isVerified?: boolean;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  passwordChangedAt?: Date;
  role?: "admin" | "member" | "user";
}

export interface UserDocument extends UserType, Document {
  matchHashPassword: (candidatePassword: string) => Promise<boolean>;
  generatePasswordResetToken: () => string;
  hasPasswordChangedAfterJwtIssued: () => boolean;
}
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },

    email: {
      type: String,
      unique: true,
      required: [true, "A user must have an email"],
    },

    password: {
      type: String,
      required: [true, "A user must have a password"],
      // this remove password from the query but return password when we are creating a new document
      select: false,
    },
    isVerified: { type: Boolean, default: false }, // Add the `isVerified` field
    profilePic: String,
    role: {
      type: String,
      enum: ["admin", "member", "member"],
      default: "member",
    },
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordResetExpiry: Date,
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        if (!ret.passwordResetToken) delete ret.passwordResetToken;
        if (!ret.passwordResetExpiry) delete ret.passwordResetExpiry;
      },
    },
    toObject: {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        if (!ret.passwordResetToken) delete ret.passwordResetToken;
        if (!ret.passwordResetExpiry) delete ret.passwordResetExpiry;
      },
    },
  }
);

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password") || this.isNew) {
    return;
  }
  // this.passwordResetToken = undefined;
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// save middleware run when a new document is create or updated
// When does it not trigger? The pre('save') hook does not trigger when you directly modify documents using update() or updateOne(), updateMany(), findOneAndUpdate(), etc. These methods perform updates without calling the save() method.
// If you want to trigger the middleware for updates as well, you can use pre('findOneAndUpdate') or pre('updateOne') hooks.
userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) {
    return;
  }
  // const password = await bcrypt.hash(this.password, 12);
  const password = await bcryptEncryption(12, this.password);
  this.password = password;

  next();
});

userSchema.methods.matchHashPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // const hashMatched = await bcrypt.compare(candidatePassword, this.password);
  const hashMatched = await bcryptCompareData(candidatePassword, this.password);
  return hashMatched;
};

userSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  // const encryptedToken = crypto
  //   .createHash("sha512")
  //   .update(token)
  //   .digest("hex");
  const encryptedToken = cryptoEncryption("sha512", token);
  console.log(token, encryptedToken, token === encryptedToken);
  this.passwordResetToken = encryptedToken;
  // we will set the expire time to 10 min
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;

  return token;
};
userSchema.methods.hasPasswordChangedAfterJwtIssued = function (
  jwtTimeStamp: number
): boolean {
  if (this.passwordChangedAt) {
    const passwordChangedAtInSecs = this.passwordChangedAt.getTime() / 1000;

    return passwordChangedAtInSecs > jwtTimeStamp;
  }
  return false;
};
export const User = model<UserDocument>("User", userSchema);

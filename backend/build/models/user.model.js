import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new Schema({
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
    passwordResetToken: {
        type: String,
    },
    passwordResetExpiry: String,
}, {
    toJSON: {
        transform(_, ret) {
            delete ret.password;
            delete ret.__v;
            if (!ret.passwordResetToken)
                delete ret.passwordResetToken;
            if (!ret.passwordResetExpiry)
                delete ret.passwordResetExpiry;
        },
    },
    toObject: {
        transform(_, ret) {
            delete ret.password;
            delete ret.__v;
            if (!ret.passwordResetToken)
                delete ret.passwordResetToken;
            if (!ret.passwordResetExpiry)
                delete ret.passwordResetExpiry;
        },
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isNew) {
        return;
    }
    this.passwordResetToken = undefined;
    next();
});
// save middleware run when a new document is create or updated
// When does it not trigger? The pre('save') hook does not trigger when you directly modify documents using update() or updateOne(), updateMany(), findOneAndUpdate(), etc. These methods perform updates without calling the save() method.
// If you want to trigger the middleware for updates as well, you can use pre('findOneAndUpdate') or pre('updateOne') hooks.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return;
    }
    const password = await bcrypt.hash(this.password, 12);
    this.password = password;
    next();
});
userSchema.methods.matchHashPassword = async function (candidatePassword) {
    const hashMatched = await bcrypt.compare(candidatePassword, this.password);
    return hashMatched;
};
export const User = model("User", userSchema);

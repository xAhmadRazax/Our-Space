import { User, UserType, UserDocument } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { Email } from "../utils/Email.js";
import { Blacklist } from "../models/blacklist.model.js";
import { cryptoEncryption } from "../utils/encryptionHandler.utils.js";
export const signup = async (userData: UserType): Promise<UserDocument> => {
  return await User.create(userData);
};
export const login = async (
  email: string,
  password: string
): Promise<UserDocument> => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }
  const hashMatched = await user.matchHashPassword(password);
  if (!hashMatched) {
    throw new AppError("Invalid Credentials", 400);
  }

  return user;
};

export const forgotPassword = async (
  email: string,
  baseUrl: string
): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const token = user.generatePasswordResetToken();

  // user.passwordResetToken = token;
  await user.save();

  const emailGenerator = new Email(user, `${baseUrl}/resetPassword/${token}`);
  emailGenerator.sendPasswordReset("Our Space");
};

export const resetPassword = async (token: string, password: string) => {
  // const encryptedToken = crypto
  //   .createHash("sha512")
  //   .update(token)
  //   .digest("hex");
  const encryptedToken = cryptoEncryption("sha512", token);

  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordResetExpiry: { $gte: Date.now() },
  }).select("password");

  console.log(user);
  if (!user) {
    throw new AppError("Reset token is invalid or has expired", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();
};

export const getMe = async (id: string) => {
  const user = await User.findById(id);
  if (!user || user?.hasPasswordChangedAfterJwtIssued()) {
    throw new AppError("Unauthorized Access", 401);
  }

  return user;
};

export const logout = async (token: string) => {
  await Blacklist.create({ token });
};

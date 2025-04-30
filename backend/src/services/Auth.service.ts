import { User, UserType, UserDocument } from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
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

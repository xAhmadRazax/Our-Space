import { Request } from "express";
import { UserType } from "../models/user.model.js";

export interface UserRequest extends Request {
  user?: UserType;
}

import { Schema, model, Document } from "mongoose";
import { cryptoEncryption } from "../utils/encryptionHandler.utils.js";

export interface BlackListType {
  token: string;
  expiredAt: Date;
}

export interface blackListDocumentType extends BlackListType, Document {}

const blacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
    default: new Date(Date.now() + +process.env.JWT_EXPIRES_IN_MS),
    // default: new Date(Date.now() + 3 * 60 * 1000),
  },
});

// this will cause TTL (time-to-live) monitor run every seconds and checks if a document needs to be
// deleted so  there might be some delays
blacklistSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

blacklistSchema.pre("save", function (next) {
  // const hashToken = crypto
  //   .createHash("sha512")
  //   .update(this.token)
  //   .digest("hex");
  const hashToken = cryptoEncryption("sha512", this.token);

  this.token = hashToken;
  next();
});

export const Blacklist = model<blackListDocumentType>(
  "Blacklist",
  blacklistSchema
);

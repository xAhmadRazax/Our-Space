import mongoose from "mongoose";

export const connectDB = async (url: string): Promise<void> => {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("invalid database url");
    }

    await mongoose.connect(url);

    console.log("connected to database");
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("something went wrong");
  }
};

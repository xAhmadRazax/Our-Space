import { env } from "./utils/env.js";

import { app } from "./app.js";
import { connectDB } from "./db/db.connect.js";

const startServer = async () => {
  try {
    const port = env.PORT || 3000;

    // connecting to database
    const dbURL = process.env.DATABASE_URL.replace(
      "<db_password>",
      process.env.DATABASE_PASSWORD
    );

    await connectDB(dbURL);

    app.listen(port, () => {
      console.log(`server is running ${port}`);
    });
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
    else console.log(error);
  }
};

startServer();
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception 🔥 shutting down ....");
  console.log(err.name, err.message);

  process.exit(1);
});

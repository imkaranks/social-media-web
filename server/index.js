import { config } from "dotenv";
config();

import { server } from "./socket/socket.js";
import connect from "./db/connect.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();

    server.on("error", (error) => {
      console.error(`Server error: ${error.message}`);
      throw error;
    });

    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Server connection failed: ${error}`);
    process.exit(0);
  }
})();

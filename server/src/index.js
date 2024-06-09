import { config } from "dotenv";
import { server } from "./socket/socket.js";
import connect from "./db/connect.js";

config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connect();

    server.on("error", (error) => {
      console.log(error);
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

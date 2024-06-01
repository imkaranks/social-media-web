import app from "./app.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 3000;

(() => {
  try {
    app.on("error", (error) => {
      console.log(error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Server connection failed: ${error}`);
    process.exit(0);
  }
})();

import { defineStudioCMSConfig } from "studiocms/config";
import { screeningsPlugin } from "./src/studiocms/screenings/index.ts";

export default defineStudioCMSConfig({
  // Serves the first-run setup wizard at /start. Set to false once the initial
  // owner account has been created.
  dbStartPage: true,
  db: { dialect: "libsql" },
  plugins: [screeningsPlugin()],
});

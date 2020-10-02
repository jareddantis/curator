/* eslint-disable no-console */
// @ts-ignore
import { Workbox } from "workbox-window";

if (process.env.NODE_ENV === "production") {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${process.env.BASE_URL}service-worker.js`);

    wb.addEventListener("installed", () => {
      console.log("[sw] Installed service worker");
    });

    wb.addEventListener("waiting", () => {
      // @ts-ignore
      wb.messageSW({
        type: "SKIP_WAITING"
      }).then(() => console.log("[sw] Told new worker to skip waiting"));
    });

    wb.addEventListener("controlling", () => {
      window.location.reload();
    });

    wb.register().then(() => console.log("[sw] Registered service worker"));
  }
}

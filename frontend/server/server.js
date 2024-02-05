require("dotenv").config();
const Express = require("express");
const HTTPS = require("https");
const fs = require("fs");
const path = require("path");

const USING_HTTPS = process.env.USING_HTTPS == "true" ? true : false;
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 443;

var HTTP = Express();

if (USING_HTTPS && PORT != 443) {
  HTTP.get("*", (req, res) =>
    res.redirect("https://" + process.env.HOST + ":" + process.env.PORT)
  );

  HTTP.listen(PORT);
}

const APP = Express();
const APP_PATH = path.join(__dirname, "..", "build");

APP.use(Express.static(APP_PATH));

APP.get("*", (_, res) => res.sendFile(path.join(APP_PATH, "localhost/3000")));

let SERVER = null;

if (USING_HTTPS) {
  const CERTS = () => {
    try {
      return {
        key: fs.readFileSync(path.join(__dirname, ".cert/cert.key")),
        cert: fs.readFileSync(path.join(__dirname, ".cert/cert.crt")),
      };
    } catch (err) {
      console.log("No certificates found: " + err);
    }
  };
  SERVER = HTTPS.createServer(CERTS(), APP);
}

(USING_HTTPS ? SERVER : APP).listen(PORT, () =>
  console.log("App is running on port: " + PORT)
);
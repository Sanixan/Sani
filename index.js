const { exec } = require("child_process");
const chalk = require("chalk");
const check = require("get-latest-version");
const fs = require("fs");
const semver = require("semver");

let configJson;
let packageJson;
const sign = "(›^-^)›";
const fbstate = "appstate.json";

try {
  configJson = require("./config.json");
} catch (error) {
  console.error("Error loading config.json:", error);
  process.exit(1); // Exit the script with an error code
}

const delayedLog = async (message) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const char of message) {
    process.stdout.write(char);
    await delay(50);
  }

  console.log();
};

const showMessage = async () => {
  const message =
    chalk.yellow(" ") +
    `The "removeSt" property is set true in the config.json. Therefore, the Appstate was cleared effortlessly! You can now place a new one in the same directory.`;

  await delayedLog(message);
};

if (configJson.removeSt) {
  fs.writeFileSync(fbstate, sign, { encoding: "utf8", flag: "w" });
  showMessage();
  configJson.removeSt = false;
  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configJson, null, 2),
    "utf8",
  );
  setTimeout(() => {
    process.exit(0);
  }, 10000);
  return;
}

// # Please note that sometimes this function is the reason the bot will auto-restart, even if your custom.js auto-restart is set to false. This is because the port switches automatically if it is unable to connect to the current port. ↓↓↓↓↓↓

const excluded = configJson.UPDATE.EXCLUDED || [];

try {
  packageJson = require("./package.json");
} catch (error) {
  console.error("Error loading package.json:", error);

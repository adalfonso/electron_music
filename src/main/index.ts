import { app, protocol, BrowserWindow } from "electron";
import * as path from "path";

const isDevelopment = process.env.NODE_ENV === "development";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: Electron.BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      /**
       * TODO: remove this option
       *
       * This is set as a hack to get dev envs to access local files.
       */
      webSecurity: !isDevelopment,
    },
  });

  // disable main menu
  window.setMenu(null);

  if (isDevelopment) {
    window.webContents.openDevTools();
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(path.join(__dirname, "index.html"));
  }

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", () => {
  mainWindow = createMainWindow();

  protocol.registerFileProtocol("file", (request, callback) => {
    const pathname = decodeURI(request.url.replace("file:///", ""));
    callback(pathname);
  });
});

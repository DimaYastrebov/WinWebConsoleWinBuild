const { app, BrowserWindow, Menu, shell } = require('electron');
const express = require('express');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    title: 'WebWinConsole',
    icon: 'logo.png',
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Registry',
          click: () => {
            exec('regedit');
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Website',
          click: () => {
            // Обработчик для пункта "Website"
          }
        },
        {
          label: 'About',
          click: () => {
            createWindowAbout();
          }
        }
      ]
    }
  ]; 

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindowAbout() {
  const about = new BrowserWindow({
    width: 800,
    height: 450,
    title: 'About',
    icon: 'logo.png',
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  about.loadFile('about.html');

  about.setMenu(null);
  about.webContents.on('will-navigate', (event, url) => {
    event.preventDefault(); // Prevent opening the URL in the Electron window
    require("shell").openExternal(url); // Open the URL in the default system browser
  });
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const appExpress = express();
const port = 3000;

appExpress.post('/regedit', (req, res) => {
  exec('regedit', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send('Error');
    } else {
      console.log('Registry Editor (regedit) opened successfully on the server!');
      res.send('Success');
    }
  });
});

appExpress.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

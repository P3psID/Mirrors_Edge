# Smart Screen

A fully automated connected display showing real-time environmental data (weather, temperature, etc.).
Key feature: Everything is dynamic and user-friendly. No SSH administration, no keyboard needed—just plug and "play".
This README covers web Raspberry configuration, interface development and implementation only (and has been written thanks to Claude ahah, if you have deeper questions, you can contact me).

## Prerequisites

Hardware:
  Raspberry Pi 4 (2GB+ RAM)
  MicroSD card (16GB+)
  Monitor

Skills needed:
  HTML/CSS
  JavaScript + APIs
  Python + Flask
  Linux basics (Raspberry Pi OS Lite)
  systemd


## 1st Step : Configure your Raspberry 

### Install OS: Raspberry Pi OS Lite (64-bit) 

### Configure Wi-Fi
Do it in the Raspberry Pi Imager, or -> sudo nmcli device wifi connect "YourSSID" password "YourPassword"

### Install packages and create a virtual environment to install Flask Framework
sudo apt update && sudo apt upgrade -y
sudo apt install xserver-xorg x11-xserver-utils xinit openbox chromium unclutter python3 python3-pip git -y
mkdir myproject
cd myproject
python3 -m venv .venv 
pip3 install flask
pip3 install psutil


## 2nd Step: Web Interface Development

Create the features that you want for your own project. Personnaly, for my project, I needed the following structure :

### Project Structure
```
myproject/
├── index.html          # Main interface
├── stylesheet.css      # CSS
├── server.py          # Flask API server
├── script.js           # JS
├── shutdown.py         # Shutdown script
├── objectifs.txt      # The goals list
└── images/
    ├── lune.png
    ├── soleil.png
    └── coucher.png
```
APIs Used

OpenWeatherMap - Weather data + sunrise/sunset times
Get free key: https://openweathermap.org/api

Google Calendar API - Event scheduling
Enable API: https://console.cloud.google.com

Flask Local API - Is giving me CPU temperature, CPU running time, and JSON version of the "objectifs.txt" content.

## 3rd Step: Implementation

This is where you use systemd and create services : 

Automate the launch of the Flask server : 
[Unit]
Description=Mirror API Server
After=network.target

[Service]
User=pi
WorkingDirectory=/home/YOUR_USER/myproject
ExecStart=/home/YOUR_USER/myproject/.venv/bin/python server.py
Restart=always

[Install]
WantedBy=multi-user.target



Automate the launch of the web navigator :
[Unit]
Description=Openbox Kiosk Mode
After=monserver.service
Requires=monserver.service
After=systemd-user-sessions.service
After=network.target

[Service]
Type=simple
User=peps

Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/YOUR_USER/.Xauthority

ExecStart=/usr/bin/startx
Restart=no

[Install]
WantedBy=multi-user.target



Automate the launch of the shutdown.py script at the boot :
[Unit]
Description=Sert à déclencher au démarrage le daemon de shutdown
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /home/YOUR_USER/myproject/shutdown.py
Restart=always
User=root

[Install]
WantedBy=multi-user.target



Don't forget to also automate the launch of your web interface on your navigator config files :

sudo nano home/YOUR_USER/.config/openbox/autostart

xset s off
xset -dpms
xset s noblank
unclutter -idle 0 &
chromium-browser --kiosk --noerrdialogs --disable-infobars --check-for-update-interval=31536000 file:///ABSOLUTE_PATH_TO_HTML_FILE &

## Usage
Edit goals: Modify objectifs.txt and save
Configure APIs: Add keys in index.html CONFIG sections
Reboot: sudo reboot
Interface loads automatically in fullscreen

### Hope you have fun!

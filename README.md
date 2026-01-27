# Smart Screen

A fully automated connected display showing real-time environmental data (weather, temperature, etc.).
Key feature: Everything is dynamic and user-friendly. No SSH administration, no keyboard needed—just plug and "play".
This README covers web interface development and implementation only (and has been written thanks to Claude ahah, if you have deeper questions, you can contact me).

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

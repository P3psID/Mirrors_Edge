#!/usr/bin/env python3

import RPi.GPIO as GPIO
import time
import subprocess

BUTTON_PIN = 17
LONG_PRESS_TIME = 3

press_time = None

def button_callback(channel):
    global press_time

    if GPIO.input(BUTTON_PIN) == GPIO.LOW:
        # bouton appuyé
        press_time = time.time()
    else:
        # bouton relâché
        if press_time:
            duration = time.time() - press_time
            if duration >= LONG_PRESS_TIME:
                print("Appui long détecté")
                # Exemple : shutdown
                subprocess.run(["/sbin/shutdown", "-h", "now"])
        press_time = None

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

GPIO.add_event_detect(
    BUTTON_PIN,
    GPIO.BOTH,
    callback=button_callback,
    bouncetime=50
)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()

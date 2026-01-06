from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import time
import platform

app = Flask(__name__)
CORS(app) 


def get_cpu_temperature():
    temps = psutil.sensors_temperatures()
    if 'coretemp' in temps:
        return round(temps['coretemp'][0].current, 1)
    elif 'cpu_thermal' in temps:  # Raspberry Pi
        return round(temps['cpu_thermal'][0].current, 1)


@app.route('/system-info')
def system_info():
    # Température CPU
    cpu_temp = get_cpu_temperature()
    if cpu_temp is None:
        cpu_temp = "N/A"  
    
    # Temps d'allumage (uptime)
    uptime_seconds = time.time() - psutil.boot_time()
    jours = int(uptime_seconds // 86400)
    heures = int((uptime_seconds % 86400) // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    
    return jsonify({
        'temperature': cpu_temp,
        'uptime_jours': jours,
        'uptime_heures': heures,
        'uptime_minutes': minutes,
    })

if __name__ == '__main__':
    print("Infos du système sur : http://localhost:5000/system-info")
    app.run(host='0.0.0.0', port=5000, debug=True)
import json
import time
import requests
import fileinput
import configparser
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

ROOM_MAP = {
    'A' : 'kitchen',
    'B' : 'downstairs',
    'C' : 'outside'
}

def send_bundle(bundle_data):
    #print('sending', bundle_data)
    ref.set(bundle_data)

def process_input():
    flags = {
        'A' : 0,
        'B' : 0,
        'C' : 0
    }
    bundle_data = {
        'kitchen': {
            'time' : '',
            'temp' : '',
            'hum'  : '',
            'bat'  : ''
        },
        'downstairs': {
            'time' : '',
            'temp' : '',
            'hum'  : '',
            'bat'  : ''
        },
        'outside': {
            'time' : '',
            'temp' : '',
            'hum'  : '',
            'bat'  : ''
        }
    }
    for line in fileinput.input():
        try:
            data = json.loads(line)
            if (bundle_data[ROOM_MAP[data['channel']]]['time'] != data['time']):
                bundle_data[ROOM_MAP[data['channel']]]['time'] = data['time']
                bundle_data[ROOM_MAP[data['channel']]]['temp'] = data['temperature_C']
                bundle_data[ROOM_MAP[data['channel']]]['hum'] = data['humidity']
                bundle_data[ROOM_MAP[data['channel']]]['bat'] = data['battery_low']
                #print(bundle_data)
                flags[data['channel']] = 1
            if all(val == 1 for val in flags.values()):
                send_bundle(bundle_data)
                for flag in flags:
                    flags[flag] = 0

        except Exception as e:
            print(e)

if __name__ == "__main__":
    print("weather.py started!")
    config = configparser.ConfigParser()
    config.read('config.ini')
    cred = credentials.Certificate("./serviceAccountKey.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL':config['firebase']['db_url'],
        'databaseAuthVariableOverride': {
        	'uid': config['firebase']['uid']
    	}

    })
    ref = db.reference('/')
    process_input()
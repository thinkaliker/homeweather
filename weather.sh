#!/bin/sh

export GOOGLE_APPLICATION_CREDENTIALS="./service-account-file.json"

rtl_433 -R 40 -F json | python3 weather.py
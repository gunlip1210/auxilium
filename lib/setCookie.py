import argparse
import configparser
import getpass
import logging
import logging.handlers
import os
import pickle
import re
import requests
import datetime

from bs4 import BeautifulSoup as bs
from colorama import init, Fore, Back, Style
from xdg import (XDG_CONFIG_HOME, XDG_DATA_HOME)

init()

boj_url = 'https://www.acmicpc.net'
# cookiefile_path = data_dir + '/cookiefile'
cookiefile_path = 'lib/cookiefile'

sess = requests.Session()

def read():
    with open(cookiefile_path, 'rb') as f:
        print(pickle.load(f))

def write():
    # Step 1: Create a RequestsCookieJar object
    cookie_jar = requests.cookies.RequestsCookieJar()

    # Step 2: Add the cookie to the jar
    cookie_jar.set(
        name="bojautologin",
        value="bb56f9e0285dfad8018394daf8cf908dec5b2c5d",
        domain="www.acmicpc.net",  # Replace with the actual domain if known
        path="/",
        expires=int(datetime.datetime.strptime("2024-12-04T16:27:46.140Z", "%Y-%m-%dT%H:%M:%S.%fZ").timestamp())
    )
    with open(cookiefile_path, 'wb') as f:
        pickle.dump(cookie_jar, f)

write()
read()
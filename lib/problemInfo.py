"""
module boj

a module for logging in, submitting, getting stats from BOJ
"""

import sys
import io
import json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import argparse
import configparser
import getpass
import logging
import logging.handlers
import os
import pickle
import re
import requests

from bs4 import BeautifulSoup as bs
from colorama import init, Fore, Back, Style
from xdg import (XDG_CONFIG_HOME, XDG_DATA_HOME)

init()

__version__ = '1.1.4'

# data_dir = XDG_DATA_HOME + '/boj-tool'
data_dir = 'lib'
config_dir = XDG_CONFIG_HOME + '/boj-tool'
boj_url = 'https://www.acmicpc.net'
# cookiefile_path = data_dir + '/cookiefile'
cookiefile_path = 'lib/cookiefile'
configfile_path = config_dir + '/config'
sess = requests.Session()

logger = logging.getLogger('boj-tool')
streamHandler = logging.StreamHandler()
logger.addHandler(streamHandler)
config = configparser.ConfigParser()

# 웹브라우저라고 가라치기
sess.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'})


def initialize():
    """
    function initialize -- initialize boj-tool

    This function loads cookie/config from cookifile/config file if the file
    exists.
    """
    if not os.path.exists(data_dir):
        logger.debug('Creating directory for cookiefile...')
        os.makedirs(data_dir)
        logger.debug('Created directory for cookiefile')
    if os.path.isfile(configfile_path):
        logger.debug('Config file found')
        config.read(configfile_path)


def load_cookie():
    """
    function load_cookie -- loads cookie to cookiefile

    This function loads cookiefile to global session object if cookiefile is
    found. If not, the function calls login and asks user username and
    password.
    """
    if os.path.isfile(data_dir + '/cookiefile'):
        logger.debug('Cookiefile found. Loading...')
        with open(data_dir + '/cookiefile', 'rb') as f:
            sess.cookies.update(pickle.load(f))
        logger.info('Loaded cookiefile')
    else:
        logger.error('Cookiefile not found. Logging in...')


def get_problemInfo(num):
    # load_cookie()
    problemInfo = {}
    soup = bs(sess.get(boj_url + "/problem/" + str(num)).text, 'html.parser')
    problemInfo["des"] = soup.find('div', {'id': 'problem_description', 'class': 'problem-text'}).get_text()
    problemInfo["inp"] = soup.find('div', {'id': 'problem_input', 'class': 'problem-text'}).get_text()
    problemInfo["out"] = soup.find('div', {'id': 'problem_output', 'class': 'problem-text'}).get_text()
    sample = soup.find_all('pre', {'class': "sampledata"})
    print(sample)
    return problemInfo


def main(num):
    initialize()
    num = int(num)
    print(get_problemInfo(num))


if __name__ == '__main__':
    main(sys.argv[1])
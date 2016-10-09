#!/usr/bin/env python
# Saj Arora
# Project HT

from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

from modules import routes

import config

app = Flask(__name__)
app.config.from_object(config)

base_url = '/%s/%s' % (config.BASE_URL, config.VERSION)
api = Api(app)
routes.add_routes(api, base_url)
CORS(app)

if __name__ == '__main__':
    app.run()

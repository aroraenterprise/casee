from google.appengine.ext import ndb

import pydash as _
from flask import request
import errors


def get_args_for_model(model, extra_args=None):
    # get all editable properties
    editable_props = (model.EDITABLE_PROPS or []) + (extra_args or [])
    return _.pick(request.json, editable_props)


def get_model_by_key_or_error(key, model=None):
    item = None
    try:
        item = ndb.Key(urlsafe=key).get()
    except:
        errors.create(400, message="Invalid model key: %s" % key)
    if not item:
        errors.create(404)
    if model and item._get_kind() != model._get_kind():
        errors.create(404)
    return item
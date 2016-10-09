import datetime
import pydash as _
from google.appengine.ext import ndb

import util


class NexendComputedProperty(ndb.ComputedProperty):
    def __init__(self, func, validator=str):
        super(NexendComputedProperty, self).__init__(func)
        self._validator = validator

    def get_validator(self):
        return self._validator

class NexendModel(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    modified = ndb.DateTimeProperty(auto_now=True)

    PUBLIC_PROPS = []
    EDITABLE_PROPS = []

    def get_id(self):
        return self.key.id()

    def get_key(self):
        return self.key

    def get_key_urlsafe(self):
        return self.key.urlsafe()

    @classmethod
    def get_property_converter(cls, name):
        prop = getattr(cls, name)
        converter = None
        if type(prop) == ndb.IntegerProperty:
            converter = lambda x: int(x) if x is not None else 0
        elif type(prop) == ndb.DateTimeProperty:
            converter = lambda x: util.convert_string_to_datetime(x)
        elif type(prop) == ndb.BooleanProperty:
            converter = lambda x: bool(x) if x is not None else False
        elif type(prop) == NexendComputedProperty:
            converter = lambda x: prop.get_validator()(prop, x)
        return {
            'name': name,
            'converter': converter
        }

    @classmethod
    def get_all_properties(cls):
        result = {}
        for x in cls._properties:
            result[x] = cls.get_property_converter(x)
        return result

    @classmethod
    def get_editable_properties(cls):
        result = {}
        for x in cls.EDITABLE_PROPS:
            result[x] = cls.get_property_converter(x)
        return result

    def populate(self, **kwargs):
        """Extended ndb.Model populate method, so it can ignore properties, which are not
        defined in model class without throwing error
        """
        kwargs = _.pick(kwargs, self.EDITABLE_PROPS)  # We want to populate only editable model properties
        editable_props = self.get_editable_properties()
        args = {}
        for name, value in kwargs.iteritems():
            editable = editable_props.get(name)
            if editable and editable.get('converter', None):
                value = editable.get('converter')(value)
            args[name] = value
        super(NexendModel, self).populate(**args)

    def _parse_datastore_item(self, _MODEL, name, value, convert_key=True):
        if type(getattr(_MODEL, name)) == ndb.StructuredProperty:
            if isinstance(value, list):
                items = []
                for item in value:
                    items.append(item.to_dict(include=None))
                value = items
            else:
                value = value.to_dict(include=None)
        elif isinstance(value, datetime.date):
            value = value.isoformat()
        elif isinstance(value, ndb.Key):
            value = value.urlsafe() if convert_key else value
        return value

    def _to_dict(self, include=None, exclude=None, convert_key=True):
        """Return a dict containing the entity's property values, so it can be passed to client
        Args:
            include (list, optional): Set of property names to include, default all properties
        """
        _MODEL = type(self)
        repr_dict = {}
        _include = include or []
        if len(_include) == 0:
            _include = _MODEL.PUBLIC_PROPS

        if exclude:
            include = []
            for item in _include:
                if item not in exclude:
                    include.append(item)
        else:
            include = _include

        for name in include:
            # check if this property is even allowed to be public
            # or has a value set
            if not hasattr(self, name):
                continue

            value = getattr(self, name)
            if isinstance(value, list):
                repr_dict[name] = []
                for item in value:
                    repr_dict[name].append(self._parse_datastore_item(_MODEL, name, item, convert_key))
            else:
                repr_dict[name] = self._parse_datastore_item(_MODEL, name, value, convert_key)

            if self._key:
                repr_dict['key'] = self.get_key_urlsafe() if convert_key else self.get_key()
        return repr_dict

    def to_dict(self, include=None, exclude=None, convert_key=True):
        return self._to_dict(include, exclude, convert_key)

    @classmethod
    def get_name(cls):
        return str(cls.__name__)
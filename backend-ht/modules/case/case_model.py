from google.appengine.ext import ndb

from modules.helpers.model import NexendModel


class CaseModel(NexendModel):
    case_id = ndb.IntegerProperty(required=True) # class, clinic, etc...
    name = ndb.StringProperty(required=True)
    open_date = ndb.StringProperty(required=True)
    close_date = ndb.StringProperty()
    description = ndb.TextProperty()
    path = ndb.StringProperty(required=True)
    meta = ndb.JsonProperty()
    archived = ndb.BooleanProperty(default=False)

    PUBLIC_PROPS = ['case_id', 'name', 'open_date', 'close_date', 'description', 'path', 'meta',
                    'archived']
    EDITABLE_PROPS = ['case_id', 'name', 'open_date', 'close_date', 'description', 'path', 'meta',
                      'archived']

    @classmethod
    def create(cls, **kwargs):
        db = cls(
            **kwargs
        )
        return db

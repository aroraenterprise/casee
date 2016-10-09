"""
Project: nexend
Author: Saj Arora
Description:
"""
import re

from flask import request
from flask_restful import reqparse
from google.appengine.ext import ndb
import pydash as _

COMP_EQUALITY = '='
COMP_LESS_THAN = '<'
COMP_GREATER_THAN = '>'
_DEFAULT_LIMIT = 10


def cursor(cursor):
    """Verifies if given string is valid ndb query cursor
        if so returns instance of it
        Args:
            cursor (string): Url encoded ndb query cursor
        Returns:
            google.appengine.datastore.datastore_query.Cursor: ndb query cursor
        Raises:
           ValueError: If captcha is incorrect
        """
    if not cursor:
        return None
    return ndb.Cursor(urlsafe=cursor)


def get_list_for_model(args, model, or_filters=None, and_filters=None):
    """
    Creates a list for the model
    :param args:
    :param model:
    :param default_order:
    :param or_filters:
    :return: items, next_cursor, more, total_count_future
    """
    default_order = -model.modified
    if args.get('order'):
        order_prop = model._properties.get(args.get('order'))
        if order_prop:
            default_order = -order_prop if args.get('order_reverse', False) else order_prop

    filter_node = None
    or_filters = or_filters or []
    if not isinstance(or_filters, list):
        or_filters = [or_filters]
    if args.get('filter'):
        for filter in args.get('filter'):
            # split filter into its components: e.g. filter=course,filter=2017,timestamp>12241231
            _and_filters = and_filters or []
            for item in filter.split('+'):
                comparison = None
                result = []
                for delimiter in [COMP_EQUALITY, COMP_GREATER_THAN, COMP_LESS_THAN]:
                    result = [s.strip() for s in re.split(delimiter, item)]
                    if len(result) == 2:
                        comparison = delimiter
                        break

                if comparison and result[0] in model._properties:
                    property = model.get_all_properties().get(result[0])
                    value = result[1]
                    if property and property.get('converter', None):
                        value = property.get('converter')(result[1])

                    _and_filters.append(
                        ndb.FilterNode(result[0], comparison, value)
                    )

                    if comparison != COMP_EQUALITY:  # sort order must be altered
                        args['order'] = getattr(model, result[0])
            if len(_and_filters) > 0:
                or_filters.append(ndb.AND(*_and_filters))
    elif and_filters:
        or_filters.append(ndb.AND(*and_filters))

    if len(or_filters) == 1:
        filter_node = or_filters[0]
    elif len(or_filters) > 0:
        filter_node = ndb.OR(*or_filters)

    items_future = model.query(filters=filter_node).order(default_order, model._key) \
        .fetch_page_async(args.limit or _DEFAULT_LIMIT, start_cursor=args.cursor)

    total_count_future = model.query(filters=filter_node).count_async(keys_only=True)
    items, next_cursor, more = items_future.get_result()
    return items, next_cursor, more, total_count_future


def parse_args(extra_args=None):
    extra_args = extra_args or []

    parser = reqparse.RequestParser()
    parser.add_argument('limit', type=int)
    parser.add_argument('cursor', type=cursor)
    parser.add_argument('order')
    parser.add_argument('filter', action='append')
    for item in extra_args:
        parser.add_argument(**item)
    return parser.parse_args()


def parse_form_args_for_model(model, extra_args=None, json=None, validator=True):
    # get all editable properties
    editable_props = model.EDITABLE_PROPS + (extra_args or [])
    return _.pick(json or request.form, editable_props)


def parse_args_for_model_in_list(name, model, extra_args=None):
    items = request.json.get(name, [])
    result = []
    for item in items:
        result.append(parse_form_args_for_model(model, json=item, extra_args=extra_args))
    return result


def make_response(items, next_cursor, more, total, extra=None):
    """Creates reponse with list of items and also meta data useful for pagination
    Args:
        reponse_list (list): list of items to be in helpers
        cursor (Cursor, optional): ndb query cursor
        more (bool, optional): whether there's more items in terms of pagination
        total_count (int, optional): Total number of items
    Returns:
        dict: helpers to be serialized and sent to client
    """
    return {
        'list': items,
        'meta': _.extend({
            'next_cursor': next_cursor.urlsafe() if next_cursor else '',
            'more': more,
            'total_count': total
        }, (extra or {}))
    }
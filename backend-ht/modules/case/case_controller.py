from flask.ext.restful import Resource
from modules.helpers import list, parser, response
from case_model import CaseModel


class CaseController(Resource):
    def get(self):
        args = list.parse_args()
        # use args to create a nice list of classes
        items, next_cursor, more, total_count_future = list.get_list_for_model(args, CaseModel)
        result = []
        for i in items:
            _i = i.to_dict()
            result.append(_i)
        return list.make_response(result,
                                  next_cursor, more,
                                  total_count_future.get_result())

    def post(self):
        args = parser.get_args_for_model(CaseModel)
        case_db = CaseModel.create(**args)
        case_db.put()
        return case_db.to_dict()


class CaseByKeyController(Resource):
    def get(self, key):
        case = parser.get_model_by_key_or_error(key, CaseModel)
        result = case.to_dict()
        return result

    def put(self, key, account, policy):
        case = parser.get_model_by_key_or_error(key, CaseModel)
        case.update(**parser.get_args_for_model(CaseModel))
        case.put()
        return case.to_dict()

    def delete(self, key, account, policy):
        course = parser.get_model_by_key_or_error(key, CaseModel)
        course.is_archived = True
        course.put()
        return response.make_empty_ok_response()


def add_routes(api, base_url):
    api.add_resource(CaseController, base_url + '/case')
    api.add_resource(CaseByKeyController, base_url + '/case/<string:key>')

from flask.ext.restful import Resource
from modules.helpers import list, parser
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
        # case_db.put()
        return case_db.to_dict()


def add_routes(api, base_url):
    api.add_resource(CaseController, base_url + '/case')
    # api.add_resource(CourseByYearController, base_url + '/year/<int:year>/courses')
    # api.add_resource(CoursesByUrlController, base_url + '/courses/<string:key_url>')

# Project: ProjectHT
# Creator: Saj Arora
# Email: saj.arora24@gmail.com
# routes 10/8/16
# Summary:
from modules.case import case_controller


def add_routes(api, base_url):
    for controller in [
        case_controller
    ]:
        controller.add_routes(api, base_url)
from vscnc import maven, pip, client, printer, const
from os import path
import sys


def scan(project_type, relative_root_path, quiet):

    printer.print_info(project_type, relative_root_path)

    if not validate_project_type(project_type):
        print('Error project type')
        return

    if not validate_root_dir(relative_root_path):
        print('Error root dir')
        return

    dependencies_for_scanning = _get_dependencies_for_scanning(project_type, relative_root_path)
    printer.print_pre_scan_summary(dependencies_for_scanning)
    affected_dependencies = client.scan(dependencies_for_scanning)
    cves_list = map(lambda d: d['vulnerabilities'], affected_dependencies)

    if quiet:
        printer.print_found_info(affected_dependencies)
        return

    cves = set()

    for c in cves_list:
        cves.update(c)

    if len(cves) > 0:
        cve_details = client.load_cve(cves)
        printer.print_cve_details(affected_dependencies, cve_details)

    printer.print_found_info(affected_dependencies)


def validate_project_type(project_type) -> bool:
    return project_type in const.SUPPORTED_PROJECT_TYPES


def validate_root_dir(relative_root_path) -> bool:
    if path.exists(relative_root_path) and path.isdir(relative_root_path):
        return True
    return False


def _get_dependencies_for_scanning(type, relative_path):
    if type == 'mvn':
        return maven.scan(relative_path)
    if type == 'pip':
        return pip.scan(relative_path)
    return None


quiet = len(sys.argv) == 4
scan(sys.argv[1], sys.argv[2], quiet)

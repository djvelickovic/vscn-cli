from vscnc import maven
from vscnc import pip
from vscnc import client
from vscnc import printer
from vscnc.const import SUPPORTED_PROJECT_TYPES
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

    printer.print_found_info(affected_dependencies)

    cves_list = map(lambda d: d['vulnerabilities'], affected_dependencies)

    if quiet:
        return

    cves = set()

    for c in cves_list:
        cves.update(c)

    if len(cves) > 0:
        cve_details = client.load_cve(cves)
        printer.print_cve_details(affected_dependencies, cve_details)


def validate_project_type(project_type) -> bool:
    return project_type in SUPPORTED_PROJECT_TYPES


def validate_root_dir(relative_root_path) -> bool:
    if path.exists(relative_root_path) and path.isdir(relative_root_path):
        return True
    return False


def _get_dependencies_for_scanning(type, relative_path):
    if type == 'mvn':
        return maven_scan(relative_path)
    if type == 'pip':
        return pip_scan(relative_path)
    return None


def pip_scan(project_root_dir):
    pip.pre_run(project_root_dir)
    return pip.list_dependencies(project_root_dir)


def maven_scan(project_root_dir):
    maven.pre_run(project_root_dir)
    return maven.list_dependencies(project_root_dir)


quiet = len(sys.argv) == 4
scan(sys.argv[1], sys.argv[2], quiet)

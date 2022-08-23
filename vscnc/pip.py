from vscnc.runner import run
import json


def pre_run(project_root_dir):
    run(['bin/pip/preRun.sh'])


def list_dependencies(project_root_dir) -> list:
    std_out = run(['bin/pip/list.sh']).decode('ascii')
    return _extract_dependencies(std_out)


def _extract_dependencies(std_out: str) -> list:
    dependencies = json.loads(std_out)

    result = list(map(_map_dependency, dependencies))

    return result


def _map_dependency(dependency: str):
    return {
        'product': dependency['name'],
        'version': dependency['version']
    }

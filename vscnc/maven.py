from vscnc.runner import run


def pre_run(project_root_dir):
    pom_path = f'{project_root_dir}/pom.xml'
    str(run(['bin/maven/preRun.sh', pom_path]))


def list_dependencies(project_root_dir) -> list:
    pom_path = f'{project_root_dir}/pom.xml'
    std_out = run(['bin/maven/list.sh', pom_path]).decode('ascii')
    return _extract_dependencies(std_out)


def _extract_dependencies(std_out: str) -> list:
    lines = std_out.splitlines()
    raw_dependencies = map(lambda line: line.split('--')[0], lines)
    filtered_dependencies = filter(lambda line: not line.endswith('test'), raw_dependencies)

    return list(map(_map_dependency, filtered_dependencies))


def _map_dependency(dependency: str):
    artifactId = None
    dependency_parts = dependency.split(':')

    if len(dependency_parts) in [4, 5]:
        artifactId = dependency_parts[1]
        version = dependency_parts[3]

    if len(dependency_parts) == 6:
        artifactId = dependency_parts[1]
        version = dependency_parts[4]

    return {
        'product': artifactId.strip(),
        'version': version.strip()
    }

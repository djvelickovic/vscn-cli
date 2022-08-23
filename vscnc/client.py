from vscnc.const import HOST
import requests


def scan(dependencies: list):

    request = {
        'dependencies': dependencies,
    }

    response = requests.post(f'{HOST}/vscn/scan', json=request)

    if response.status_code != 200:
        raise Exception(f'Error received from the server. {response.status_code}')

    return response.json()


def load_cve(cves: set):
    query_params = '&'.join(map(lambda c: f'id={c}', cves))
    response = requests.get(f'{HOST}/vscn/cve?{query_params}')
    return {cve['id']: cve for cve in response.json()}

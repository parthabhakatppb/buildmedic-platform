import requests
import base64

class GitHubClient:
    def __init__(self, repo: str, token: str):
        self.base_url = f"https://api.github.com/repos/{repo}"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def pull_file(self, path: str, ref: str) -> str:
        res = requests.get(f"{self.base_url}/contents/{path}?ref={ref}", headers=self.headers)
        res.raise_for_status()
        return base64.b64decode(res.json()["content"]).decode("utf-8")

    def provision_branch(self, branch_name: str, base_sha: str):
        payload = {"ref": f"refs/heads/{branch_name}", "sha": base_sha}
        res = requests.post(f"{self.base_url}/git/refs", json=payload, headers=self.headers)
        if res.status_code not in [201, 422]: # 422 implies branch already exists
            res.raise_for_status()

    def stage_and_commit(self, path: str, content: str, branch: str, msg: str):
        res = requests.get(f"{self.base_url}/contents/{path}?ref={branch}", headers=self.headers)
        blob_sha = res.json()["sha"] if res.status_code == 200 else None

        payload = {
            "message": msg,
            "content": base64.b64encode(content.encode("utf-8")).decode("utf-8"),
            "branch": branch
        }
        if blob_sha:
            payload["sha"] = blob_sha

        requests.put(f"{self.base_url}/contents/{path}", json=payload, headers=self.headers).raise_for_status()

    def launch_pull_request(self, title: str, body: str, head: str, base: str) -> str:
        payload = {"title": title, "body": body, "head": head, "base": base}
        res = requests.post(f"{self.base_url}/pulls", json=payload, headers=self.headers)
        res.raise_for_status()
        return res.json()["html_url"]
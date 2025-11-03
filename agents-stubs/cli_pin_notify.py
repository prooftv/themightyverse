#!/usr/bin/env python3
"""Notify (create a GitHub issue) if there are pending pin files.

This script is optional and intended for admins. It looks under
/tmp/mighty_pending_pins for .pending.json files and creates a GitHub issue
with a summary if `GH_TOKEN` or `GITHUB_TOKEN` is present and `gh` CLI is
available. If not available, it prints a summary to stdout.
"""
import os
import json
import shutil
import subprocess

PENDING_DIR = "/tmp/mighty_pending_pins"


def gather_pending():
    items = []
    if not os.path.exists(PENDING_DIR):
        return items
    for fn in os.listdir(PENDING_DIR):
        if not fn.endswith(".pending.json"):
            continue
        path = os.path.join(PENDING_DIR, fn)
        try:
            with open(path, "r") as f:
                data = json.load(f)
            items.append({"file": data.get("file"), "error": data.get("error")})
        except Exception:
            continue
    return items


def create_issue(title: str, body: str):
    # prefer gh CLI if available
    if shutil.which("gh"):
        try:
            subprocess.run(["gh", "issue", "create", "--title", title, "--body", body], check=True)
            return True
        except Exception:
            return False
    # otherwise, instruct the user to create manually
    return False


def main():
    items = gather_pending()
    if not items:
        print("No pending pins found")
        return
    summary = "Found {} pending pins:\n\n".format(len(items))
    for it in items:
        summary += f"- {it['file']}: {it.get('error')}\n"

    title = f"[mighty] {len(items)} pending pin(s) need attention"
    created = create_issue(title, summary)
    if created:
        print("Created issue for pending pins")
    else:
        print("Could not create issue automatically. Summary:\n")
        print(summary)


if __name__ == "__main__":
    main()

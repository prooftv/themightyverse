"""Small admin helper to retry pending pins recorded under /tmp/mighty_pending_pins.

This is intentionally a simple script for local/admin use. It will attempt to
read pending files and re-run `pin_file_with_retries` using `NFT_STORAGE_KEY`.
"""
import os
import json
from agents_stubs.utils.pinning import pin_file_with_retries


def retry_all():
    pending_dir = "/tmp/mighty_pending_pins"
    api_key = os.environ.get("NFT_STORAGE_KEY")
    if not api_key:
        print("NFT_STORAGE_KEY not set; cannot retry pins")
        return
    if not os.path.exists(pending_dir):
        print("No pending pins found")
        return
    for fn in os.listdir(pending_dir):
        if not fn.endswith(".pending.json"):
            continue
        path = os.path.join(pending_dir, fn)
        try:
            with open(path, "r") as f:
                data = json.load(f)
            file_to_pin = data.get("file")
            print("Retrying pin for", file_to_pin)
            cid = pin_file_with_retries(file_to_pin, api_key)
            print("Pinned", file_to_pin, "->", cid)
            os.remove(path)
        except Exception as e:
            print("Retry failed for", path, e)


if __name__ == "__main__":
    retry_all()

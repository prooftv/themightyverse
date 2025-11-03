import os
import json
import tempfile
import shutil

import agents_stubs.cli_pin_notify as notify


def test_cli_pin_notify_prints_when_no_gh(tmp_path, monkeypatch, capsys):
    pending_dir = "/tmp/mighty_pending_pins"
    if os.path.exists(pending_dir):
        shutil.rmtree(pending_dir)
    os.makedirs(pending_dir, exist_ok=True)

    fname = "t.pending.json"
    path = os.path.join(pending_dir, fname)
    with open(path, "w") as f:
        json.dump({"file": "/tmp/x.bin", "error": "err"}, f)

    # Ensure gh is not present
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    monkeypatch.setattr(shutil, "which", lambda x: None)

    notify.main()
    captured = capsys.readouterr()
    assert "pending pins" in captured.out or "Found" in captured.out


def test_cli_pin_notify_posts_webhook(monkeypatch, tmp_path):
    # prepare pending
    pending_dir = "/tmp/mighty_pending_pins"
    if os.path.exists(pending_dir):
        shutil.rmtree(pending_dir)
    os.makedirs(pending_dir, exist_ok=True)
    path = os.path.join(pending_dir, "t.pending.json")
    with open(path, "w") as f:
        json.dump({"file": "/tmp/x.bin", "error": "err"}, f)

    posted = {}

    def fake_post(url, json=None, timeout=None):
        posted['url'] = url
        posted['body'] = json
        class R: status_code = 200
        return R()

    monkeypatch.setattr(notify, "requests", type("R", (), {"post": fake_post}))
    monkeypatch.setenv("WEBHOOK_URL", "https://example.com/webhook")

    notify.main()
    assert posted.get('url') == "https://example.com/webhook"

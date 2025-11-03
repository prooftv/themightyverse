"""Compatibility package to expose agents-stubs content as `agents_stubs`.

This package proxies to the `agents-stubs/` directory so tests can import
`agents_stubs.service.app` even though the directory name contains a dash.
"""
from importlib import util
import sys
import os

# Expose cli_pin_retry and other top-level helpers by loading them lazily
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "agents-stubs"))


def _load(name, relpath):
	path = os.path.join(ROOT, relpath)
	spec = util.spec_from_file_location(f"agents_stubs.{name}", path)
	mod = util.module_from_spec(spec)
	spec.loader.exec_module(mod)
	# register so `import agents_stubs.<name>` works
	sys.modules[f"agents_stubs.{name}"] = mod
	return mod


__all__ = ["service", "utils", "cli_pin_retry", "cli_pin_notify"]

# lazy loader attributes
cli_pin_retry = _load("cli_pin_retry", "cli_pin_retry.py")
cli_pin_notify = _load("cli_pin_notify", "cli_pin_notify.py")


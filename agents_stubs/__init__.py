"""Compatibility package to expose agents-stubs content as `agents_stubs`.

This package proxies to the `agents-stubs/` directory so tests can import
`agents_stubs.service.app` even though the directory name contains a dash.
"""
__all__ = ["service", "utils"]


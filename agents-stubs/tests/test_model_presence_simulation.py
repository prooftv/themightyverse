"""Simulate presence of ML libs by injecting fake modules into sys.modules.

This allows us to test the happy-path logic in `integrations` without
installing heavy dependencies into CI.
"""
import sys
import types
import tempfile
import os

from agents_stubs.agents import integrations as impl


def make_fake_torch():
    m = types.ModuleType("torch")
    # Minimal torch-like API for hub.load used by integrations
    class FakeModel:
        def eval(self):
            pass

    def fake_hub_load(repo, model_type):
        return FakeModel()

    m.hub = types.SimpleNamespace(load=fake_hub_load)
    m.nn = types.SimpleNamespace(functional=types.SimpleNamespace(interpolate=lambda x, size, mode, align_corners: x))
    m.no_grad = lambda : (lambda f: f)
    return m


def test_integrations_with_fake_torch(monkeypatch):
    fake_torch = make_fake_torch()
    # inject fake torch
    monkeypatch.setitem(sys.modules, "torch", fake_torch)

    # create a tiny image file
    fd, tmp = tempfile.mkstemp(suffix=".png")
    os.write(fd, b"x")
    os.close(fd)

    res = impl.estimate_depth_from_image(tmp)
    # fake implementation will return a local path (since pinning not configured)
    assert isinstance(res, str)

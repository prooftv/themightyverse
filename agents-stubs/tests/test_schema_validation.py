import json
from pathlib import Path

import pytest

from agents.asset_review import run_asset_review


def test_metadata_suggestion_matches_schema(tmp_path):
    pytest.importorskip("jsonschema")
    import jsonschema

    # generate a sample suggestion (use stub path/no models)
    res = run_asset_review("bafy:asset", {"card_id": "c1", "project": "p"})
    meta = res.get("metadata_suggestion")
    assert meta is not None

    schema_path = Path.cwd() / ".github/agents/contracts/metadata-schema.json"
    schema = json.loads(schema_path.read_text())

    # should validate against schema
    jsonschema.validate(instance=meta, schema=schema)

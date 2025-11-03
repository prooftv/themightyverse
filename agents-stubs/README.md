Simple agent stubs for The Mighty Verse project.

This package contains minimal Python CLIs for three agents:
- asset-review
- metadata-gen
- mint-approval

Each agent has a small callable interface and unit tests (pytest).

How to run tests:

```bash
python -m pip install -r requirements.txt
pytest -q
```

Files created for quick iteration. These are stubs — replace the internals with real model calls and IPFS pinning later.

Run the HTTP service locally for development:

```bash
python -m uvicorn service.app:app --reload --port 8000
# then open http://localhost:8000/docs for interactive API docs
```

Build and run via Docker:

```bash
docker build -t mighty-agents-stubs -f agents-stubs/Dockerfile .
docker run -p 8000:8000 mighty-agents-stubs

Environment variables
---------------------
- `NFT_STORAGE_KEY` — optional API key to pin manifests to nft.storage from `metadata_gen`. If unset, pinning is skipped.

ML / inference notes
--------------------

This project keeps ML dependencies optional so the test suite and CI remain
lightweight. If you want to run real inference locally, install the optional
ML requirements with:

```bash
pip install -r agents-stubs/requirements-ml.txt
```

After installing the ML extras you'll be able to run MiDaS/segment-anything/
Whisper if your machine has sufficient resources. The `integrations` module
will automatically detect and use installed libraries; otherwise it returns
safe stubs so operations continue to work.

Recommended workflow:
- Run unit tests without ML libs in CI (current default).
- For local development with models, install `agents-stubs/requirements-ml.txt`.
- Set `NFT_STORAGE_KEY` in your environment if you want generated depth/seg
	artifacts to be pinned automatically.

Quick ML setup (local)
----------------------

We added a helper script to quickly create a venv and install optional ML
dependencies. From the repository root run:

```bash
bash agents-stubs/scripts/setup-ml.sh
```

Pass `--cpu` to prefer CPU-only installs where applicable (you may still need
to adjust the torch wheel for your platform). After activation, you can run
the agents locally and the `integrations` module will detect installed
libraries.

```
Agents Stubs - Tiny local implementations for development

This folder contains minimal, local stubs for three agents used in The Mighty Verse project:

- asset-review: Scans an uploaded asset and emits three JSON files (metadata suggestion, QC report, ad anchors)
- metadata-gen: Validates/merges suggestion data into a canonical metadata.json and returns a fake CID
- mint-approval: Verifies preconditions and emits a simulated mint transaction and receipt

Quick start

1. (Optional) Create a virtualenv and install dev deps:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the asset-review stub:

```bash
python -m agents.cli asset-review --asset-cid QmAssetExample --out-dir ./data/out
```

3. Run metadata-gen using the suggestion produced in step 2:

```bash
python -m agents.cli metadata-gen --suggestion ./data/out/metadata_suggestion.json --out-dir ./data/out
```

4. Run mint-approval (simulated):

```bash
python -m agents.cli mint-approval --manifest-cid cid_example --card-id card_001 --credits-required 10 --out-dir ./data/out
```

Run tests:

```bash
pytest -q
```

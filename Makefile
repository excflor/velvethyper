# VelvetHyper Root Makefile
# Production-Grade Feature-based Root Orchestrator

PYTHON = python
PIP = pip
CLI_DIR = apps/cli_engine
LIBS_DIR = libs

.PHONY: help install run-cli clean dev-install

help:
	@echo "VelvetHyper - Precision Stealth VM"
	@echo "================================"
	@echo "make install      - Install Python dependencies"
	@echo "make dev-install  - Install project in editable mode (production grade)"
	@echo "make run-cli      - Run the One-Click CLI (Phase 1) from 'apps/cli_engine/'"
	@echo "make clean        - Remove all temporary and duplicate files"

install:
	$(PIP) install -r requirements.txt

dev-install:
	$(PIP) install -e .

run-cli:
	$(PYTHON) $(CLI_DIR)/main.py

clean:
	# Removes Python caches
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	# Note: Manual deletion of old folders (src/, libs/, apps/) is recommended if they persist.

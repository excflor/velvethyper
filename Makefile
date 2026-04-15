# 🚀 VelvetHyper: Master Orchestration Makefile

# Project Configuration
PYTHON = python
PIP = pip
NPM = npm
UI_DIR = apps/desktop_ui
NATIVE_DIR = libs/native_utils
ENGINE_DIR = libs/spoofer_core

.PHONY: help install dev build-ui build-native clean harden

help:
	@echo "VelvetHyper: Stealth Virtualization Suite"
	@echo "=========================================="
	@echo "make install       - Install all Host & UI dependencies"
	@echo "make dev           - Launch the Command Center (Dashboard)"
	@echo "make build-ui      - Package the Portable Windows Executable"
	@echo "make build-native  - Manually compile Guest Stealth Tools (MinGW)"
	@echo "make harden        - Manual VMX hardening (requires VMX=path/to/vmx)"
	@echo "make clean         - Deep cleanup of all build and cache files"

install:
	@echo "[*] Installing Host dependencies..."
	$(PIP) install -r requirements.txt
	@echo "[*] Installing UI dependencies..."
	cd $(UI_DIR) && $(NPM) install

dev:
	@echo "[*] Launching VelvetHyper Command Center..."
	cd $(UI_DIR) && $(NPM) run dev

build-ui:
	@echo "[*] Packaging Portable Windows Executive..."
	cd $(UI_DIR) && $(NPM) run build:win

build-native:
	@echo "[*] Compiling Guest-side Stealth Payloads..."
	$(MAKE) -C $(NATIVE_DIR)

harden:
	@echo "[*] Triggering manual hardening engine..."
	$(PYTHON) $(ENGINE_DIR)/vmx_hardener.py "$(VMX)"

clean:
	@echo "[*] Performing forensic cleanup..."
	# Python Caches
	rm -rf **/(__pycache__|.pytest_cache)
	rm -f **/*.pyc
	# Build Artifacts
	rm -rf build/
	rm -rf dist/
	rm -rf $(UI_DIR)/dist
	rm -rf $(UI_DIR)/out
	# Native Binaries
	$(MAKE) -C $(NATIVE_DIR) clean

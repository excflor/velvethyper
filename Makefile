# ============================================================
# VelvetHyper — Master Orchestration Makefile
# ============================================================

# -- OS Detection (M-04) -------------------------------------
ifeq ($(OS),Windows_NT)
  PYTHON  := python
  RM_FILE := del /f /q
else
  PYTHON  := python3
  RM_FILE := rm -f
endif

# -- Project Paths -------------------------------------------
UI_DIR      := apps/desktop_ui
NATIVE_DIR  := libs/native_utils
ENGINE_DIR  := apps/cli_engine

# -- Phony Targets -------------------------------------------
.PHONY: help install dev run build-ui build-native \
        harden lint typecheck format test clean release

# ============================================================
# Help
# ============================================================
help:
	@echo ""
	@echo "  VelvetHyper: Stealth Virtualization Suite"
	@echo "  ==========================================="
	@echo ""
	@echo "  Development"
	@echo "  -----------"
	@echo "  make install       Install all host and UI dependencies"
	@echo "  make dev           Launch the Command Center (dev mode)"
	@echo "  make run           Alias for 'make dev'"
	@echo ""
	@echo "  Code Quality"
	@echo "  ------------"
	@echo "  make lint          Lint TypeScript + Python sources"
	@echo "  make typecheck     TypeScript type-check (no emit)"
	@echo "  make format        Auto-format all sources"
	@echo "  make test          Run test suite (placeholder)"
	@echo ""
	@echo "  Build & Release"
	@echo "  ---------------"
	@echo "  make build-ui      Package Portable Windows Executable"
	@echo "  make build-native  Compile Guest-side Stealth Payloads (MinGW)"
	@echo "  make release       Bump version, tag, push to GitHub"
	@echo ""
	@echo "  Utilities"
	@echo "  ---------"
	@echo "  make harden VMX=<path>   Harden a specific .vmx file"
	@echo "  make clean               Deep-clean all build and cache files"
	@echo ""

# ============================================================
# Dependencies
# ============================================================
install:
	@echo "[*] Installing Python dependencies..."
	$(PYTHON) -m pip install -r requirements.txt
	@echo "[*] Installing UI dependencies..."
	cd $(UI_DIR) && npm install

# ============================================================
# Development
# ============================================================
dev:
	@echo "[*] Launching VelvetHyper Command Center..."
	cd $(UI_DIR) && npm run dev

run: dev

# ============================================================
# Code Quality
# ============================================================
lint:
	@echo "[*] Linting TypeScript..."
	cd $(UI_DIR) && npm run lint
	@echo "[*] Linting Python..."
	$(PYTHON) -m ruff check libs/ apps/

typecheck:
	@echo "[*] Type-checking TypeScript..."
	cd $(UI_DIR) && npm run typecheck

format:
	@echo "[*] Formatting TypeScript..."
	cd $(UI_DIR) && npm run format
	@echo "[*] Formatting Python..."
	$(PYTHON) -m ruff format libs/ apps/

test:
	@echo "[*] Running test suite..."
	$(PYTHON) -m pytest tests/ -v

# ============================================================
# Build & Release
# ============================================================
build-ui:
	@echo "[*] Packaging Portable Windows Executable..."
	cd $(UI_DIR) && npm run build:win

build-native:
	@echo "[*] Compiling Guest-side Stealth Payloads..."
	$(MAKE) -C $(NATIVE_DIR)

release:
	@echo "[*] Orchestrating new production release..."
	cd $(UI_DIR) && npm run release
	@echo "[*] Synchronizing release tags with GitHub..."
	git push --follow-tags origin main

# ============================================================
# Utilities
# ============================================================
harden:
	@echo "[*] Triggering manual hardening engine..."
ifndef VMX
	$(error VMX is not set. Usage: make harden VMX="path/to/your.vmx")
endif
	$(PYTHON) $(ENGINE_DIR)/harden.py "$(VMX)"

clean:
	@echo "[*] Performing forensic cleanup..."
	$(PYTHON) scripts/clean.py
	$(MAKE) -C $(NATIVE_DIR) clean

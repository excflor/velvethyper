# 📦 VelvetHyper Release Management

This project uses **Semantic Versioning (SemVer)** and follows the **Conventional Commits** specification for automated changelog generation and version bumping.

---

## 🏗️ Versioning Strategy
We use the `MAJOR.MINOR.PATCH` format:
- **MAJOR**: Breaking changes (e.g., core VMX engine rewrite).
- **MINOR**: New features (e.g., adding a new stealth phase).
- **PATCH**: Bug fixes or documentation tweaks.

---

## 🛠️ How to Release
When you are ready to publish a new version, follow these steps:

### 1. Tag a New Version
Run the following command in the `apps/desktop_ui` directory:
```bash
npm run release
```
This will:
1.  Analyze your commit history since the last release.
2.  Bump the version in `package.json`.
3.  Automatically update `CHANGELOG.md`.
4.  Create a local git tag (e.g., `v1.0.1`).

### 2. Push to GitHub
Push your code and the new tags to the repository:
```bash
git push --follow-tags
```

---

## 🤖 Automated Deployment
Once you push the tags, our **GitHub Actions** will automatically:
1.  Detect the new version tag.
2.  Build the **Portable Windows Executable**.
3.  Create a **GitHub Release** and attach the binary as a download.

---
*VelvetHyper: Automated Precision Deployment.*

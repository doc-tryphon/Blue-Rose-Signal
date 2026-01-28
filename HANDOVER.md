# 🚧 HANDOVER: Windows -> Garuda Linux

**Date**: 2026-01-27
**Status**: Mid-Sprint / Migration in progress
**Context**: Moving development from Windows to Garuda Linux.

## 🛑 Known Issue: Vercel Build Failure
**Error**: "No Next.js version detected."
**Cause**: The Next.js application is located in the `blue-rose-signal-next` subdirectory, not the root of the repository. Vercel is looking for `package.json` in the repo root and failing.

## 🛠️ Required Fix (Next Session)
When setting up the project on Vercel (or configuring the existing project):

1. Go to **Settings** > **General**.
2. Find the **Root Directory** section.
3. Change it from `./` (Root) to `blue-rose-signal-next`.
4. It should automatically detect Next.js after this change.

## 📋 Current Sprint Status
- **Secrets**: Scanned and Clean.
- **Dependencies**: `package.json` merge conflict resolved (kept local `next` version).
- **Code**: Pushed to `main`.

**Action Item**: Clone on Linux, `cd blue-rose-signal-next`, `npm install`, and resume work.

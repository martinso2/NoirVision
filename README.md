# NoirVision

A local AI dashboard for LLM and ComfyUI workflows. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

**Note:** Real LLM and ComfyUI integration are not wired yet; the app is a skeleton with placeholder UI and config.

## Main routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview: models path, ComfyUI path, system status (OK). |
| `/llm-console` | Two-panel layout: prompt input (left) and response area (right). Stub only. |
| `/comfyui-workflows` | Placeholder workflow list and “Connect to ComfyUI (stub)” area. |
| `/settings` | Read-only display of models and ComfyUI paths (configurable later). |

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ESLint**

## Commands

From `D:\AI\NoirVision`:

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production build locally
npm run start
```

## Git and GitHub

Repository: [martinso2/NoirVision](https://github.com/martinso2/NoirVision)

From `D:\AI\NoirVision`, run once to connect and push:

```bash
# Initialize Git (if not already)
git init

# First commit
git add .
git commit -m "Initial commit: Next.js + Tailwind"

# Set remote (use set-url if origin already exists)
git remote add origin https://github.com/martinso2/NoirVision.git
# If you get "remote origin already exists", run this instead:
# git remote set-url origin https://github.com/martinso2/NoirVision.git

git branch -M main
git push -u origin main
```

**If `git remote add origin` fails** (e.g. "remote origin already exists"), use:

```bash
git remote set-url origin https://github.com/martinso2/NoirVision.git
git branch -M main
git push -u origin main
```

## ComfyUI setup

NoirVision expects ComfyUI at `../ComfyUI` (relative to the project), e.g. `D:\AI\ComfyUI` when the project is at `D:\AI\NoirVision`.

### Option 1: Script (Windows PowerShell)

From the NoirVision root:

```powershell
.\scripts\setup-comfyui.ps1
```

This will:

- Clone [ComfyUI](https://github.com/comfyanonymous/ComfyUI) into `../ComfyUI` if it doesn’t exist (or `git pull` if it does).
- Create a Python virtual environment inside the ComfyUI folder.
- Run `pip install -r requirements.txt` in that venv.

**Requirements:** Git, Python 3.10+ on PATH. For GPU support you must install PyTorch (CUDA or ROCm) yourself before or after; see [ComfyUI manual install](https://docs.comfy.org/installation/manual_install).

### Option 2: Manual

1. **Clone ComfyUI** into the directory NoirVision uses (e.g. `D:\AI\ComfyUI`):

   ```bash
   cd D:\AI
   git clone https://github.com/comfyanonymous/ComfyUI.git
   ```

2. **Create a virtual environment and install dependencies:**

   ```bash
   cd ComfyUI
   python -m venv venv
   .\venv\Scripts\Activate.ps1   # Windows PowerShell
   pip install -r requirements.txt
   ```

3. **Optional – GPU (NVIDIA):** install PyTorch with CUDA, then re-run the pip step if needed:

   ```bash
   pip install torch torchvision torchaudio
   ```

   Or use [ComfyUI’s instructions](https://docs.comfy.org/installation/manual_install) for conda/CUDA versions.

4. **Run ComfyUI:**

   ```bash
   python main.py
   ```

5. If your ComfyUI folder is **not** at `../ComfyUI`, set the env var (e.g. in NoirVision `.env.local`):

   ```
   NOIRVISION_COMFYUI_DIR=D:\path\to\ComfyUI
   ```

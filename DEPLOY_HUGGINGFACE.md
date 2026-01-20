# fIndia AI - Hugging Face Spaces Deployment Guide

## Quick Deploy to Hugging Face Spaces

### 1. Create Space
- Go to: https://huggingface.co/new-space
- Name: `findia-ai`
- License: MIT
- SDK: **Docker**
- Hardware: CPU Basic (free)

### 2. Connect GitHub Repo
In Space settings:
- Go to "Files and versions" tab
- Click "Connect repository"
- Select: `thinbearr/fIndia-AI`
- Branch: `main`

### 3. Add Dockerfile
The `Dockerfile` in the root will be auto-detected.

### 4. Set Environment Variables
In Space settings → "Repository secrets":
```
NEWS_API_KEY=a171854e33a641cf9d57d3522a392cc6
PORT=7860
```

### 5. Deploy
- Space will build automatically
- Wait 5-10 minutes for model download + build
- Your API will be live at: `https://huggingface.co/spaces/YOUR_USERNAME/findia-ai`

### 6. Update Frontend
In Vercel, set environment variable:
```
VITE_API_URL=https://YOUR_USERNAME-findia-ai.hf.space
```

## Expected Build Time
- Git clone: ~1 min
- LFS download (439MB model): ~2-3 min
- Pip install: ~2 min
- **Total: ~5-7 minutes**

## Memory Usage
- Model size on disk: 439MB
- Runtime RAM usage: ~1.5GB
- Hugging Face free tier: 16GB RAM ✅
- **Will work perfectly**

## Testing
Once deployed, test:
```bash
curl https://YOUR_USERNAME-findia-ai.hf.space/health
```

Should return:
```json
{"status": "healthy", "timestamp": "..."}
```

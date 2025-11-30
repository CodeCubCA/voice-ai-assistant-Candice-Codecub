# Deployment Guide for Voice AI Assistant

## Deploy to Render

### 1. Prepare Your Repository
- Push your code to GitHub (make sure `.env` is NOT included - it's in `.gitignore`)
- Your API key will be added as an environment variable in Render

### 2. Create New Web Service on Render
1. Go to https://render.com and sign in
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Select the `Voice Ai Assistent` repository

### 3. Configure the Service
Render will auto-detect most settings from `render.yaml`, but verify:

- **Name**: `voice-ai-assistant` (or your choice)
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `streamlit run app.py --server.port $PORT --server.address 0.0.0.0`

### 4. Add Environment Variable
**CRITICAL**: Add your Gemini API key
1. In Render dashboard, go to **Environment**
2. Add environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (get a NEW one from https://aistudio.google.com/app/apikey)

### 5. Deploy
- Click **Create Web Service**
- Render will build and deploy your app
- You'll get a URL like: `https://voice-ai-assistant.onrender.com`

## Important Notes

- **Free tier**: Render's free tier spins down after inactivity (takes 30-60s to wake up)
- **HTTPS**: Your app will automatically have HTTPS
- **Microphone**: Browser microphone access requires HTTPS (which Render provides)
- **Logs**: Check logs in Render dashboard if something fails

## Start Command Breakdown
```bash
streamlit run app.py --server.port $PORT --server.address 0.0.0.0
```
- `--server.port $PORT`: Uses Render's assigned port
- `--server.address 0.0.0.0`: Allows external connections

## Local Testing
To test locally before deploying:
```bash
streamlit run app.py
```
Open http://localhost:8501

## Troubleshooting

### Build fails
- Check `requirements.txt` has all dependencies
- Check `packages.txt` for system dependencies

### App won't start
- Verify `GEMINI_API_KEY` is set in environment variables
- Check logs for specific errors

### Microphone doesn't work
- Ensure you're accessing via HTTPS (http:// won't allow microphone)
- Grant browser microphone permissions when prompted

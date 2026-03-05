## Apna Saathi – Speak With Your Loved Ones

Apna Saathi is a small web app that lets you talk to an AI that **speaks like a loved one in your local language**.  
You create a profile (name, relationship, language, personality, pet names, common phrases, and an optional voice recording), then chat with them via text and voice.

The app runs **fully on your machine**:

- **Frontend**: `index.html` + `static/app.js` + `static/style.css`
- **Backend**: `server.py` (Flask)
- **LLM (text brain)**: Sarvam-M by default, optionally **Gemini 1.5 Flash** if you provide a Gemini API key
- **Voice**:
  - **TTS (Suno button)**: Sarvam Bulbul
  - **STT (mic)**: Sarvam Saarika

---

## Project Structure

- `server.py` – Flask backend, proxies calls to Sarvam and (optionally) Gemini
- `requirements.txt` – Python dependencies
- `templates/index.html` – Main single-page UI
- `static/style.css` – Aesthetic dark/light responsive UI


---

## Prerequisites

- **Python** 3.10+ installed and on your PATH

- A Sarvam AI API key
- (Optional, but recommended for better text replies) a Gemini API key
- `pip` for installing Python packages

---

## Setup (Windows, PowerShell)

1. **Go to the project folder**

   ```powershell
   cd "C:\Users\Shikhar\OneDrive\Desktop\local"
   ```

2. **Install dependencies**

   ```powershell
   pip install -r requirements.txt
   ```

3. **Set your API keys in this terminal**

   Sarvam (required):

   ```powershell
   $env:SARVAM_API_KEY = "YOUR_SARVAM_API_KEY_HERE"
   ```

   Gemini (optional – enables higher-quality text answers using Gemini 1.5 Flash):

   ```powershell
   $env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"
   ```

   > These environment variables only live in the current terminal window.  
   > Whenever you open a new PowerShell window, set them again before running the server.

4. **Run the backend server**

   ```powershell
   python .\server.py
   ```


   You should see output similar to:

   ```text
   ==================================================
     Apna Saathi - Server Starting
     Open in browser: http://localhost:5000
   ==================================================
   * Running on http://127.0.0.1:5000
   ```

---

## How to Open and Use the App

1. **Open the website**

   After `python server.py` is running, open your browser and go to:

   ```text
   http://localhost:5000
   ```

2. **Create a loved-one profile**

   - Click **“Shuru Karein / Get Started”**
   - Step 1:
     - Enter **their name**
     - Choose **relationship** (mother, father, partner, friend, etc.)
     - Choose **language** (Hindi, Bangla, etc.)
     - Choose **voice type** (male/female)
   - Step 2:
     - Enter what they **call you** (pet name)
     - Choose **personality chips** (warm, funny, strict, etc.)
     - Add some **common phrases** they use
     - Add one line they always **repeat or believe in**
     - (Optional) Upload a **short voice recording** of them – the app will transcribe it and adapt their wording style.

3. **Start chatting**

   - Click **“Milao Unse ✦ / Meet Them ✦”**
   - Type a message in the input box and press **Enter** or click **Send**
   - The AI will now reply **in your selected language**, in the style of that loved one

4. **Hear their voice (TTS – “Suno”)**

   - Under any reply bubble, click **“Sunao / Play”**
   - The frontend calls `/api/tts`, which uses **Sarvam Bulbul** to generate audio and plays it in the browser

5. **Speak to them with your voice (STT)**

   - Click the **mic button**
   - Speak your message
   - When it stops, your speech is sent to `/api/stt` (Sarvam Saarika), transcribed, and dropped into the chat input box for you to send

---

## How the Models Are Used

- **Text replies**
  - If `GEMINI_API_KEY` is set:
    - `/api/chat` sends the system prompt + conversation to **Gemini 1.5 Flash (gemini-1.5-flash-latest)** for higher-quality, more natural answers.
    - If Gemini fails for any reason, it automatically **falls back** to **Sarvam-M**.
  - If `GEMINI_API_KEY` is not set:
    - `/api/chat` uses **Sarvam-M** directly via Sarvam’s chat-completion API.

- **Voice**
  - **Text → speech**: `/api/tts` → Sarvam **Bulbul v2**
  - **Speech → text**: `/api/stt` and `/api/transcribe_profile_audio` → Sarvam **Saarika v2.5**

All external calls happen in `server.py`; the browser only talks to your local Flask server, not directly to Sarvam or Gemini.

---

## Environment Variables Summary

Set these before running `server.py`:

- `SARVAM_API_KEY` – **required**, used for:
  - `/api/chat` (Sarvam fallback)
  - `/api/tts` (Bulbul)
  - `/api/stt` and `/api/transcribe_profile_audio` (Saarika)

- `GEMINI_API_KEY` – **optional**, used for:
  - `/api/chat` (primary text generation via Gemini 1.5 Flash)


Example (PowerShell):

```powershell
$env:SARVAM_API_KEY = "sk_XXXXXXXXXXXXXXXXXXXXXXXX"
$env:GEMINI_API_KEY = "AIzaSyXXXXXXXXXXXXXXXXXXXXX"
python .\server.py
```

---

## Pushing to GitHub

Once everything works locally:

1. Create a new GitHub repo (empty).
2. In your project folder:

   ```powershell
   git init
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git add .
   git commit -m "Initial commit: Apna Saathi local loved-one chat"
   git push -u origin main
   ```

> **Important:** Do **not** commit your actual API keys.  
> Only keep them in environment variables or in a local `.env` file that is ignored by `.gitignore`.


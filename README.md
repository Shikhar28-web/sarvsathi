# Apna Saathi

Apna Saathi is a Flask + vanilla JS web app for multilingual AI conversations with personalized personas.

You can:
- create a persona (name, relationship, language, personality, phrases, voice preference),
- chat over text,
- generate speech replies (TTS),
- transcribe user speech and profile audio (STT).

The app runs locally in your browser at `http://127.0.0.1:5000`.

## Current Project Structure

```text
sarvsathi/
   backend/
      server.py
      requirements.txt
   frontend/
      static/
         app.js
         style.css
         logo.png
      templates/
         index.html
   requirements.txt
   README.md
```

## Tech Stack

- Backend: Flask, Flask-CORS
- Frontend: HTML/CSS/JavaScript (no framework)
- LLM text generation:
   - Primary (optional): Gemini `gemini-2.5-flash`
   - Fallback/default: Sarvam `sarvam-m`
- Voice APIs:
   - TTS: Sarvam Bulbul (`bulbul:v2`)
   - STT: Sarvam Saarika (`saarika:v2.5`)

## Prerequisites

- Python 3.10+ (3.14 also works)
- Sarvam API key (required)
- Gemini API key (optional, enables Gemini for `/api/chat`)

## Setup

Run from the project root (`sarvsathi/`):

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

Create `.env` in project root:

```bash
cp .env.example .env
```

Then fill values like this:

```env
SARVAM_API_KEY=your_sarvam_key_here
GEMINI_API_KEY=your_gemini_key_here

# optional runtime settings
APP_HOST=127.0.0.1
APP_PORT=5000
FLASK_DEBUG=false
# CORS_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
```

Notes:
- `SARVAM_API_KEY` is mandatory.
- `GEMINI_API_KEY` is optional. If absent or Gemini fails, server falls back to Sarvam.

## Run

```bash
source .venv/bin/activate
cd backend
python server.py
```

Open `http://127.0.0.1:5000` in your browser.

## API Endpoints

- `POST /api/chat`
   - Input: `system`, `messages`
   - Uses Gemini (if configured), otherwise Sarvam chat completion.
- `POST /api/tts`
   - Input: `text`, `language_code`, `speaker`
   - Returns Base64 audio from Bulbul.
- `POST /api/stt`
   - Multipart input: `audio` + `language_code`
   - Returns transcript from Saarika.
- `POST /api/transcribe_profile_audio`
   - Multipart input: `audio` + `language_code`
   - Transcribes uploaded sample voice to help persona styling.

## Troubleshooting

- `ModuleNotFoundError` after activating venv:
   - Always install with `python -m pip ...` (not plain `pip3`).
   - Verify interpreter:
      - `which python3`
      - `python3 -c 'import sys; print(sys.executable)'`
   - Both should point inside `.venv/`.

- `externally-managed-environment` (macOS/Homebrew):
   - You are using system/Homebrew pip, not project venv pip.
   - Activate venv and run installs via `python -m pip`.

- Project folder renamed/moved and venv behaves oddly:
   - Recreate venv:
      - `mv .venv .venv_old`
      - `python3 -m venv .venv`
      - reinstall requirements.

## Security

- Do not commit real API keys.
- `.env` is gitignored by default.

## License

See `LICENSE`.


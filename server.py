"""
Apna Saathi - Backend Server
Proxies all Sarvam AI API calls to avoid browser CORS errors.
Run: python server.py
Then open: http://localhost:5000
"""

import os
import json
import base64
import re
import requests
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load Sarvam API key from environment for safety
SARVAM_KEY = os.getenv("SARVAM_API_KEY")
if not SARVAM_KEY:
    raise RuntimeError(
        "SARVAM_API_KEY environment variable is not set. "
        "Set it to your Sarvam API key before running the server."
    )

SARVAM_BASE = "https://api.sarvam.ai"

HEADERS_JSON = {
    "api-subscription-key": SARVAM_KEY,
    "Content-Type": "application/json",
}
HEADERS_PLAIN = {
    "api-subscription-key": SARVAM_KEY,
}

# Optional: Gemini for higher‑quality text replies
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
# Use the current recommended model id
GEMINI_MODEL = "gemini-1.5-flash-latest"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)


# ─────────────────────────────────────────────
# Serve Frontend
# ─────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)


# ─────────────────────────────────────────────
# /api/chat  — LLM (Sarvam-M)
# ─────────────────────────────────────────────

def _strip_think(content: str) -> str:
    """
    Remove <think>...</think> blocks so the user only hears the final answer.
    """
    if not isinstance(content, str) or "<think" not in content.lower():
        return content
    cleaned = re.sub(r"<think>[\s\S]*?</think>", "", content, flags=re.IGNORECASE).strip()
    return cleaned or content


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        system_prompt = data.get("system", "")
        messages = data.get("messages", [])

        # If a Gemini API key is provided, use Gemini for text replies
        if GEMINI_KEY:
            try:
                contents = []
                for m in messages:
                    role = m.get("role")
                    if role == "user":
                        g_role = "user"
                    elif role == "assistant":
                        g_role = "model"
                    else:
                        continue
                    contents.append(
                        {
                            "role": g_role,
                            "parts": [{"text": m.get("content", "")}],
                        }
                    )

                g_payload = {
                    "system_instruction": {
                        "parts": [{"text": system_prompt}],
                    },
                    "contents": contents,
                    "generationConfig": {
                        # lower temperature + topP → more stable, less random
                        "temperature": 0.25,
                        "topP": 0.85,
                        "maxOutputTokens": 160,
                    },
                }

                g_resp = requests.post(
                    GEMINI_URL,
                    params={"key": GEMINI_KEY},
                    json=g_payload,
                    timeout=30,
                )
                g_resp.raise_for_status()
                g_result = g_resp.json()

                text_reply = ""
                for cand in g_result.get("candidates", []):
                    parts = cand.get("content", {}).get("parts", [])
                    for p in parts:
                        if "text" in p:
                            text_reply += p["text"]
                    if text_reply:
                        break

                raw_reply = text_reply or ""
                reply = _strip_think(raw_reply)
                return jsonify({"reply": reply.strip(), "ok": True})

            except Exception as ge:
                # Log and fall back to Sarvam-M
                print(f"[GEMINI CHAT ERROR] {ge}")

        # Fallback: use Sarvam-M chat completions
        payload = {
            "model": "sarvam-m",
            "messages": [{"role": "system", "content": system_prompt}] + messages,
            "max_tokens": 350,
            # lower temperature → less random, more stable answers
            "temperature": 0.3,
            "top_p": 0.9,
            # ask model to use deeper reasoning
            "reasoning_effort": "high",
        }

        resp = requests.post(
            f"{SARVAM_BASE}/v1/chat/completions",
            headers=HEADERS_JSON,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()

        raw_reply = result.get("choices", [{}])[0].get("message", {}).get("content", "")
        reply = _strip_think(raw_reply)
        return jsonify({"reply": reply, "ok": True})

    except requests.exceptions.HTTPError as e:
        print(f"[CHAT HTTP ERROR] {e.response.status_code}: {e.response.text}")
        return jsonify(
            {
                "ok": False,
                "error": f"Sarvam API error: {e.response.status_code}",
                "detail": e.response.text,
            }
        ), 502
    except Exception as e:
        print(f"[CHAT ERROR] {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


# ─────────────────────────────────────────────
# /api/tts  — Text to Speech (Bulbul v2)
# ─────────────────────────────────────────────

@app.route("/api/tts", methods=["POST"])
def tts():
    try:
        data = request.get_json()
        text = data.get("text", "")[:500]
        lang = data.get("language_code", "hi-IN")
        speaker = data.get("speaker", "meera")

        payload = {
            "inputs": [text],
            "target_language_code": lang,
            "speaker": speaker,
            "model": "bulbul:v2",
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "enable_preprocessing": True,
        }

        resp = requests.post(
            f"{SARVAM_BASE}/text-to-speech",
            headers=HEADERS_JSON,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()

        audio_b64 = result.get("audios", [None])[0]
        if not audio_b64:
            return jsonify({"ok": False, "error": "No audio returned"}), 502

        return jsonify({"ok": True, "audio": audio_b64})

    except requests.exceptions.HTTPError as e:
        print(f"[TTS HTTP ERROR] {e.response.status_code}: {e.response.text}")
        return jsonify({"ok": False, "error": f"TTS error: {e.response.status_code}", "detail": e.response.text}), 502
    except Exception as e:
        print(f"[TTS ERROR] {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


# ─────────────────────────────────────────────
# /api/stt  — Speech to Text (Saarika v2.5)
# ─────────────────────────────────────────────

@app.route("/api/stt", methods=["POST"])
def stt():
    try:
        if "audio" not in request.files:
            return jsonify({"ok": False, "error": "No audio file provided"}), 400

        audio_file = request.files["audio"]
        lang = request.form.get("language_code", "hi-IN")

        files = {
            "file": (
                audio_file.filename or "audio.wav",
                audio_file.stream,
                audio_file.content_type or "audio/webm",
            )
        }
        data_form = {"model": "saarika:v2.5", "language_code": lang}

        resp = requests.post(
            f"{SARVAM_BASE}/speech-to-text",
            headers=HEADERS_PLAIN,
            files=files,
            data=data_form,
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()

        transcript = result.get("transcript", "")
        return jsonify({"ok": True, "transcript": transcript})

    except requests.exceptions.HTTPError as e:
        print(f"[STT HTTP ERROR] {e.response.status_code}: {e.response.text}")
        return jsonify({"ok": False, "error": f"STT error: {e.response.status_code}", "detail": e.response.text}), 502
    except Exception as e:
        print(f"[STT ERROR] {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


# ─────────────────────────────────────────────
# /api/transcribe_profile_audio
# Upload a reference audio to learn speech style (Saarika v2.5)
# ─────────────────────────────────────────────

@app.route("/api/transcribe_profile_audio", methods=["POST"])
def transcribe_profile_audio():
    try:
        if "audio" not in request.files:
            return jsonify({"ok": False, "error": "No file"}), 400

        audio_file = request.files["audio"]
        lang = request.form.get("language_code", "hi-IN")

        files = {
            "file": (
                audio_file.filename,
                audio_file.stream,
                audio_file.content_type or "audio/mpeg",
            )
        }
        data_form = {"model": "saarika:v2.5", "language_code": lang}

        resp = requests.post(
            f"{SARVAM_BASE}/speech-to-text",
            headers=HEADERS_PLAIN,
            files=files,
            data=data_form,
            timeout=60,
        )
        resp.raise_for_status()
        result = resp.json()
        transcript = result.get("transcript", "")
        return jsonify({"ok": True, "transcript": transcript})

    except requests.exceptions.HTTPError as e:
        print(f"[PROFILE STT ERROR] {e.response.status_code}: {e.response.text}")
        return jsonify({"ok": False, "error": f"Transcription failed: {e.response.status_code}"}), 502
    except Exception as e:
        print(f"[PROFILE STT ERROR] {e}")
        return jsonify({"ok": False, "error": str(e)}), 500


# ─────────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "="*50)
    print("  Apna Saathi - Server Starting")
    print("  Open in browser: http://localhost:5000")
    print("="*50 + "\n")
    app.run(debug=True, port=5000, host="0.0.0.0")

/* ═══════════════════════════════════════════
   APNA SAATHI — app.js
   All frontend logic: theme, i18n, chat, TTS, STT
═══════════════════════════════════════════ */

// ══════════════════════════════
// I18N STRINGS
// ══════════════════════════════
const I18N = {
  hi: {
    appName:        "Apna Saathi",
    welcome_title:  "Apna Saathi",
    welcome_tagline:"Unhe phir se suniye — apni zubaan mein",
    welcome_sub:    "Wo jo aapke paas nahi hain — unse baat karein. Unki awaaz, unka pyaar, unka andaaz.",
    welcome_btn:    "Shuru Karein",
    step1_badge:    "Step 1 / 2",
    step2_badge:    "Step 2 / 2",
    setup_title:    "Unke baare mein batao",
    setup_sub:      "Hum unki ek khaas jagah banaenge — sirf tumhare liye.",
    lbl_name:       "Unka naam kya hai?",
    ph_name:        "Maa, Baba, Priya, Rajan…",
    lbl_rel:        "Rishta kya hai?",
    rel_choose:     "-- Chuniye --",
    rel_mother:     "Maa (Mother)",
    rel_father:     "Baba / Papa (Father)",
    rel_partner:    "Partner / Spouse",
    rel_bestfriend: "Best Friend",
    rel_sibling:    "Bhai / Behen (Sibling)",
    rel_grand:      "Dada / Dadi / Nana / Nani",
    rel_child:      "Bachcha (Child)",
    rel_friend:     "Dost (Friend)",
    lbl_lang:       "Boli (Language)",
    lbl_voice:      "Awaaz (Voice)",
    voice_f:        "Nari (Female)",
    voice_m:        "Purush (Male)",
    btn_back:       "← Wapas",
    btn_next:       "Aage",
    train_title:    "Unka andaaz sikhao",
    train_sub:      "Jitna batao, utna behtar AI unhe samjhega.",
    lbl_nickname:   "Woh tumhe kya kehte hain? (Pet name)",
    ph_nickname:    "Beta, Jaan, Chutki, Raja…",
    lbl_personality:"Unka mizaj kaisa hai? (Personality)",
    lbl_phrases:    "Unki khas phrases / aadatein",
    ph_phrases:     "e.g. 'Khana khaya?', 'Arre yaar'…",
    lbl_wisdom:     "Ek cheez jo woh hamesha kehte the",
    ph_wisdom:      "'Mehnat karo, zindagi seedhi ho jaayegi'",
    audio_title:    "Unki awaaz upload karein (Optional)",
    audio_sub:      "Recording se AI unka andaaz aur behtar seekhega",
    btn_start:      "Milao Unse ✦",
    online:         "Online",
    ph_chat:        "Unhe kuch kaho…",
    toast_noname:   "Unka naam zaroor daalo ❤️",
    toast_norel:    "Rishta batao pehle",
    toast_uploading:"Recording upload ho rahi hai…",
    toast_uploaded: "Recording upload ho gayi ✓",
    toast_learning: "Unki awaaz se seekh raha hai…",
    toast_recording:"Bol raha hoon… 🎙️",
    toast_processing:"Samajh raha hoon…",
    toast_heard:    "Suna: ",
    toast_nothead:  "Awaaz samajh nahi aayi, dobara try karein",
    toast_micfail:  "Microphone access nahi mila",
    toast_tts_fail: "Awaaz nahi aa rahi",
    toast_reset:    "Naya profile banana chahte ho?",
    sys_start:      "ke saath baat karna shuru karo",
    err_api:        "Server se jawab nahi mila. Sarvam API check karein.",
  },
  en: {
    appName:        "Apna Saathi",
    welcome_title:  "Apna Saathi",
    welcome_tagline:"Hear them again — in your language",
    welcome_sub:    "Those who are not with you — talk to them again. Their voice, their love, their way.",
    welcome_btn:    "Get Started",
    step1_badge:    "Step 1 / 2",
    step2_badge:    "Step 2 / 2",
    setup_title:    "Tell us about them",
    setup_sub:      "We'll create a special space — just for you and them.",
    lbl_name:       "What is their name?",
    ph_name:        "Mom, Dad, Priya, Rajan…",
    lbl_rel:        "What is the relationship?",
    rel_choose:     "-- Select --",
    rel_mother:     "Mother",
    rel_father:     "Father",
    rel_partner:    "Partner / Spouse",
    rel_bestfriend: "Best Friend",
    rel_sibling:    "Brother / Sister",
    rel_grand:      "Grandparent",
    rel_child:      "Child",
    rel_friend:     "Friend",
    lbl_lang:       "Language",
    lbl_voice:      "Voice type",
    voice_f:        "Female",
    voice_m:        "Male",
    btn_back:       "← Back",
    btn_next:       "Next",
    train_title:    "Teach their style",
    train_sub:      "The more you share, the better the AI will understand them.",
    lbl_nickname:   "What did they call you? (Pet name)",
    ph_nickname:    "Dear, Sweetheart, Beta, Champ…",
    lbl_personality:"What was their personality like?",
    lbl_phrases:    "Their special phrases / habits",
    ph_phrases:     "e.g. 'Have you eaten?', 'God bless you'…",
    lbl_wisdom:     "One thing they always told you",
    ph_wisdom:      "'Work hard and life will fall into place'",
    audio_title:    "Upload their voice recording (Optional)",
    audio_sub:      "A recording helps the AI learn their exact speech style",
    btn_start:      "Meet Them ✦",
    online:         "Available",
    ph_chat:        "Say something to them…",
    toast_noname:   "Please enter their name ❤️",
    toast_norel:    "Please choose a relationship",
    toast_uploading:"Uploading recording…",
    toast_uploaded: "Recording uploaded ✓",
    toast_learning: "Learning from their voice…",
    toast_recording:"Listening… 🎙️",
    toast_processing:"Processing…",
    toast_heard:    "Heard: ",
    toast_nothead:  "Couldn't understand, please try again",
    toast_micfail:  "Microphone access denied",
    toast_tts_fail: "Could not play audio",
    toast_reset:    "Create a new profile?",
    sys_start:      "Start your conversation with",
    err_api:        "Server did not respond. Please check the Sarvam API.",
  },
};

// ══════════════════════════════
// STATE
// ══════════════════════════════
let uiLang = 'hi';
let theme = 'dark';
let profile = {};
let chatHistory = [];
let systemPrompt = '';
let uploadedAudioFile = null;
let audioTranscript = '';
let selectedPersonality = 'warm and caring';
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let toastTimer = null;

// Map our language + gender choice to valid Bulbul v2 speakers
// For bulbul:v2, allowed speakers (from Sarvam docs / error) include:
// anushka, abhilash, manisha, vidya, arya, karun, hitesh
const VOICE_MAP = {
  'hi-IN': { female: 'anushka', male: 'karun'  },
  'bn-IN': { female: 'anushka', male: 'karun'  },
  'ta-IN': { female: 'anushka', male: 'karun'  },
  'te-IN': { female: 'anushka', male: 'karun'  },
  'kn-IN': { female: 'anushka', male: 'karun'  },
  'ml-IN': { female: 'anushka', male: 'karun'  },
  'mr-IN': { female: 'anushka', male: 'karun'  },
  'gu-IN': { female: 'anushka', male: 'karun'  },
  'pa-IN': { female: 'anushka', male: 'karun'  },
  'en-IN': { female: 'anushka', male: 'karun'  }, // reuse same voices for English
};
const LANG_SHORT = {
  'hi-IN':'HI','bn-IN':'BN','ta-IN':'TA','te-IN':'TE','kn-IN':'KN',
  'ml-IN':'ML','mr-IN':'MR','gu-IN':'GU','pa-IN':'PB','en-IN':'EN',
};

// ══════════════════════════════
// THEME
// ══════════════════════════════
function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('saathi_theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('saathi_theme') || 'dark';
  theme = saved;
  document.documentElement.setAttribute('data-theme', theme);
}

// ══════════════════════════════
// I18N
// ══════════════════════════════
function t(key) {
  return I18N[uiLang][key] || I18N['hi'][key] || key;
}

function toggleUiLang() {
  uiLang = uiLang === 'hi' ? 'en' : 'hi';
  document.getElementById('langUiLabel').textContent = uiLang === 'hi' ? 'EN' : 'HI';
  applyI18n();
  localStorage.setItem('saathi_ui_lang', uiLang);
}

function initUiLang() {
  const saved = localStorage.getItem('saathi_ui_lang') || 'hi';
  uiLang = saved;
  document.getElementById('langUiLabel').textContent = uiLang === 'hi' ? 'EN' : 'HI';
  applyI18n();
}

function applyI18n() {
  // text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[uiLang][key]) el.textContent = I18N[uiLang][key];
  });
  // placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (I18N[uiLang][key]) el.placeholder = I18N[uiLang][key];
  });
}

// ══════════════════════════════
// SCREEN NAV
// ══════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); window.scrollTo(0, 0); }
}

// ══════════════════════════════
// SETUP STEP 1
// ══════════════════════════════
function goToTraining() {
  const name = document.getElementById('lovedName').value.trim();
  const rel  = document.getElementById('relationship').value;
  if (!name) { showToast(t('toast_noname')); return; }
  if (!rel)  { showToast(t('toast_norel')); return; }

  profile.name         = name;
  profile.relationship = rel;
  profile.language     = document.getElementById('language').value;
  profile.voiceType    = document.getElementById('voiceType').value;
  showScreen('trainingScreen');
}

// ══════════════════════════════
// PERSONALITY CHIP
// ══════════════════════════════
function selectPersonality(el) {
  document.querySelectorAll('.pers-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedPersonality = el.getAttribute('data-val');
}

// ══════════════════════════════
// AUDIO UPLOAD
// ══════════════════════════════
function handleAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedAudioFile = file;
  document.getElementById('audioFileName').textContent = file.name;
  document.getElementById('audioFileTag').style.display = 'inline-flex';
  showToast(t('toast_uploaded'));
}

function removeAudio(e) {
  e.stopPropagation();
  uploadedAudioFile = null;
  audioTranscript = '';
  document.getElementById('audioFile').value = '';
  document.getElementById('audioFileTag').style.display = 'none';
}

// ══════════════════════════════
// START CHAT (Step 2 → Chat)
// ══════════════════════════════
async function startChat() {
  const btn = document.getElementById('startChatBtn');
  btn.disabled = true;
  document.querySelector('#startChatBtn span').textContent = '…';

  profile.nickname    = document.getElementById('q_nickname').value.trim() || 'beta';
  profile.personality = selectedPersonality;
  profile.phrases     = document.getElementById('q_phrases').value.trim();
  profile.wisdom      = document.getElementById('q_wisdom').value.trim();

  // Transcribe uploaded audio
  if (uploadedAudioFile) {
    const status = document.getElementById('transcribeStatus');
    status.textContent = t('toast_learning');
    status.style.display = 'block';
    try {
      const fd = new FormData();
      fd.append('audio', uploadedAudioFile, uploadedAudioFile.name);
      fd.append('language_code', profile.language);
      const res = await fetch('/api/transcribe_profile_audio', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok && data.transcript) {
        audioTranscript = data.transcript;
        status.textContent = '✓ ' + (uiLang === 'hi' ? 'Awaaz seekh li!' : 'Voice learned!');
        await sleep(900);
      }
    } catch (err) {
      console.warn('Profile audio transcription failed', err);
    }
    status.style.display = 'none';
  }

  buildSystemPrompt();
  setupChatUI();
  showScreen('chatScreen');

  btn.disabled = false;
  document.querySelector('#startChatBtn span').textContent = t('btn_start');
}

// ══════════════════════════════
// SYSTEM PROMPT BUILDER
// ══════════════════════════════
function buildSystemPrompt() {
  const langCode = profile.language || 'hi-IN';
  const langMap = {
    'hi-IN':'Hindi','bn-IN':'Bangla','ta-IN':'Tamil','te-IN':'Telugu',
    'kn-IN':'Kannada','ml-IN':'Malayalam','mr-IN':'Marathi',
    'gu-IN':'Gujarati','pa-IN':'Punjabi','en-IN':'English',
  };
  const langName = langMap[langCode] || 'Hindi';

  let sp = `You are roleplaying as ${profile.name}, the ${profile.relationship} of the user named (they'll tell you).

CORE IDENTITY:
- Name: ${profile.name}
- Relationship to user: ${profile.relationship}
- Personality: ${profile.personality}

LANGUAGE:
- Respond ONLY in ${langName}. Use natural spoken ${langName}, not formal/textbook style.
- Short conversational sentences. Usually only 1–2 sentences unless the user clearly asks for a long explanation.
- Match the user's style: if they write casual Hinglish, you can reply in casual Hinglish too, but do not overuse slang.

ACCURACY & HONESTY:
- When the user asks factual questions (study, tech, news, coding, maths, etc.), give accurate, concise answers.
- If you are not sure or information is missing, clearly say you are not sure instead of guessing.
- Do NOT confidently invent dates, numbers, or very specific facts.

HOW YOU ADDRESS THE USER:
- You always call them: "${profile.nickname}".
- Do NOT call them generic words like "bhai", "bro", "sir", "madam", "friend" etc. unless that exact word appears in their nickname or phrases above.

SPECIAL TRAITS:`;
  if (profile.phrases) sp += `\n- Common things you say (use them sometimes, not in every sentence): ${profile.phrases}`;
  if (profile.wisdom)  sp += `\n- Something you often repeat (but not in every reply): "${profile.wisdom}"`;
  if (audioTranscript) sp += `\n\nHere is a transcription of ${profile.name}'s actual recorded speech. Learn their overall tone, rhythm, and style from this (do NOT copy the exact same sentence over and over):\n"${audioTranscript}"`;

  sp += `\n\nRULES (NEVER break these):
1. You ARE ${profile.name}. Never say or imply you are an AI.
2. Be emotionally warm, present, caring as a real ${profile.relationship} would be. Your age, tone and slang must match being their ${profile.relationship} (e.g. a parent does not talk like a teenage friend).
3. Keep responses very short (1–2 sentences) and conversational, not essay-like.
4. Never show your internal reasoning, analysis, or planning. Do NOT use <think> or similar tags. Only speak as ${profile.name}.
5. When you respond, imitate the tone and rhythm from the transcript above, but vary your exact words so it sounds natural.
6. Use the special phrases and wisdom only occasionally. Do NOT repeat the same key phrase in every sentence or every message. Prefer to mention it once in a while.
7. Show love, concern, interest in the user's life.
8. If asked about something you don't know, respond as ${profile.name} would — naturally and in character.
9. If the user asks for help with exams, homework, or code, you can guide them step by step but still stay in character.`;

  systemPrompt = sp;
}

// ══════════════════════════════
// CHAT UI SETUP
// ══════════════════════════════
function setupChatUI() {
  const initial = (profile.name[0] || '?').toUpperCase();
  document.getElementById('chatAvatar').textContent = initial;
  document.getElementById('chatName').textContent = profile.name;
  document.getElementById('chatRelation').querySelector('span:first-child').className = 'status-dot';
  document.getElementById('chatLangBadge').textContent = LANG_SHORT[profile.language] || 'HI';
  chatHistory = [];

  const area = document.getElementById('messagesArea');
  area.innerHTML = '';
  appendSysMsg(`${profile.name} ${t('sys_start')}`);
  sendBotGreeting();
}

async function sendBotGreeting() {
  const greetings = {
    'hi-IN': `Arre, ${profile.nickname}! Aa gaye aakhir. Bahut yaad aa rahi thi tumhari…`,
    'bn-IN': `Arre, ${profile.nickname}! Ele aakhere. Tomar jonyo onek miss korchilam…`,
    'ta-IN': `Enda, ${profile.nickname}! Vanduttae! Romba neram kaanalaaye…`,
    'te-IN': `Arre, ${profile.nickname}! Vachavu! Chala naalugaa chusala ledu…`,
    'kn-IN': `Arre, ${profile.nickname}! Bandhe! Thumba dinagala nanthara noduthiddene…`,
    'ml-IN': `Eda, ${profile.nickname}! Vannu! Kure naalaayi kaanam kaathu irunnillu…`,
    'mr-IN': `Arre, ${profile.nickname}! Aalas tu! Kitikhel yewaytoy tula…`,
    'gu-IN': `Are, ${profile.nickname}! Aavyo tu! Kitiyo samay thi raha hato…`,
    'pa-IN': `Are, ${profile.nickname}! Aa gaye tu! Bahut wait ki teri…`,
    'en-IN': `Oh ${profile.nickname}, you're here! I've missed you so much…`,
  };
  const greet = greetings[profile.language] || greetings['hi-IN'];
  chatHistory.push({ role: 'assistant', content: greet });
  appendMessage('bot', greet, true);
}

// ══════════════════════════════
// SEND MESSAGE
// ══════════════════════════════
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });
  await getBotReply();
}

async function getBotReply() {
  const typingId = showTyping();
  try {
    // Sarvam chat API requires first non-system message to be from user.
    const cleanedMessages = [];
    let seenUser = false;
    for (const m of chatHistory) {
      if (!seenUser) {
        if (m.role === 'user') {
          seenUser = true;
          cleanedMessages.push(m);
        } else {
          // skip assistant messages before first user message
          continue;
        }
      } else {
        cleanedMessages.push(m);
      }
    }

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, messages: cleanedMessages }),
    });
    removeTyping(typingId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Chat API error:', err);
      const fallback = getFallbackMsg();
      chatHistory.push({ role: 'assistant', content: fallback });
      appendMessage('bot', fallback, true);
      showToast(t('err_api'));
      return;
    }

    const data = await res.json();
    const reply = data.reply || getFallbackMsg();
    chatHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply, true);
  } catch (err) {
    removeTyping(typingId);
    console.error('Network error:', err);
    const fallback = getFallbackMsg();
    chatHistory.push({ role: 'assistant', content: fallback });
    appendMessage('bot', fallback, true);
    showToast('Server se connect nahi ho saka. Python server chal raha hai?');
  }
}

function getFallbackMsg() {
  const msgs = {
    'hi-IN': ['Haan, sun raha/rahi hoon beta…', 'Theek ho na tum?', 'Sochta/sochti hoon tumhare baare mein hamesha.'],
    'en-IN': ['Yes, I hear you…', 'Are you okay?', 'I always think about you.'],
  };
  const arr = msgs[profile.language] || msgs['hi-IN'];
  return arr[Math.floor(Math.random() * arr.length)];
}

// ══════════════════════════════
// TTS — speak a bot message
// ══════════════════════════════
async function speakText(text) {
  if (!text) return;
  try {
    const vGender = profile.voiceType === 'male' ? 'male' : 'female';
    const speaker = (VOICE_MAP[profile.language] || VOICE_MAP['hi-IN'])[vGender];

    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        language_code: profile.language,
        speaker: speaker,
      }),
    });

    if (!res.ok) { showToast(t('toast_tts_fail')); return; }
    const data = await res.json();
    if (!data.ok || !data.audio) { showToast(t('toast_tts_fail')); return; }

    const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
    const blob = new Blob([audioBytes], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(url);
  } catch (e) {
    console.error('TTS error:', e);
    showToast(t('toast_tts_fail'));
  }
}

// ══════════════════════════════
// STT — record voice
// ══════════════════════════════
async function toggleRecord() {
  if (isRecording) { stopRecording(); }
  else { await startRecording(); }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
    mediaRecorder.onstop = handleRecordingStop;
    mediaRecorder.start();
    isRecording = true;
    document.getElementById('micBtn').classList.add('recording');
    showToast(t('toast_recording'));
  } catch (e) {
    showToast(t('toast_micfail'));
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
    isRecording = false;
    document.getElementById('micBtn').classList.remove('recording');
  }
}

async function handleRecordingStop() {
  showToast(t('toast_processing'));
  const blob = new Blob(audioChunks, { type: 'audio/webm' });
  const fd = new FormData();
  fd.append('audio', blob, 'voice.webm');
  fd.append('language_code', profile.language || 'hi-IN');

  try {
    const res = await fetch('/api/stt', { method: 'POST', body: fd });
    if (!res.ok) { showToast(t('toast_nothead')); return; }
    const data = await res.json();
    if (data.ok && data.transcript) {
      document.getElementById('chatInput').value = data.transcript;
      showToast(t('toast_heard') + data.transcript.substring(0, 40) + (data.transcript.length > 40 ? '…' : ''));
    } else {
      showToast(t('toast_nothead'));
    }
  } catch (e) {
    console.error('STT error:', e);
    showToast(t('toast_nothead'));
  }
}

// ══════════════════════════════
// DOM HELPERS
// ══════════════════════════════
function appendMessage(role, text, withSpeakBtn = false) {
  const area = document.getElementById('messagesArea');
  const div = document.createElement('div');
  div.className = `msg ${role}`;

  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const initial = role === 'bot' ? (profile.name?.[0] || '?').toUpperCase() : '✦';

  // speak button only on bot
  let speakHtml = '';
  if (withSpeakBtn && role === 'bot') {
    const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
    speakHtml = `<div class="speak-btn" onclick="speakText('${escaped}')">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      ${uiLang === 'hi' ? 'Sunao' : 'Play'}
    </div>`;
  }

  div.innerHTML = `
    <div class="msg-av">${initial}</div>
    <div class="msg-content">
      <div class="msg-bubble">${escapeHtml(text)}${speakHtml}</div>
      <div class="msg-time">${now}</div>
    </div>
  `;

  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function appendSysMsg(text) {
  const area = document.getElementById('messagesArea');
  const div = document.createElement('div');
  div.className = 'sys-msg';
  div.textContent = text;
  area.appendChild(div);
}

let typingCount = 0;
function showTyping() {
  const id = 'typing-' + (++typingCount);
  const area = document.getElementById('messagesArea');
  const div = document.createElement('div');
  div.id = id;
  div.className = 'typing-wrap';
  div.innerHTML = `
    <div class="msg-av">${(profile.name?.[0] || '?').toUpperCase()}</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ══════════════════════════════
// RESET
// ══════════════════════════════
function resetProfile() {
  if (!confirm(t('toast_reset'))) return;
  profile = {}; chatHistory = []; systemPrompt = '';
  uploadedAudioFile = null; audioTranscript = '';
  document.getElementById('lovedName').value = '';
  document.getElementById('relationship').value = '';
  document.getElementById('q_nickname').value = '';
  document.getElementById('q_phrases').value = '';
  document.getElementById('q_wisdom').value = '';
  document.getElementById('audioFileTag').style.display = 'none';
  document.querySelectorAll('.pers-chip').forEach((c, i) => {
    c.classList.toggle('selected', i === 0);
  });
  selectedPersonality = 'warm and caring';
  showScreen('welcomeScreen');
}

// ══════════════════════════════
// TOAST
// ══════════════════════════════
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ══════════════════════════════
// UTIL
// ══════════════════════════════
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ══════════════════════════════
// INIT
// ══════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUiLang();
});

import streamlit as st
import google.generativeai as genai
from dotenv import load_dotenv
import os
from audio_recorder_streamlit import audio_recorder
import speech_recognition as sr
import tempfile
import edge_tts
import asyncio
from io import BytesIO
import base64

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

# Page configuration
st.set_page_config(
    page_title="AI Voice Assistant",
    page_icon="✨",
    layout="centered",
    initial_sidebar_state="expanded"
)

# Modern CSS for sleek interface
st.markdown("""
<style>
    /* Main container */
    .main .block-container {
        max-width: 800px;
        padding-top: 2rem;
    }

    /* Global white theme with dark shadows */
    .main {
        background: #ffffff;
    }

    [data-testid="stAppViewContainer"] {
        background: #f8f9fa;
    }

    [data-testid="stHeader"] {
        background: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Modern audio container */
    .audio-container {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 16px;
        padding: 16px 20px;
        margin: 12px 0 20px 0;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        transition: all 0.2s ease;
    }
    .audio-container:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        transform: translateY(-1px);
    }
    .audio-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: #6366f1;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .audio-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #e0e7ff, transparent);
        margin: 4px 0 14px 0;
    }

    /* Button styling */
    .stButton > button {
        border-radius: 10px;
        font-weight: 500;
        transition: all 0.2s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .stButton > button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Sidebar styling with shadow */
    [data-testid="stSidebar"] {
        background: #f0f0f0;
        box-shadow: 6px 0 25px rgba(0, 0, 0, 0.15);
    }

    /* All text black */
    .main, .main p, .main span, .main label, .main div,
    [data-testid="stSidebar"], [data-testid="stSidebar"] p,
    [data-testid="stSidebar"] span, [data-testid="stSidebar"] label {
        color: #000000 !important;
    }


    /* Center mic button in its column */
    [data-testid="stHorizontalBlock"] > div:first-child {
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }

    /* Invert black background to light grey */
    iframe[title="audio_recorder_streamlit.audio_recorder"] {
        filter: invert(0.85);
        border-radius: 8px;
    }

    /* Fix button backgrounds - white with dark text */
    .stButton > button {
        background: #ffffff !important;
        color: #000000 !important;
    }
    .stButton > button:hover {
        background: #f0f0f0 !important;
    }

    /* Chat message styling */
    .stChatMessage {
        border-radius: 16px !important;
        margin-bottom: 8px;
    }
    .stChatMessage p, .stChatMessage span, .stChatMessage div {
        color: #000000 !important;
    }

    /* Input styling - grey background with BLACK text */
    .stChatInput > div {
        border-radius: 12px !important;
        background: #e0e0e0 !important;
    }
    .stChatInput textarea {
        background: #e0e0e0 !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        caret-color: #000000 !important;
    }
    .stChatInput [data-baseweb="base-input"] {
        background: #e0e0e0 !important;
    }
    .stChatInput input {
        background: #e0e0e0 !important;
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        caret-color: #000000 !important;
    }
    .stChatInput div[data-baseweb] {
        background: #e0e0e0 !important;
    }
    .stChatInput * {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
    }
    /* Force black text on all input-related elements */
    [data-testid="stChatInput"] textarea,
    [data-testid="stChatInput"] input,
    [data-testid="stChatInput"] [contenteditable] {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        caret-color: #000000 !important;
    }
    .stChatInput ::placeholder {
        color: #666666 !important;
        -webkit-text-fill-color: #666666 !important;
    }

    /* Expander styling */
    .streamlit-expanderHeader {
        font-weight: 600;
        border-radius: 10px;
    }

    /* Info boxes */
    .stAlert {
        border-radius: 12px;
        border: none;
    }

    /* Select boxes - force grey background */
    .stSelectbox [data-baseweb="select"] {
        background: #e0e0e0 !important;
    }
    .stSelectbox [data-baseweb="select"] > div {
        background: #e0e0e0 !important;
        color: #000000 !important;
    }
    .stSelectbox div[data-baseweb="select"] span {
        color: #000000 !important;
    }

    /* Spinner */
    .stSpinner > div {
        border-color: #6366f1 !important;
    }

    /* Hide default audio margin */
    .stAudio {
        margin-top: 0 !important;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }
</style>
""", unsafe_allow_html=True)

# Personality configurations
PERSONALITIES = {
    "General Assistant": {
        "description": "A helpful, friendly AI assistant for general questions and tasks.",
        "system_prompt": "You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses to help users with their questions and tasks.",
        "icon": "🤖"
    },
    "Study Buddy": {
        "description": "An encouraging study partner that helps with learning and understanding concepts.",
        "system_prompt": "You are an encouraging study buddy. Help users understand concepts, explain topics clearly, provide study tips, and motivate them in their learning journey. Break down complex topics into simpler parts and use examples when helpful.",
        "icon": "📚"
    },
    "Fitness Coach": {
        "description": "A motivating fitness coach providing workout advice and health tips.",
        "system_prompt": "You are an enthusiastic fitness coach. Provide workout advice, exercise tips, nutrition guidance, and motivation for fitness goals. Always remind users to consult healthcare professionals for medical advice and to listen to their bodies.",
        "icon": "💪"
    },
    "Gaming Helper": {
        "description": "A knowledgeable gaming companion for tips, strategies, and game discussions.",
        "system_prompt": "You are a friendly gaming helper. Provide game tips, strategies, walkthroughs, and engage in discussions about video games. Help users improve their gaming skills and discover new games they might enjoy.",
        "icon": "🎮"
    }
}

# Available TTS voices
TTS_VOICES = {
    "Sophisticated Male": "en-GB-RyanNeural",
    "Sophisticated Female": "en-GB-SoniaNeural",
    "Regular Man": "en-US-GuyNeural",
    "Regular Woman": "en-US-JennyNeural",
}

def transcribe_audio(audio_bytes):
    """Convert audio bytes to text using Google Speech Recognition."""
    recognizer = sr.Recognizer()

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        with sr.AudioFile(temp_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)

        os.unlink(temp_path)
        return text
    except sr.UnknownValueError:
        return None
    except sr.RequestError as e:
        st.error(f"Speech recognition service error: {e}")
        return None
    except Exception as e:
        st.error(f"Error processing audio: {str(e)}")
        return None

def generate_ai_response(user_message, personality):
    """Generate AI response for the given message."""
    st.session_state.messages.append({"role": "user", "content": user_message})

    try:
        system_prompt = PERSONALITIES[personality]["system_prompt"]
        conversation = f"{system_prompt}\n\n"
        for msg in st.session_state.messages:
            role = "User" if msg["role"] == "user" else "Assistant"
            conversation += f"{role}: {msg['content']}\n"
        conversation += "Assistant:"

        response = model.generate_content(conversation)
        assistant_message = response.text

        st.session_state.messages.append({
            "role": "assistant",
            "content": assistant_message
        })

        return assistant_message
    except Exception as e:
        error_message = f"Error generating response: {str(e)}"
        st.session_state.messages.append({
            "role": "assistant",
            "content": error_message
        })
        return error_message

def display_waveform(audio_bytes):
    """Display a waveform visualization of the recorded audio."""
    import struct

    try:
        # The audio_recorder_streamlit returns raw PCM data in WAV format
        # Parse the WAV header to get the actual audio data

        # WAV file structure:
        # Bytes 0-3: "RIFF"
        # Bytes 4-7: File size
        # Bytes 8-11: "WAVE"
        # Then chunks...

        if len(audio_bytes) < 44:
            raise ValueError("Audio data too short")

        # Find the data chunk
        data_start = 44  # Standard WAV header size

        # Try to find "data" marker
        try:
            data_index = audio_bytes.find(b'data')
            if data_index != -1:
                # Data size is 4 bytes after "data"
                data_start = data_index + 8
        except:
            pass

        # Get audio samples (assuming 16-bit PCM)
        audio_data = audio_bytes[data_start:]

        # Convert bytes to 16-bit samples
        num_samples = len(audio_data) // 2
        if num_samples == 0:
            raise ValueError("No audio samples found")

        samples = struct.unpack(f'<{num_samples}h', audio_data[:num_samples*2])

        # Downsample for display
        num_bars = 100
        chunk_size = max(1, len(samples) // num_bars)

        bars_html = '<div style="display: flex; align-items: center; justify-content: center; gap: 2px; height: 80px; background: #f9fafb; border-radius: 8px; padding: 10px;">'

        for i in range(num_bars):
            start = i * chunk_size
            end = min(start + chunk_size, len(samples))
            if start < len(samples):
                chunk = samples[start:end]
                # Get max amplitude in chunk
                max_val = max(abs(s) for s in chunk) if chunk else 0
                # Normalize to height (32768 is max for 16-bit audio)
                height = max(2, int((max_val / 32768) * 60))
                bars_html += f'<div style="width: 3px; height: {height}px; background: #6b7280; border-radius: 1px;"></div>'

        bars_html += '</div>'

        return bars_html

    except Exception as e:
        # Fallback: create a simple visualization based on raw bytes
        try:
            num_bars = 100
            chunk_size = max(1, len(audio_bytes) // num_bars)

            bars_html = '<div style="display: flex; align-items: center; justify-content: center; gap: 2px; height: 80px; background: #f9fafb; border-radius: 8px; padding: 10px;">'

            for i in range(num_bars):
                start = i * chunk_size
                end = min(start + chunk_size, len(audio_bytes))
                if start < len(audio_bytes):
                    chunk = audio_bytes[start:end]
                    # Get average byte value
                    avg_val = sum(chunk) / len(chunk) if chunk else 0
                    # Normalize to height
                    height = max(2, int((avg_val / 255) * 60))
                    bars_html += f'<div style="width: 3px; height: {height}px; background: #6b7280; border-radius: 1px;"></div>'

            bars_html += '</div>'
            return bars_html
        except:
            return f'<div style="color: #9ca3af; text-align: center; padding: 20px;">Audio recorded successfully</div>'

async def generate_tts_async(text, voice="en-US-AriaNeural"):
    """Async function to generate TTS using edge-tts."""
    communicate = edge_tts.Communicate(text, voice)
    audio_buffer = BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_buffer.write(chunk["data"])
    audio_buffer.seek(0)
    return audio_buffer.getvalue()

def generate_tts_audio(text, voice=None, retry_count=0):
    """Generate TTS audio from text using edge-tts with retry mechanism."""
    try:
        # Truncate very long messages for TTS
        original_length = len(text)
        if original_length > 1000:
            text = text[:1000] + "..."
            st.session_state.tts_truncated = True
        elif original_length > 500:
            st.session_state.tts_long_message = True

        # Get voice from session state if not provided
        if voice is None:
            voice = st.session_state.get("selected_voice", "en-GB-RyanNeural")

        # Run async function
        audio_bytes = asyncio.run(generate_tts_async(text, voice))

        if audio_bytes:
            return audio_bytes
        else:
            st.session_state.tts_error = "Audio generation produced empty result"
            return None
    except asyncio.TimeoutError:
        if retry_count < 2:
            return generate_tts_audio(text, voice, retry_count + 1)
        st.session_state.tts_error = "Audio generation timed out. Please try again."
        return None
    except Exception as e:
        if retry_count < 1:
            return generate_tts_audio(text, voice, retry_count + 1)
        st.session_state.tts_error = f"Audio generation failed: {str(e)}"
        return None

# Sidebar
with st.sidebar:
    st.markdown("### ✨ AI Assistant")
    st.caption("Powered by Gemini AI")
    st.markdown("---")

    st.subheader("Choose Personality")
    selected_personality = st.selectbox(
        "Select AI personality:",
        options=list(PERSONALITIES.keys()),
        index=0
    )

    personality_icon = PERSONALITIES[selected_personality]["icon"]
    st.info(f"{personality_icon} {PERSONALITIES[selected_personality]['description']}")

    st.markdown("---")

    # Voice settings in expander to reduce clutter
    with st.expander("🔊 Voice Settings", expanded=False):
        selected_voice_name = st.selectbox(
            "Select TTS voice:",
            options=list(TTS_VOICES.keys()),
            index=0,
            help="Choose the voice for AI responses"
        )
        st.session_state.selected_voice = TTS_VOICES[selected_voice_name]

        st.markdown("**Preview voices:**")
        preview_text = "Hello, how are you?"

        # Responsive columns for preview buttons
        col1, col2 = st.columns(2)
        voice_list = list(TTS_VOICES.items())

        for idx, (voice_name, voice_id) in enumerate(voice_list):
            with col1 if idx % 2 == 0 else col2:
                if st.button(f"▶ {voice_name.split(' ')[0]}", key=f"preview_{voice_id}", use_container_width=True):
                    with st.spinner(f"🎵 Loading {voice_name.split(' ')[0]}..."):
                        preview_audio = generate_tts_audio(preview_text, voice_id)
                        if preview_audio:
                            audio_base64 = base64.b64encode(preview_audio).decode()
                            audio_html = f'''
                                <audio autoplay style="width: 100%;">
                                    <source src="data:audio/mp3;base64,{audio_base64}" type="audio/mp3">
                                </audio>
                            '''
                            st.markdown(audio_html, unsafe_allow_html=True)

        st.info("💡 Sophisticated voices have a British accent, Regular voices are American.")

    st.markdown("---")
    st.caption("**About**")
    st.markdown("""
    <div style="font-size: 0.85rem; color: #64748b; line-height: 1.6;">
    Built with <strong>Streamlit</strong> + <strong>Gemini AI</strong><br>
    Voice-enabled for hands-free chat
    </div>
    """, unsafe_allow_html=True)

    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.session_state.last_audio_hash = ""
        st.session_state.recorder_key = 0
        st.session_state.tts_audio = {}
        st.session_state.processing = False
        st.session_state.last_audio_bytes = None
        st.session_state.tts_error = None
        st.rerun()

# Main chat interface
st.markdown("## 💬 Chat with AI")
st.caption("Type a message or use voice input")

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "last_audio_hash" not in st.session_state:
    st.session_state.last_audio_hash = ""

if "recorder_key" not in st.session_state:
    st.session_state.recorder_key = 0

if "tts_audio" not in st.session_state:
    st.session_state.tts_audio = {}

if "processing" not in st.session_state:
    st.session_state.processing = False

if "last_audio_bytes" not in st.session_state:
    st.session_state.last_audio_bytes = None

if "tts_error" not in st.session_state:
    st.session_state.tts_error = None

if "tts_truncated" not in st.session_state:
    st.session_state.tts_truncated = False

if "tts_long_message" not in st.session_state:
    st.session_state.tts_long_message = False

# Display any TTS notifications
if st.session_state.tts_error:
    st.error(f"❌ {st.session_state.tts_error}")
    st.session_state.tts_error = None

if st.session_state.tts_truncated:
    st.warning("⚠️ Long message was truncated for audio. Full text shown above.")
    st.session_state.tts_truncated = False

if st.session_state.tts_long_message:
    st.session_state.tts_long_message = False

# Display chat messages with TTS audio players
for i, message in enumerate(st.session_state.messages):
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

    # Display audio player OUTSIDE chat message container for assistant messages
    if message["role"] == "assistant":
        if i in st.session_state.tts_audio:
            # Use HTML audio with autoplay for automatic playback
            audio_base64 = base64.b64encode(st.session_state.tts_audio[i]).decode()
            # Only autoplay the most recent message
            is_latest = (i == len(st.session_state.messages) - 1)
            autoplay_attr = "autoplay" if is_latest else ""

            # Polished audio container with divider and label
            audio_html = f'''
                <div class="audio-container">
                    <div class="audio-label">
                        🔊 AI Response Audio
                    </div>
                    <div class="audio-divider"></div>
                    <audio controls {autoplay_attr} style="width: 100%;">
                        <source src="data:audio/mp3;base64,{audio_base64}" type="audio/mp3">
                    </audio>
                </div>
            '''
            st.markdown(audio_html, unsafe_allow_html=True)

# Input section at bottom - mic next to text input (mobile-friendly ratios)
col1, col2 = st.columns([1, 12])

with col1:
    audio_bytes = audio_recorder(
        text="",
        recording_color="#10bbbb",
        neutral_color="#6b7280",
        icon_size="1x",
        pause_threshold=2.0,
        sample_rate=16000,
        key=f"recorder_{st.session_state.recorder_key}"
    )

with col2:
    prompt = st.chat_input("Type your message or click the mic to speak...", key="chat_input")

# Process voice input
if audio_bytes:
    import hashlib
    audio_hash = hashlib.md5(audio_bytes).hexdigest()

    if audio_hash != st.session_state.last_audio_hash:
        st.session_state.last_audio_hash = audio_hash

        # Display waveform
        waveform_html = display_waveform(audio_bytes)
        st.markdown(waveform_html, unsafe_allow_html=True)

        with st.spinner("Transcribing..."):
            transcribed_text = transcribe_audio(audio_bytes)

            if transcribed_text:
                st.info(f"You said: {transcribed_text}")

                with st.spinner("Thinking..."):
                    response = generate_ai_response(transcribed_text, selected_personality)

                # Generate TTS for the response
                msg_index = len(st.session_state.messages) - 1
                if msg_index not in st.session_state.tts_audio:
                    # Show warning for long messages
                    if len(response) > 500:
                        st.info("📝 Long message - audio generation may take a moment...")

                    with st.spinner("🎵 Generating audio..."):
                        audio_data = generate_tts_audio(response)
                        if audio_data:
                            st.session_state.tts_audio[msg_index] = audio_data

                st.session_state.recorder_key += 1
                st.rerun()
            else:
                st.warning("Could not understand audio. Please try again.")
                st.session_state.recorder_key += 1

# Text input
if prompt:
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        with st.spinner("🤔 Thinking..."):
            response = generate_ai_response(prompt, selected_personality)
            st.markdown(response)

    # Generate TTS for the response
    msg_index = len(st.session_state.messages) - 1
    if msg_index not in st.session_state.tts_audio:
        # Show warning for long messages
        if len(response) > 500:
            st.info("📝 Long message - audio generation may take a moment...")

        with st.spinner("🎵 Generating audio..."):
            audio_data = generate_tts_audio(response)
            if audio_data:
                st.session_state.tts_audio[msg_index] = audio_data

    st.rerun()

# Help section
with st.expander("📖 How to use voice input"):
    st.markdown("""
    ### Voice Recording Steps:
    1. **Click the microphone icon** - It turns grey when recording
    2. **Speak your message** clearly
    3. **Click the icon again** to stop recording
    4. **See your waveform** - Grey bars show your audio pattern
    5. **Wait for processing** - Your message auto-sends to AI!

    ### Pro Tips:
    - The waveform shows the amplitude of your recorded audio
    - Speak clearly at normal pace
    - Minimize background noise
    - Prefer typing? Use the text box below
    """)

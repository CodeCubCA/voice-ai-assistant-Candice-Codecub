import streamlit as st
import google.generativeai as genai
from dotenv import load_dotenv
import os
from audio_recorder_streamlit import audio_recorder
import speech_recognition as sr
import tempfile

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

# Page configuration
st.set_page_config(
    page_title="AI Assistant",
    page_icon="🤖",
    layout="centered"
)

# Minimal CSS
st.markdown("""
<style>
    .main .block-container {
        max-width: 800px;
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

# Sidebar
with st.sidebar:
    st.title("🤖 AI Assistant")
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
    st.subheader("About")
    st.markdown("""
    This AI chatbot is powered by:
    - **Streamlit** for the web interface
    - **Google Gemini** for AI responses
    - **Voice Input** for hands-free interaction

    Speak or type your message!
    """)

    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.session_state.last_audio_hash = ""
        st.session_state.recorder_key = 0
        st.rerun()

# Main chat interface
st.title("💬 Chat with AI")

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "last_audio_hash" not in st.session_state:
    st.session_state.last_audio_hash = ""

if "recorder_key" not in st.session_state:
    st.session_state.recorder_key = 0

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Input section at bottom - mic next to text input
col1, col2 = st.columns([1, 15])

with col1:
    audio_bytes = audio_recorder(
        text="",
        recording_color="#374151",
        neutral_color="#6b7280",
        icon_size="1x",
        pause_threshold=2.0,
        sample_rate=16000,
        key=f"recorder_{st.session_state.recorder_key}"
    )

with col2:
    prompt = st.chat_input("Type or use mic...")

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

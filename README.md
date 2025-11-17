# AI Voice Assistant

A Streamlit-based AI chatbot with voice input capability, powered by Google Gemini API.

## Features

- **Voice Input**: Record your voice and have it transcribed automatically
- **Text Input**: Type messages directly
- **Multiple AI Personalities**: Choose from 4 different AI personalities:
  - General Assistant
  - Study Buddy
  - Fitness Coach
  - Gaming Helper
- **Audio Waveform Visualization**: See your recorded audio visualized
- **Conversation History**: Maintains chat history during the session

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```bash
   streamlit run app.py
   ```

## Requirements

- Python 3.8+
- Google Gemini API key
- Microphone access for voice input

## Technologies Used

- **Streamlit** - Web interface
- **Google Generative AI (Gemini 2.5 Flash)** - AI responses
- **SpeechRecognition** - Voice transcription
- **audio-recorder-streamlit** - Audio recording component

## Usage

1. Select an AI personality from the sidebar
2. Either:
   - Click the microphone icon to record your voice, then click again to stop
   - Type your message in the text input box
3. The AI will respond based on the selected personality
4. Clear chat history using the button in the sidebar

## Project Structure

```
Voice Ai Assistent/
├── app.py              # Main application
├── requirements.txt    # Python dependencies
├── .env               # API key (not tracked)
├── .env.example       # Example environment file
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## License

This project is for educational purposes.

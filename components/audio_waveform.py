import streamlit.components.v1 as components

def audio_recorder_with_waveform(key="audio_recorder"):
    """
    Custom audio recorder component with real-time waveform visualization.
    Returns base64 encoded audio data when recording stops.
    """

    component_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 10px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: transparent;
            }

            .recorder-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .record-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: #9ca3af;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .record-btn:hover {
                background: #6b7280;
            }

            .record-btn.recording {
                background: #6b7280;
            }

            .record-btn svg {
                width: 24px;
                height: 24px;
                fill: white;
            }

            .record-btn.recording .mic-icon {
                display: none;
            }

            .record-btn .stop-icon {
                display: none;
            }

            .record-btn.recording .stop-icon {
                display: block;
            }

            .status {
                color: #6b7280;
                font-size: 14px;
            }

            .waveform-container {
                width: 100%;
                height: 80px;
                background: #f9fafb;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }

            #waveformCanvas {
                width: 100%;
                height: 100%;
            }

            .placeholder {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #9ca3af;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="recorder-container">
            <div class="controls">
                <button class="record-btn" id="recordBtn" onclick="toggleRecording()">
                    <svg class="mic-icon" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                    <svg class="stop-icon" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12"/>
                    </svg>
                </button>
                <span class="status" id="status">Click to start recording</span>
            </div>
            <div class="waveform-container">
                <canvas id="waveformCanvas"></canvas>
                <div class="placeholder" id="placeholder">Waveform will appear here</div>
            </div>
        </div>

        <script>
            let mediaRecorder;
            let audioChunks = [];
            let audioContext;
            let analyser;
            let dataArray;
            let isRecording = false;
            let animationId;
            let waveformData = [];

            const canvas = document.getElementById('waveformCanvas');
            const ctx = canvas.getContext('2d');
            const recordBtn = document.getElementById('recordBtn');
            const status = document.getElementById('status');
            const placeholder = document.getElementById('placeholder');

            // Set canvas size
            function resizeCanvas() {
                canvas.width = canvas.offsetWidth * 2;
                canvas.height = canvas.offsetHeight * 2;
                ctx.scale(2, 2);
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            function toggleRecording() {
                if (!isRecording) {
                    startRecording();
                } else {
                    stopRecording();
                }
            }

            async function startRecording() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                    // Audio context for visualization
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                    analyser.fftSize = 2048;
                    const bufferLength = analyser.frequencyBinCount;
                    dataArray = new Uint8Array(bufferLength);

                    // Media recorder
                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                    audioChunks = [];
                    waveformData = [];

                    mediaRecorder.ondataavailable = (event) => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const arrayBuffer = await audioBlob.arrayBuffer();
                        const uint8Array = new Uint8Array(arrayBuffer);
                        let binary = '';
                        const chunkSize = 8192;
                        for (let i = 0; i < uint8Array.length; i += chunkSize) {
                            const chunk = uint8Array.subarray(i, i + chunkSize);
                            binary += String.fromCharCode.apply(null, chunk);
                        }
                        const base64 = btoa(binary);

                        // Send to Streamlit
                        if (window.parent) {
                            window.parent.postMessage({
                                type: 'streamlit:setComponentValue',
                                value: base64
                            }, '*');
                        }
                    };

                    mediaRecorder.start(100);
                    isRecording = true;

                    recordBtn.classList.add('recording');
                    status.textContent = 'Recording... Click to stop';
                    placeholder.style.display = 'none';

                    drawWaveform();

                } catch (err) {
                    console.error('Error:', err);
                    status.textContent = 'Error: ' + err.message;
                }
            }

            function stopRecording() {
                if (mediaRecorder && isRecording) {
                    mediaRecorder.stop();
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                    isRecording = false;

                    cancelAnimationFrame(animationId);

                    recordBtn.classList.remove('recording');
                    status.textContent = 'Processing...';

                    if (audioContext) {
                        audioContext.close();
                    }

                    // Draw final static waveform
                    drawStaticWaveform();
                }
            }

            function drawWaveform() {
                if (!isRecording) return;

                analyser.getByteTimeDomainData(dataArray);

                // Store waveform sample
                const sample = dataArray[Math.floor(dataArray.length / 2)];
                waveformData.push(sample);

                // Keep only last N samples for display
                const maxSamples = Math.floor(canvas.offsetWidth / 2);
                if (waveformData.length > maxSamples) {
                    waveformData.shift();
                }

                // Clear canvas
                ctx.fillStyle = '#f9fafb';
                ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

                // Draw waveform bars
                const barWidth = 2;
                const gap = 1;
                const centerY = canvas.offsetHeight / 2;

                ctx.fillStyle = '#6b7280';

                for (let i = 0; i < waveformData.length; i++) {
                    const value = waveformData[i];
                    const amplitude = Math.abs(value - 128) / 128;
                    const barHeight = Math.max(2, amplitude * (canvas.offsetHeight * 0.8));

                    const x = i * (barWidth + gap);
                    const y = centerY - barHeight / 2;

                    ctx.fillRect(x, y, barWidth, barHeight);
                }

                animationId = requestAnimationFrame(drawWaveform);
            }

            function drawStaticWaveform() {
                ctx.fillStyle = '#f9fafb';
                ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

                const barWidth = 2;
                const gap = 1;
                const centerY = canvas.offsetHeight / 2;

                ctx.fillStyle = '#9ca3af';

                for (let i = 0; i < waveformData.length; i++) {
                    const value = waveformData[i];
                    const amplitude = Math.abs(value - 128) / 128;
                    const barHeight = Math.max(2, amplitude * (canvas.offsetHeight * 0.8));

                    const x = i * (barWidth + gap);
                    const y = centerY - barHeight / 2;

                    ctx.fillRect(x, y, barWidth, barHeight);
                }
            }
        </script>
    </body>
    </html>
    """

    return components.html(component_html, height=150, key=key)

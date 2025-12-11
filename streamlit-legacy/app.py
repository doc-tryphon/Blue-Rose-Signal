import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from scipy.io.wavfile import write
from io import BytesIO

# --- 1. THE DSP ENGINE (The "Ghost" Logic) ---
def generate_signal(duration, rate, threshold, smoothness, spark_gain, hum_gain):
    t = np.linspace(0, duration, int(rate * duration), endpoint=False)

    # A. The Carrier: 60Hz Mains Hum (The "Looming Darkness")
    hum = hum_gain * np.sin(2 * np.pi * 60 * t)
    hum += (hum_gain * 0.4) * np.sin(2 * np.pi * 120 * t)
    hum += (hum_gain * 0.3) * np.sin(2 * np.pi * 180 * t)
    hum += (hum_gain * 0.2) * np.sin(2 * np.pi * 300 * t)

    # B. The Modulator: Stochastic Contact
    np.random.seed(99)
    raw_noise = np.random.uniform(0, 1, len(t))

    window_size = int(smoothness) if int(smoothness) > 0 else 1
    envelope = np.convolve(raw_noise, np.ones(window_size)/window_size, mode='same')

    if envelope.max() > envelope.min():
        envelope = (envelope - envelope.min()) / (envelope.max() - envelope.min())

    # C. The Spark
    friction = np.abs(np.diff(envelope, prepend=0))

    # D. Synthesis
    connection_mask = envelope > threshold
    sparks = np.random.normal(0, 1, len(t)) * (friction * spark_gain)

    audio = (hum * connection_mask) + sparks
    audio = np.clip(audio, -1.0, 1.0)

    return t, audio, envelope, threshold, rate

# --- 2. PAGE CONFIG ---
st.set_page_config(
    page_title="Gospel Claws Protocol",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- 3. SIMPLE BUT EFFECTIVE TV FRAME CSS ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    /* Black background everywhere */
    .stApp {
        background: #000000 !important;
        font-family: 'VT323', monospace;
    }

    /* MAIN CONTAINER - TV SCREEN WITH THICK BEZEL */
    .main {
        background: #000000 !important;
        /* Thick gray border = TV bezel */
        border: 80px solid #5a5a58 !important;
        border-radius: 20px !important;
        box-shadow:
            /* Inner shadow for depth */
            inset 0 0 50px rgba(0,0,0,0.8),
            /* Outer glow */
            0 0 60px rgba(0,0,0,0.9) !important;
        margin: 20px !important;
        padding: 20px !important;
        position: relative !important;
    }

    /* Add highlight to bezel top */
    .main::before {
        content: '';
        position: absolute;
        top: -80px;
        left: -80px;
        right: -80px;
        height: 40px;
        background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
        pointer-events: none;
        border-radius: 20px 20px 0 0;
    }

    /* Content area */
    .main .block-container {
        background: #000000;
        padding: 2rem !important;
        position: relative;
        z-index: 1;
    }

    /* CRT Scanlines */
    .main .block-container::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.1) 0px,
            rgba(0,0,0,0.1) 1px,
            transparent 1px,
            transparent 3px
        );
        pointer-events: none;
        z-index: 2;
        animation: flicker 0.15s infinite;
    }

    @keyframes flicker {
        0%, 100% { opacity: 0.95; }
        50% { opacity: 1; }
    }

    /* Vignette effect */
    .main .block-container::after {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: radial-gradient(
            ellipse at center,
            transparent 40%,
            rgba(0,0,0,0.4) 90%,
            rgba(0,0,0,0.7) 100%
        );
        pointer-events: none;
        z-index: 1;
    }

    /* SIDEBAR - Make it match bezel */
    section[data-testid="stSidebar"] {
        background: linear-gradient(180deg, #4a4a48 0%, #3a3a38 100%) !important;
        border-right: 5px solid #2a2a28 !important;
    }

    section[data-testid="stSidebar"] > div {
        background: rgba(0,0,0,0.5);
        padding: 20px;
    }

    /* Typography - Amber CRT */
    h1, h2, h3 {
        font-family: 'VT323', monospace !important;
        text-transform: uppercase;
        color: #ffcc00 !important;
        text-shadow: 0 0 10px #ff9900;
        position: relative;
        z-index: 3;
    }

    p, label {
        color: #ffcc00 !important;
        position: relative;
        z-index: 3;
        text-shadow: 0 0 5px rgba(255,204,0,0.3);
    }

    div {
        position: relative;
        z-index: 3;
    }

    /* Widgets */
    .stSlider > div > div > div > div {
        background-color: #ffcc00 !important;
    }

    .stButton button {
        border: 2px solid #ffcc00;
        color: #ffcc00;
        background: transparent;
        font-family: 'VT323', monospace;
        font-size: 1.5rem;
    }

    .stButton button:hover {
        background: #ffcc00;
        color: #000;
        box-shadow: 0 0 20px #ffcc00;
    }

    /* Make sure content is visible */
    .element-container {
        position: relative;
        z-index: 3;
    }

    </style>
""", unsafe_allow_html=True)

# --- 4. TV BRANDING HEADER ---
st.markdown("""
    <div style="
        text-align: center;
        padding: 1.5rem;
        background: linear-gradient(90deg, transparent, rgba(255,204,0,0.05), transparent);
        border-top: 3px solid rgba(255,204,0,0.2);
        border-bottom: 3px solid rgba(255,204,0,0.2);
        margin-bottom: 2rem;
    ">
        <div style="
            font-family: 'VT323', monospace;
            font-size: 2rem;
            color: #888;
            letter-spacing: 12px;
            text-shadow: 0 0 10px rgba(255,204,0,0.2);
        ">
            ▮▮ VINTAGE CRT MONITOR ▮▮
        </div>
        <div style="
            font-size: 0.9rem;
            color: #666;
            letter-spacing: 4px;
            margin-top: 0.5rem;
        ">
            TERMINAL DISPLAY SYSTEM
        </div>
    </div>
""", unsafe_allow_html=True)

# --- 5. SIDEBAR CONTROLS ---
with st.sidebar:
    st.markdown("""
        <div style="
            text-align: center;
            padding: 1rem;
            background: rgba(255,204,0,0.1);
            border: 2px solid rgba(255,204,0,0.3);
            border-radius: 10px;
            margin-bottom: 1rem;
        ">
            <div style="font-size: 1.4rem; color: #ffcc00; text-shadow: 0 0 10px #ffcc00;">
                🎛️ CONTROL DECK
            </div>
        </div>
    """, unsafe_allow_html=True)

    st.markdown("**Flying Blanket Records**  \n*Session: 'Looming Darkness' (2012)*")

    st.subheader("SIGNAL PARAMETERS")
    duration = st.slider("Tape Length (Sec)", 1.0, 10.0, 3.0)

    st.markdown("---")
    st.markdown("### 🔌 Connection Physics")
    threshold = st.slider("Connection Integrity", 0.1, 0.9, 0.6)
    smoothness = st.slider("Hand Movement Speed", 50, 2000, 500)

    st.markdown("### 🎚️ Mixer")
    spark_gain = st.slider("Arcing Volume (Sparks)", 0.0, 200.0, 50.0)
    hum_gain = st.slider("Mains Hum Volume", 0.0, 1.0, 0.5)

# --- 6. MAIN TITLE ---
st.markdown("""
    <div style="
        background: linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,100,0,0.05));
        padding: 2rem;
        border-left: 8px solid #ff3333;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 0 30px rgba(255,0,0,0.2);
    ">
        <div style="font-size: 3rem; color: #ffcc00; text-shadow: 0 0 20px #ff9900; margin-bottom: 0.5rem;">
            ⚡ LOOMING DARKNESS PROTOCOL
        </div>
        <div style="font-size: 1.3rem; color: #ff6666; text-shadow: 0 0 10px #ff3333; animation: pulse 2s infinite;">
            > SYSTEM STATUS: UNSTABLE // INTERFERENCE DETECTED
        </div>
    </div>
    <style>
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    </style>
""", unsafe_allow_html=True)

# --- 7. GENERATE AUDIO ---
t, audio, envelope, thresh, rate = generate_signal(duration, 44100, threshold, smoothness, spark_gain, hum_gain)

virtual_file = BytesIO()
write(virtual_file, 44100, np.int16(audio * 32767))

# --- 8. VISUALIZATION ---
plt.style.use('dark_background')
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), gridspec_kw={'height_ratios': [1, 1]})
fig.patch.set_facecolor('#000000')

# Time Domain
zoom_limit = min(len(t), 15000)

ax1.set_facecolor('#000000')
ax1.plot(t[:zoom_limit], envelope[:zoom_limit], color='#00ff00', alpha=0.8, linewidth=2, label='Physical Contact')
ax1.axhline(y=thresh, color='#ff3333', linestyle='--', linewidth=2, label='Break Threshold')
ax1.plot(t[:zoom_limit], audio[:zoom_limit] * 0.5, color='#ffffff', alpha=0.4, linewidth=0.8, label='Resulting Audio')

ax1.set_title("CHANNEL 1: PHYSICAL CONTACT ENVELOPE", color='#00ff00', fontsize=14, fontweight='bold')
ax1.legend(loc='upper right', facecolor='black', edgecolor='#00ff00', fontsize=10)
ax1.grid(color='#333333', linestyle=':', alpha=0.3)
ax1.set_ylabel("Amplitude", color='#00ff00')

# Spectrogram
ax2.set_facecolor('#000000')
Pxx, freqs, bins, im = ax2.specgram(audio, NFFT=1024, Fs=rate, noverlap=512, cmap='hot')
ax2.set_ylim(0, 2000)
ax2.set_title("CHANNEL 2: SPECTRAL ANALYSIS (GARMONBOZIA)", color='#ff3333', fontsize=14, fontweight='bold')
ax2.set_ylabel("FREQ (Hz)", color='#ffcc00')
ax2.set_xlabel("TIME", color='#ffcc00')
ax2.grid(False)

plt.tight_layout()
st.pyplot(fig)

# --- 9. AUDIO OUTPUT ---
st.markdown("### > OUTPUT MONITOR")
st.audio(virtual_file, format='audio/wav')

# --- 10. FOOTER ---
st.markdown("---")
st.markdown("""
    <div style="text-align: center; color: #666; font-size: 0.9rem; padding: 1rem;">
        FLYING BLANKET RECORDS ARCHIVE // RECOVERED ARTIFACT #2012-GC<br>
        <span style="color: #888;">"The owls are not what they seem."</span>
    </div>
""", unsafe_allow_html=True)

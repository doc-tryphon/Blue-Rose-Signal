# ⚡ Blue Rose Signal - Looming Darkness Protocol

A Streamlit-based audio synthesis application that generates eerie, atmospheric sounds using DSP techniques. Features a CRT-aesthetic interface inspired by Twin Peaks and retro terminal displays.

## Features

- **DSP Engine**: Generates audio using 60Hz mains hum with harmonics
- **Stochastic Modulation**: Simulates physical contact and cable interference
- **Real-time Visualization**: Time-domain and frequency-domain analysis
- **CRT Aesthetic**: Retro terminal styling with scanline effects
- **Interactive Controls**: Adjust signal parameters in real-time

## Installation

1. **Create a virtual environment** (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

## Running the App

```bash
streamlit run app.py
```

The app will open in your default web browser at `http://localhost:8501`

## Controls

### Signal Parameters
- **Tape Length**: Duration of generated audio (1-10 seconds)

### Connection Physics
- **Connection Integrity**: Lower = stable connection, Higher = more interference
- **Hand Movement Speed**: Simulates physical cable rubbing speed

### Mixer
- **Arcing Volume (Sparks)**: Controls the intensity of electrical sparking sounds
- **Mains Hum Volume**: Controls the 60Hz hum base level

## Technical Details

The app uses:
- **NumPy** for signal generation and mathematical operations
- **SciPy** for audio file writing and signal processing
- **Matplotlib** for time-domain and spectral visualization
- **Streamlit** for the interactive web interface

### Signal Generation
1. Creates a 60Hz carrier wave with harmonics (120Hz, 180Hz, 300Hz)
2. Generates stochastic noise envelope for contact simulation
3. Calculates sparks from envelope derivative (rate of change)
4. Mixes components based on connection threshold

## Credits

Flying Blanket Records Archive
Recovered Artifact #2012-GC

*"The owls are not what they seem."*

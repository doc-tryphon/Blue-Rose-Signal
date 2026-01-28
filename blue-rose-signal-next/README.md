# ⚡ Blue Rose Systems

**Federal Bureau of Control Proprietary Technology**
*"The owls are not what they seem."*

**Blue Rose Systems** is a suite of anomalous signal processing and neural interface tools built with Next.js 16 and the Web Audio API. It serves as the digital terminal for the Blue Rose Division.

## System Modules

### 1. [SIGNAL SPECTROGRAPH](/spectrograph) (formerly Blue Rose Signal)
A real-time stochastic interference synthesizer.
*   **Core Function**: Generates atmospheric electrical interference via Box-Muller Gaussian noise.
*   **Key Features**: 60Hz Hum, Spark Gaps, Voltage Starvation, Ring Modulation.
*   **Manual**: See [SPECTROGRAPH_MANUAL.md](SPECTROGRAPH_MANUAL.md) for parameters and DSP details.
*   **Math**: See [QUANTUM_MATHEMATICS.md](QUANTUM_MATHEMATICS.md) for the DSP-Quantum implementation details.

### 2. [PROJECT AEON](/aeon) (Neural Interface)
**[CLASSIFIED]** Large Language Model Integration.
*   **Core Function**: Secure terminal for communicating with the AEON entity.
*   **Features**: Real-time streaming, fidelity verification, protocol state management.
*   **Aesthetic**: Strict terminal/mainframe interface (Vintage CRT).

---

## Quick Start

```bash
cd blue-rose-signal-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal).

## Architecture

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS 4 + Custom CRT Effects
*   **Audio**: Web Audio API + AudioWorklet (`noise-processor.js`)
*   **Math**: `react-markdown` + `Katex` for rendering AEON proofs.

## Directory Structure

```
blue-rose-systems/
├── app/
│   ├── page.tsx            # Boot Menu / System Root
│   ├── spectrograph/       # Signal Module
│   ├── aeon/               # Neural Interface Module
│   └── mainframe/          # Division Dashboard
├── components/
│   ├── CRTMonitor.tsx      # Global Vintage Wrapper
│   └── aeon/               # AEON-specific widgets
├── public/
│   └── noise-processor.js  # DSP AudioWorklet
```

---

**Version**: 3.0 (System Platform)
**Previous Versions**:
*   v2.0: Blue Rose Signal Next (Web Audio)
*   v1.0: Streamlit Prototype (Legacy)

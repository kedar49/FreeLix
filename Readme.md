# Language Bridge

**Language Bridge** is a modern React and Tailwind CSS web application designed for seamless transcription and translation using state-of-the-art AI models.

## Features
- **Audio Transcription:** Converts speech to text using advanced Whisper models
- **Multi-language Translation:** Translates text between 200+ languages with high accuracy
- **Real-time Recording:** Record audio directly in your browser
- **File Upload:** Support for MP3 and WAV audio files
- **Modern UI:** Beautiful, responsive design with smooth animations

## AI Models
We use **fast and accurate** open-source models optimized for browser performance:
- **Transcription:** Whisper Small (OpenAI) - 99+ languages, excellent accuracy, ~244 MB
- **Translation:** NLLB-200-600M (Meta) - 200+ languages, professional quality, ~600 MB

All models run entirely in your browser for complete privacy. See [MODELS.md](MODELS.md) for detailed information.

**Performance**: First use downloads ~850 MB of models (cached permanently). Works great on 4+ GB RAM.

## Getting Started

### Prerequisites
- **Node.js:** Ensure that Node.js is installed on your system

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Avi2894/language-bridge
    ```
2. **Navigate to the project directory:**
    ```bash
    cd language-bridge
    ```
3. **Install the dependencies:**
    ```bash
    npm install
    ```

### Running the Application
To start the development server, run:
```bash
npm run dev
```

### Building for Production
To create a production build:
```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Avi2894/language-bridge)

Or follow the detailed [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions.

## Contributing
We welcome contributions! Feel free to submit issues and pull requests.

## License
This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.

## Contact
Built with ❤️ by Avinash Ghodke

For questions or inquiries, reach out via GitHub: [@Avi2894](https://github.com/Avi2894)
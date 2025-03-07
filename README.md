# Sound Converter

A simple desktop application for converting OGG audio files to MP3 format, built with Electron.js.

## Features

- 🎵 Drag and drop interface for file selection
- 📁 Multiple file selection support
- 📊 Progress tracking for each file
- 🎨 Clean and intuitive user interface
- 💻 Cross-platform support (Windows, macOS, Linux)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/8bitbyadog/sound-converter.git
   cd sound-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the application in development mode:
```bash
npm start
```

## Building the Application

To create a distributable package:
```bash
npm run build
```

The built application will be available in the `dist` directory.

## Usage

1. Launch the application
2. Drag and drop OGG files into the application window or click to select files
3. Choose an output directory for the converted MP3 files
4. Click "Convert Files" to start the conversion process
5. Monitor the progress of each file conversion
6. Wait for the completion message

## Error Handling

The application will display error messages if:
- Invalid files are selected
- The output directory is not accessible
- Conversion fails for any reason

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

- GitHub: [@8bitbyadog](https://github.com/8bitbyadog) 
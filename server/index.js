import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('dist'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Ensure directories exist
await fs.mkdir(join(__dirname, '../uploads'), { recursive: true });
await fs.mkdir(join(__dirname, '../outputs'), { recursive: true });

app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = join(__dirname, '../outputs', `${req.file.filename}.txt`);
    const wavPath = `${inputPath}.wav`;

    // Convert M4A to WAV using FFmpeg
    await execAsync(`ffmpeg -i ${inputPath} -ar 16000 -ac 1 ${wavPath}`);

    // Use FFmpeg to extract audio to text using the subtitle stream
    await execAsync(`ffmpeg -i ${wavPath} -f vtt -y ${outputPath}`);

    // Read the VTT file and convert to plain text
    const vttContent = await fs.readFile(outputPath, 'utf-8');
    const plainText = vttContent
      .split('\n')
      .filter(line => !line.match(/^([0-9]{2}:){2}[0-9]{2}/)) // Remove timestamps
      .filter(line => line.trim() && !line.includes('WEBVTT')) // Remove empty lines and WEBVTT header
      .join('\n');

    await fs.writeFile(outputPath, plainText);

    // Cleanup
    await fs.unlink(inputPath);
    await fs.unlink(wavPath);

    res.json({ 
      message: 'Transcription complete',
      outputFile: outputPath
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

app.get('/download/:filename', async (req, res) => {
  const filePath = join(__dirname, '../outputs', req.params.filename);
  res.download(filePath);
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
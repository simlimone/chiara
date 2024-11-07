import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionUrl, setTranscriptionUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'audio/x-m4a') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid .m4a file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setTranscriptionUrl(`http://localhost:3000/download/${data.outputFile}`);
    } catch (err) {
      setError('Failed to process audio file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-600" />
            Audio Transcription
          </h1>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".m4a"
                onChange={handleFileChange}
                className="hidden"
                id="audio-input"
              />
              <label
                htmlFor="audio-input"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <div className="text-gray-600">
                  {file ? (
                    <span className="text-indigo-600 font-medium">{file.name}</span>
                  ) : (
                    <span>Drop your .m4a file here or click to browse</span>
                  )}
                </div>
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                ${loading || !file
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Transcribe Audio'
              )}
            </button>

            {transcriptionUrl && !loading && (
              <a
                href={transcriptionUrl}
                download
                className="block w-full text-center py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Download Transcription
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
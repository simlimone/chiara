import React from 'react';
import { Loader2 } from 'lucide-react';

interface TranscriptionStatusProps {
  status: string;
  progress: number;
}

const TranscriptionStatus: React.FC<TranscriptionStatusProps> = ({ status, progress }) => {
  return (
    <div className="text-center">
      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
      <p className="mb-4 text-lg">{status}</p>
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionStatus;
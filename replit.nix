{
  description = "Audio transcription app";
  
  deps = pkgs: with pkgs; [
    nodejs_20
    ffmpeg
    python3
  ];
}
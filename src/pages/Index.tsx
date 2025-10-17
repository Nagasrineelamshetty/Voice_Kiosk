import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Volume2, Trash2, Hospital } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [language, setLanguage] = useState("english");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // -----------------------------
  // Start/Stop Recording
  // -----------------------------
  const handleMicClick = async () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast.success("Recording started...");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          await sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
      } catch (err) {
        console.error(err);
        toast.error("Microphone access denied or error occurred");
        setIsRecording(false);
      }
    } else {
      // Stop recording
      setIsRecording(false);
      toast.info("Recording stopped");
      mediaRecorderRef.current?.stop();
    }
  };

  // -----------------------------
  // Send recorded audio to backend
  // -----------------------------
  const sendAudioToBackend = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice_query.wav");

      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to fetch AI response");

      const data = await res.json();
      setRecognizedText(data.query);
      setAiResponse(data.answer);
      setAudioUrl(`http://localhost:8000${data.audio_url}`);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching AI response");
    }
  };

  // -----------------------------
  // Play AI response audio
  // -----------------------------
  const handlePlayAudio = () => {
    if (audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  // -----------------------------
  // Clear everything
  // -----------------------------
  const handleClear = () => {
    setRecognizedText("");
    setAiResponse("");
    setIsRecording(false);
    setIsPlaying(false);
    setAudioUrl("");
    toast.success("Screen cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30">
      {/* Header Section */}
      <header className="bg-white shadow-soft border-b">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-medical">
              <Hospital className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hospital Voice Kiosk</h1>
              <p className="text-sm text-muted-foreground mt-1">Advanced Healthcare Services</p>
            </div>
          </div>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] border-2 rounded-xl">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">en English</SelectItem>
              <SelectItem value="hindi">hn हिंदी</SelectItem>
              <SelectItem value="telugu">te తెలుగు</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Smart Voice Helpdesk
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We are here to help you. Ask us anything — We can guide you to doctors, rooms, and departments!
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 md:p-12 shadow-medical border-2">
          {/* Microphone Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={handleMicClick}
              className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-glow text-white shadow-medical transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                isRecording ? "recording-animation" : ""
              }`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <Mic className={`w-14 h-14 mx-auto ${isRecording ? "pulse-mic" : ""}`} />
              {isRecording && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-primary whitespace-nowrap">
                  Listening...
                </span>
              )}
            </button>
          </div>

          {/* Recognized Text */}
          {recognizedText && (
            <div className="mb-8 animate-fade-in">
              <label className="block text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                You said:
              </label>
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-primary/20">
                <p className="text-xl md:text-2xl text-foreground font-medium">{recognizedText}</p>
              </Card>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="mb-8 animate-fade-in">
              <label className="block text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                AI Assistant Response:
              </label>
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
                <p className="text-lg md:text-xl text-foreground leading-relaxed">{aiResponse}</p>
              </Card>

              {/* Play Audio */}
              <div className="flex justify-center mt-6">
                <Button onClick={handlePlayAudio} disabled={isPlaying} size="lg" className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-soft rounded-xl px-8">
                  <Volume2 className={`mr-2 h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Playing..." : "Play Audio Response"}
                </Button>
              </div>
            </div>
          )}

          {/* Clear */}
          {(recognizedText || aiResponse) && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleClear} variant="outline" size="lg" className="border-2 rounded-xl px-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
                <Trash2 className="mr-2 h-5 w-5" />
                Clear Screen
              </Button>
            </div>
          )}

          {!recognizedText && !isRecording && (
            <div className="text-center text-muted-foreground">
              <p className="text-lg">Click the microphone to start speaking</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
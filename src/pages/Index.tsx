import { useState } from "react";
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

  const handleMicClick = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success("Recording started...");
      
      // Simulate speech recognition
      setTimeout(() => {
        setIsRecording(false);
        setRecognizedText("Where is Dr. Sharma's cabin?");
        
        // Simulate AI response
        setTimeout(() => {
          setAiResponse("Dr. Sharma's cabin is in Room 203, First Floor. Take the elevator on your left, turn right after exiting, and it will be the third door on your right.");
        }, 1000);
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("Recording stopped");
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    toast.success("Playing audio response...");
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleClear = () => {
    setRecognizedText("");
    setAiResponse("");
    setIsRecording(false);
    setIsPlaying(false);
    toast.success("Screen cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30">
      {/* Header Section */}
      <header className="bg-white shadow-soft border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-medical">
                <Hospital className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">CityCare Hospital</h1>
                <p className="text-sm text-muted-foreground mt-1">Advanced Healthcare Services</p>
              </div>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px] border-2 rounded-xl">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">🇬🇧 English</SelectItem>
                <SelectItem value="hindi">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="telugu">🇮🇳 తెలుగు</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Banner */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to CityCare Smart Helpdesk
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Ask me anything — I can guide you to doctors, rooms, and departments!
          </p>
        </div>

        {/* Main Interaction Card */}
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

          {/* Recognized Text Display */}
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

          {/* AI Response Display */}
          {aiResponse && (
            <div className="mb-8 animate-fade-in">
              <label className="block text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                AI Assistant Response:
              </label>
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
                <p className="text-lg md:text-xl text-foreground leading-relaxed">{aiResponse}</p>
              </Card>

              {/* Audio Playback Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  size="lg"
                  className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-soft rounded-xl px-8"
                >
                  <Volume2 className={`mr-2 h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Playing..." : "Play Audio Response"}
                </Button>
              </div>
            </div>
          )}

          {/* Clear Button */}
          {(recognizedText || aiResponse) && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleClear}
                variant="outline"
                size="lg"
                className="border-2 rounded-xl px-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Clear Screen
              </Button>
            </div>
          )}

          {/* Helper Text */}
          {!recognizedText && !isRecording && (
            <div className="text-center text-muted-foreground">
              <p className="text-lg">Click the microphone to start speaking</p>
            </div>
          )}
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <Card className="p-6 text-center hover:shadow-medical transition-shadow border-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Hospital className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Find Doctors</h3>
            <p className="text-sm text-muted-foreground">
              Locate any doctor's cabin or consulting room
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-medical transition-shadow border-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Mic className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Voice Enabled</h3>
            <p className="text-sm text-muted-foreground">
              Simply speak your query in your language
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-medical transition-shadow border-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Audio Response</h3>
            <p className="text-sm text-muted-foreground">
              Listen to directions and guidance
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t bg-white/50">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>CityCare Hospital Smart Helpdesk © 2025 • Available 24/7</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

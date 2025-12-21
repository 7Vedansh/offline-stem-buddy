// Mock AI responses for the offline tutor
// In production, this would switch between local and cloud models

export interface AIResponse {
  text: string;
  isLocal: boolean;
  confidence: number;
}

// Simulated local AI responses based on lesson content
const localResponses: Record<string, string[]> = {
  algebra: [
    "Great question! In algebra, we use letters like 'x' to represent unknown values. Think of it like a mystery box - the letter holds a number we need to find!",
    "Variables are simply placeholders for numbers. When you see 'x + 5 = 10', you're looking for what number, when added to 5, gives you 10.",
    "To solve for x, remember: whatever you do to one side of the equation, you must do to the other side. It's all about keeping balance!",
    "Like terms are terms that have the same variable. For example, 3x and 5x are like terms because they both have 'x'. You can add them to get 8x!",
  ],
  geometry: [
    "Geometry is all about shapes and space! We study points, lines, angles, and figures to understand the world around us.",
    "A triangle has three sides and three angles. The sum of all angles in a triangle is always 180 degrees!",
    "The area of a rectangle is length × width. Remember: area measures the space inside a shape.",
  ],
  physics: [
    "Newton's First Law says an object stays at rest or in motion unless a force acts on it. Think of a ball - it won't move until you push it!",
    "Speed = Distance ÷ Time. If you travel 100 km in 2 hours, your speed is 50 km/h.",
    "Energy cannot be created or destroyed, only transformed from one form to another.",
  ],
  general: [
    "That's a great question! Let me break it down for you step by step.",
    "I understand what you're asking. Here's a simple way to think about it...",
    "Let me help you understand this concept better with an example.",
  ],
};

// Simulate AI response delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if query matches certain topics
function detectTopic(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('algebra') || lowerQuery.includes('variable') || lowerQuery.includes('equation') || lowerQuery.includes('solve')) {
    return 'algebra';
  }
  if (lowerQuery.includes('geometry') || lowerQuery.includes('shape') || lowerQuery.includes('angle') || lowerQuery.includes('triangle')) {
    return 'geometry';
  }
  if (lowerQuery.includes('physics') || lowerQuery.includes('force') || lowerQuery.includes('motion') || lowerQuery.includes('energy')) {
    return 'physics';
  }
  return 'general';
}

// Generate local AI response (simulated)
export async function getLocalAIResponse(query: string): Promise<AIResponse> {
  // Simulate processing delay
  await delay(800 + Math.random() * 700);
  
  const topic = detectTopic(query);
  const responses = localResponses[topic] || localResponses.general;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    text: randomResponse,
    isLocal: true,
    confidence: 0.7 + Math.random() * 0.2,
  };
}

// Generate cloud AI response (simulated - would use real API when online)
export async function getCloudAIResponse(query: string): Promise<AIResponse> {
  // Simulate network delay
  await delay(1200 + Math.random() * 800);
  
  const topic = detectTopic(query);
  const responses = localResponses[topic] || localResponses.general;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Cloud responses are more detailed (simulated)
  const enhancedResponse = `${randomResponse}\n\n📚 Here's an additional tip: Practice makes perfect! Try working through a few examples to reinforce your understanding.`;
  
  return {
    text: enhancedResponse,
    isLocal: false,
    confidence: 0.85 + Math.random() * 0.1,
  };
}

// Smart AI that switches between local and cloud
export async function getAIResponse(query: string, forceLocal: boolean = false): Promise<AIResponse> {
  const isOnline = navigator.onLine && !forceLocal;
  
  if (isOnline) {
    try {
      return await getCloudAIResponse(query);
    } catch {
      // Fall back to local if cloud fails
      return await getLocalAIResponse(query);
    }
  }
  
  return await getLocalAIResponse(query);
}

// Text-to-Speech using Web Speech API (works offline)
export function speakText(text: string, lang: string = 'en-US'): void {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  }
}

// Stop speaking
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speech-to-Text using Web Speech API (may require online for some browsers)
export function startListening(
  onResult: (text: string) => void,
  onError: (error: string) => void,
  lang: string = 'en-US'
): (() => void) | null {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition is not supported in this browser.');
    return null;
  }
  
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;
  
  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0].transcript)
      .join('');
    onResult(transcript);
  };
  
  recognition.onerror = (event: any) => {
    onError(event.error);
  };
  
  recognition.start();
  
  // Return stop function
  return () => {
    recognition.stop();
  };
}

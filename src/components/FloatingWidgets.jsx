'use client';

// Single client boundary for all floating UI — imported by the Server Component layout.js
import AIAssistant from './ai-assistant';
import VoiceAssistantButton from './VoiceAssistantButton';

export default function FloatingWidgets() {
  return (
    <>
      {/* AI Chat assistant — fixed bottom-right at 24px */}
      <AIAssistant />
      {/* Voice command button — fixed bottom-right at 96px (stacked above AI chat) */}
      <VoiceAssistantButton position={{ bottom: 96, right: 24 }} />
    </>
  );
}

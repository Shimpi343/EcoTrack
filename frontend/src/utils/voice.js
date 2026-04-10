export const speak = (text) => {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  // prefer female voice if available
  const voices = window.speechSynthesis.getVoices();
  const female = voices.find(v => v.name.toLowerCase().includes("female"));
  if (female) utterance.voice = female;

  window.speechSynthesis.speak(utterance);
};
export const getSmartReply = (input) => {
  const text = input.toLowerCase();

  // 🔌 ELECTRICITY / AC QUESTIONS
  if (
    text.includes("ac") &&
    (text.includes("reduce") || text.includes("reducing"))
  ) {
    // extract hours if present
    const hoursMatch = text.match(/(\d+)\s*(hr|hour|hours)/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 1;

    // AC assumptions (you already used these in project)
    const acPowerKW = 1.5; // 1.5 kW AC
    const gridFactor = 0.82; // kg CO₂ per kWh (CEA conservative)

    const savedCO2 = (acPowerKW * hours * gridFactor).toFixed(2);

    return `🌱 If you reduce AC usage by ${hours} hour(s), you can save approx ${savedCO2} kg of CO₂ per day.

Tips to reduce AC usage:
• Set temperature to 24–26°C   
• Clean AC filters regularly  
• Use curtains to block heat`;
  }

  // 🔌 GENERAL ELECTRICITY
  if (text.includes("electricity")) {
    return `⚡ You can reduce electricity usage by:
• Turning off standby devices  
• Using LED bulbs  
• Limiting AC usage  
• Using energy-efficient appliances`;
  }

  // 🚗 TRANSPORT
  if (text.includes("transport") || text.includes("travel")) {
    return ` Using public transport, carpooling, or walking reduces fuel emissions and CO₂ output.`;
  }

  // 🍽 FOOD
  if (text.includes("food") || text.includes("diet")) {
    return `🥗 Reducing meat consumption and food waste helps lower carbon emissions significantly.`;
  }

  // ❓ FALLBACK
  return `I can help you with electricity, transport, food, lifestyle, and EcoTrack usage 🌱  
Try asking questions like:
• "How can I reduce AC usage?"
• "What if I reduce AC by 2 hours?"
• "How to reduce electricity bill?"`;
};
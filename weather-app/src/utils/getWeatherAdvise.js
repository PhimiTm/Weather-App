export function getWeatherAdvice(weatherCode, maxTemp, currentHour) {
  // ...same logic for generating advice and emoji based on weatherCode, maxTemp, and currentHour

  // Example implementation (replace with your actual logic):
  let advice = '';
  let emoji = '';

  if (weatherCode === 0) {
    advice = 'Clear sky, enjoy your day!';
    emoji = '☀️';
  } else if (weatherCode === 1) {
    advice = 'Partly cloudy, maybe take a light jacket.';
    emoji = '⛅';
  } else {
    advice = 'Weather is unpredictable, stay prepared!';
    emoji = '🌦️';
  }

  return { advice, emoji };
}
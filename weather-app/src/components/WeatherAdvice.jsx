import React from 'react';
import { convertTemp } from '../utils/convertTemp';
import { motion } from 'framer-motion';

function WeatherAdvice({ weather, unit }) {
  if (!weather || !weather.daily || !weather.daily.temperature_2m_max) {
    return null;
  }

  const maxTemp = convertTemp(weather.daily.temperature_2m_max[0], unit);
  const weatherCode = weather.daily.weathercode[0];
  const currentHour = new Date().getHours();

  let advice = '';
  let emoji = 'ℹ️';

  // Determine time of day
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 && currentHour < 21;
  const isNight = currentHour >= 21 || currentHour < 5;

  // Advice by weather code (takes priority)
  if ([95, 96, 99].includes(weatherCode)) {
    advice = 'Thunderstorms expected — stay indoors!';
    emoji = '⛈️';
  } else if ([61, 63, 65].includes(weatherCode)) {
    advice = 'Rain incoming — bring an umbrella!';
    emoji = '🌧️';
  } else {
    // Advice by time + temp
    if (isMorning && maxTemp < 15) {
      advice = 'Chilly morning — light sweater recommended.';
      emoji = '🧥';
    } else if (isAfternoon && maxTemp > 30) {
      advice = 'Hot afternoon — stay hydrated!';
      emoji = '🥵';
    } else if (isEvening && maxTemp < 15) {
      advice = 'Cool evening — a hoodie might help!';
      emoji = '🧣';
    } else if (isNight && maxTemp < 10) {
      advice = 'Cold night — dress warmly!';
      emoji = '🌙';
    } else {
      advice = 'Weather looks pleasant right now! You might want to enjoy it outside.';
      emoji = '😊';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-100 via-white to-indigo-50 border border-indigo-200 shadow-md text-sm text-indigo-900 animate-pulse-slow"
    >
      <span className="text-lg">{emoji}</span>
      <span>{advice}</span>
    </motion.div>
  );
}

export default WeatherAdvice;
import React from 'react';
import { convertTemp } from '../utils/convertTemp';
import { motion } from 'framer-motion';

const weatherAdviceOptions = {
  thunderstorm: [
    { text: 'Thunderstorms expected — stay indoors!', emoji: '⛈️' },
    { text: 'Lightning alert — seek shelter immediately!', emoji: '⚡' },
    { text: 'Stormy weather ahead — best to stay home!', emoji: '🏠' }
  ],
  rain: [
    { text: 'Rain incoming — bring an umbrella!', emoji: '🌧️' },
    { text: 'Wet weather ahead — waterproof gear recommended!', emoji: '☔' },
    { text: 'Rainy day — dont forget your raincoat!', emoji: '🧥' }
  ],
  chillyMorning: [
    { text: 'Chilly morning — light sweater recommended.', emoji: '🧥' },
    { text: 'Brisk start — layer up for comfort!', emoji: '🧣' },
    { text: 'Cool morning — grab a warm coffee!', emoji: '☕' }
  ],
  hotAfternoon: [
    { text: 'Hot afternoon — stay hydrated!', emoji: '🥵' },
    { text: 'Peak heat — find some shade!', emoji: '⛱️' },
    { text: 'Scorching day — remember sunscreen!', emoji: '🧴' }
  ],
  coolEvening: [
    { text: 'Cool evening — a hoodie might help!', emoji: '🧣' },
    { text: 'Chilly night ahead — time to bundle up!', emoji: '🧥' },
    { text: 'Evening cooling down — grab a jacket!', emoji: '🧥' }
  ],
  coldNight: [
    { text: 'Cold night — dress warmly!', emoji: '🌙' },
    { text: 'Freezing night — extra layers needed!', emoji: '🧊' },
    { text: 'Chilly night ahead — time for hot chocolate!', emoji: '☕' }
  ],
  pleasant: [
    { text: 'Weather looks pleasant! Perfect for outdoor activities.', emoji: '😊' },
    { text: 'Beautiful weather! Great time for a walk.', emoji: '🚶' },
    { text: 'Lovely conditions! Enjoy the outdoors!', emoji: '🌞' }
  ]
};

// Add this helper function before the WeatherAdvice component
const getRandomAdvice = (condition) => {
  const options = weatherAdviceOptions[condition];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
};

function WeatherAdvice({ weather, unit }) {
  if (!weather || !weather.daily || !weather.daily.temperature_2m_max) {
    return null;
  }

  const maxTemp = weather.daily.temperature_2m_max[0]; // Remove conversion here
  const weatherCode = weather.daily.weathercode[0];
  const currentHour = new Date().getHours();

  // Convert threshold temperatures based on unit
  const getThreshold = (celsiusTemp) => {
    return unit === 'fahrenheit' ? (celsiusTemp * 9/5) + 32 : celsiusTemp;
  };

  let adviceObj;

  // Determine time of day
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 && currentHour < 21;
  const isNight = currentHour >= 21 || currentHour < 5;

  // Advice by weather code (takes priority)
  if ([95, 96, 99].includes(weatherCode)) {
    adviceObj = getRandomAdvice('thunderstorm');
  } else if ([61, 63, 65].includes(weatherCode)) {
    adviceObj = getRandomAdvice('rain');
  } else {
    // Advice by time + temp
    if (isMorning && maxTemp < getThreshold(15)) {
      adviceObj = getRandomAdvice('chillyMorning');
    } else if (isAfternoon && maxTemp > getThreshold(30)) {
      adviceObj = getRandomAdvice('hotAfternoon');
    } else if (isEvening && maxTemp < getThreshold(15)) {
      adviceObj = getRandomAdvice('coolEvening');
    } else if (isNight && maxTemp < getThreshold(10)) {
      adviceObj = getRandomAdvice('coldNight');
    } else {
      adviceObj = getRandomAdvice('pleasant');
    }
  }

  // Convert temperature only for display if needed
  const displayTemp = convertTemp(maxTemp, unit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-100 via-white to-indigo-50 border border-indigo-200 shadow-md text-sm text-indigo-900 animate-pulse-slow"
    >
      <span className="text-lg">{adviceObj.emoji}</span>
      <span>{adviceObj.text}</span>
    </motion.div>
  );
}

export default WeatherAdvice;
import React from 'react';
import { convertTemp } from "../utils/convertTemp";

function WeeklyForecast({ weather, unit }) {
  const weatherDetails = {
    0: { icon: '☀️', desc: 'Clear sky', bg: 'bg-yellow-100' },
    1: { icon: '🌤️', desc: 'Mainly clear', bg: 'bg-yellow-100' },
    2: { icon: '⛅', desc: 'Partly cloudy', bg: 'bg-gray-200' },
    3: { icon: '☁️', desc: 'Overcast', bg: 'bg-gray-300' },
    45: { icon: '🌫️', desc: 'Fog', bg: 'bg-gray-300' },
    48: { icon: '🌫️', desc: 'Rime fog', bg: 'bg-gray-300' },
    51: { icon: '🌦️', desc: 'Light drizzle', bg: 'bg-blue-200' },
    61: { icon: '🌧️', desc: 'Rain', bg: 'bg-blue-200' },
    71: { icon: '❄️', desc: 'Snow', bg: 'bg-blue-100' },
    73: { icon: '❄️', desc: 'Moderate snow', bg: 'bg-blue-100' },
    75: { icon: '❄️', desc: 'Heavy snow', bg: 'bg-blue-100' },
    95: { icon: '⛈️', desc: 'Thunderstorm', bg: 'bg-purple-200' },
  };

  const getTempColor = (temp) => {
    if (temp > 30) return 'text-red-500';
    if (temp > 20) return 'text-orange-500';
    if (temp > 10) return 'text-yellow-600';
    return 'text-blue-500';
  };

  if (
    !weather ||
    !weather.daily ||
    !weather.daily.time ||
    weather.daily.time.length === 0 ||
    !weather.daily.temperature_2m_min ||
    !weather.daily.temperature_2m_max ||
    !weather.daily.weathercode
  ) {
    return <p className="text-gray-500">Loading weekly forecast...</p>;
  }

  const dailyData = weather.daily;
  const forecast = dailyData.time.map((date, index) => ({
    date,
    min: dailyData.temperature_2m_min[index],
    max: dailyData.temperature_2m_max[index],
    code: dailyData.weathercode[index],
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
      {forecast.map((day, index) => {
        const dayName = new Date(day.date).toLocaleDateString('en-US', {
          weekday: 'short',
        });

        const weather = weatherDetails[day.code] || {
          icon: '❓',
          desc: 'Unknown',
          bg: 'bg-neutral-100',
        };

        const maxTemp = convertTemp(day.max, unit);
        const minTemp = convertTemp(day.min, unit);

        const tempColor = getTempColor(maxTemp);

        return (
          <div
            key={index}
            className={`rounded-xl shadow-sm p-4 text-center transition-colors duration-300 ${weather.bg}`}
            title={weather.desc}
          >
            <p className="font-medium">{dayName}</p>
            <div className="text-3xl my-2">{weather.icon}</div>
            <p className="text-xs text-gray-700">{weather.desc}</p>
            <p className={`text-sm font-semibold mt-1 ${tempColor}`}>
              {Math.round(maxTemp)}° / {Math.round(minTemp)}° {unit}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default WeeklyForecast;
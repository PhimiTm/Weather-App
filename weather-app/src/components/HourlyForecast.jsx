import React from 'react';
import { convertTemp } from '../utils/convertTemp'; // Adjust path if needed

const getWeatherEmoji = (code, hour) => {
  // Check if it's nighttime (between 6 PM and 6 AM)
  const isNight = hour < 6 || hour >= 18;

  const mapping = {
    0: isNight ? '🌑' : '☀️',           // Clear sky (dark moon for night)
    1: isNight ? '☁️🌑' : '🌤️',        // Partly cloudy
    2: isNight ? '☁️' : '⛅',           // Cloudy
    3: '☁️',                           // Overcast
    45: '🌫️',                          // Foggy
    48: '🌫️',                          // Depositing rime fog
    51: isNight ? '🌧️' : '🌦️',        // Light drizzle
    61: '🌧️',                          // Rain
    71: '🌨️',                          // Snow
    95: '⛈️',                          // Thunderstorm
    default: '❓'
  };
  return mapping[code] || mapping.default;
};

function HourlyForecast({ hourly, unit = "celsius" }) {
  if (
    !hourly ||
    !hourly.time ||
    !hourly.temperature_2m ||
    !hourly.weathercode ||
    hourly.time.length === 0 ||
    hourly.temperature_2m.length === 0 ||
    hourly.weathercode.length === 0
  ) {
    return <p className="text-gray-500">Loading hourly forecast...</p>;
  }

  const currentHour = new Date().getHours();
  const currentIndex = hourly.time.findIndex(time => new Date(time).getHours() === currentHour);

  const start = currentIndex >= 0 && currentIndex < hourly.time.length ? currentIndex : 0;
  const end = Math.min(start + 9, hourly.time.length);

  const hours = hourly.time.slice(start, end).map((time, i) => {
    const index = start + i;

    const temperature = hourly.temperature_2m[index];
    const wind = hourly.wind_speed_10m ? hourly.wind_speed_10m[index] : null;
    const code = hourly.weathercode[index];

    if (temperature === undefined || code === undefined) {
      return null;
    }

    const hour = new Date(time).getHours();

    return {
      time: new Date(time),
      formattedHour: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: temperature,
      wind: wind,
      code: code,
      isNow: hour === currentHour
    };
  }).filter(Boolean);


  // 💡 Convert full unit to abbreviation for display
  const unitAbbreviation = unit === 'fahrenheit' ? 'F' : 'C';

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Hourly Forecast</h2>
      <div className="flex overflow-x-auto space-x-9 pb-2">
        {hours.map((hour, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md min-w-[100px] ${
              hour.isNow ? 'bg-blue-100 border border-blue-500' : 'bg-white'
            }`}
          >
            <p className="text-sm text-gray-600">{hour.formattedHour}</p>
            <p className="text-2xl">{getWeatherEmoji(hour.code, hour.time.getHours())}</p>
            <p className="text-lg font-bold">
              {Math.round(convertTemp(hour.temperature, unit))}°{unitAbbreviation}
            </p>

            {hour.wind !== null && (
              <p className="text-xs text-gray-500">💨 {hour.wind} km/h</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
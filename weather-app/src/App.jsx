import './App.css';
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import WeeklyForecast from './components/WeeklyForecast';
import Highlights from './components/Highlights';
import HourlyForecast from './components/HourlyForecast';
import { fetchWeather } from './utils/fetchWeather';
import WeatherAdvice from './components/WeatherAdvice';
import DarkModeToggle from './components/DarkModeToggle';
import WeatherHeadlines from './components/WeatherHeadlines';
// import { getWeatherAdvice } from './utils/getWeatherAdvice';



function App() {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('celsius');
  const [hourlyData, setHourlyData] = useState(null);

  const lat = -26.2041;
  const lon = 28.0473;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWeather(lat, lon);
      if (data) {
        setWeather({
          location_name: "Johannesburg",
          ...data,
        });
        setHourlyData(data.hourly);
      }
    };

    fetchData();
  }, [lat, lon]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleWeatherChange = (newWeather) => {
    setWeather(newWeather);
    setHourlyData(newWeather.hourly);
  };

  // 🛠️ Move this logic inside the function and protect it with weather checks
  let advice = '';
let emoji = '';
if (
  weather &&
  weather.daily &&
  weather.daily.weather_code &&
  weather.daily.temperature_2m_max &&
  weather.daily.weather_code.length > 0 &&
  weather.daily.temperature_2m_max.length > 0
) {
  const weatherCode = weather.daily.weather_code[0];
  const maxTemp = weather.daily.temperature_2m_max[0];
  const currentHour = new Date().getHours();

  const result = getWeatherAdvice(weatherCode, maxTemp, currentHour);
  advice = result.advice;
  emoji = result.emoji;
}



  return (
    <div className="min-h-screen flex font-sans">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-full md:w-1/3 lg:w-1/4 bg-white shadow-md dark:bg-gray-800 dark:text-white overflow-y-auto z-20">
        <Sidebar onWeatherChange={handleWeatherChange} unit={unit} />
      </aside>

      {/* Main Content */}
      <main className="w-full md:ml-[24.333333%] lg:ml-1/4 min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-600 dark:to-gray-800 transition-colors duration-200">
        <div className="p-6">
          <div className="flex items-center justify-end mb-4 space-x-3">
            <DarkModeToggle />
            {/* Unit toggle switch */}
          </div>

          <div className="flex items-center justify-end mb-4 space-x-3">
            <span className="text-sm font-medium text-gray-700 dark:text-white">°C</span>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={unit === 'fahrenheit'}
                onChange={toggleUnit}
                className="sr-only peer"
              />
              <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-500 transition"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
            </label>
            <span className="text-sm font-medium text-gray-700 dark:text-white">°F</span>
          </div>

          {weather?.location_name && (
          <>
            <h2 className="text-4xl font-semibold text-center text-gray-800 mb-7 dark:text-white">
              Weather Forecast for {weather.location_name}
            </h2>
            <div className="flex justify-center mb-4">
              {weather && <WeatherAdvice weather={weather} unit={unit} />}
            </div>
          </>
        )}

          {/* 🕐 Hourly Forecast */}
          <HourlyForecast hourly={hourlyData} unit={unit} />

          {/* 📆 Weekly Forecast */}
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Weekly Forecast</h2>
          <WeeklyForecast weather={weather} unit={unit} />

          {/* ☀️ Today's Highlights */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 dark:text-white">Today's Highlights</h2>
          <Highlights weather={weather} unit={unit} />

          {/* ☁️ Weather Headlines */}
          <WeatherHeadlines />

        </div>
      </main>
    </div>
  );
}

export default App;
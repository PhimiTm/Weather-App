import React, { useEffect, useState } from 'react';
import { convertTemp } from "../utils/convertTemp";
import { fetchWeather } from '../utils/fetchWeather'; // Import the shared utility
import axios from 'axios'; // Keep axios for geocoding

function Sidebar({ onWeatherChange, unit }) {
  const [current, setCurrent] = useState(null);
  const [location, setLocation] = useState({ name: '', lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [suggestions, setSuggestions] = useState([]);


  const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️', 71: '❄️', 73: '❄️', 75: '❄️', 95: '⛈️',
  };

  const weatherDescriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle',
    53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain',
    63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow',
    73: 'Moderate snow', 75: 'Heavy snow', 95: 'Thunderstorm',
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Removed the local fetchWeather function, now using the imported one

  const fetchCityCoords = async (query) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      if (res.data.length === 0) {
        console.error('City not found');
        return;
      }
      const { lat, lon, display_name } = res.data[0];
      const weatherData = await fetchWeather(parseFloat(lat), parseFloat(lon)); // Use shared utility
      if (weatherData) {
        const fullWeather = {
          location_name: display_name.split(',')[0],
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          current: weatherData.current,
          hourly: weatherData.hourly,
          daily: weatherData.daily,
        };
        setCurrent(weatherData.current);
        setLocation({ name: display_name.split(',')[0], lat: parseFloat(lat), lon: parseFloat(lon) });
        if (onWeatherChange) {
          onWeatherChange(fullWeather);
        }
      }
    } catch (err) {
      console.error('City lookup failed:', err);
    } finally {
      setLoading(false); // Ensure loading is set to false even on city lookup failure
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCityCoords(searchQuery.trim());
    }
  };

  useEffect(() => {
  const fetchSuggestions = async () => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`
      );
      setSuggestions(res.data || []);
      console.log("Fetched suggestions:", res.data); 
    } catch (err) {
      console.error("Failed to fetch city suggestions:", err);
      setSuggestions([]);
    }
  };

  const debounce = setTimeout(fetchSuggestions, 300);
  return () => clearTimeout(debounce);
}, [searchQuery]);

const handleSuggestionClick = (suggestion) => {
  const city = suggestion.display_name;
  setSearchQuery(city);
  setSuggestions([]);
  fetchCityCoords(city);
};

  useEffect(() => {
    const defaultLat = -26.2041;
    const defaultLon = 28.0473;
    const defaultCity = "Johannesburg";

    const initializeWeather = async (lat, lon, city) => {
      setLoading(true);
      const weatherData = await fetchWeather(lat, lon);
      if (weatherData) {
        const fullWeather = {
          location_name: city,
          lat,
          lon,
          current: weatherData.current,
          hourly: weatherData.hourly,
          daily: weatherData.daily,
        };
        setCurrent(weatherData.current);
        setLocation({ name: city, lat, lon });
        if (onWeatherChange) {
          onWeatherChange(fullWeather);
        }
      }
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const city =
            locRes.data.address.city ||
            locRes.data.address.town ||
            locRes.data.address.village ||
            locRes.data.name ||
            'Your location';
          initializeWeather(latitude, longitude, city);
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          initializeWeather(latitude, longitude, 'Your location');
        }
      },
      (err) => {
        console.error('Geolocation error:', err.message);
        initializeWeather(defaultLat, defaultLon, defaultCity);
      }
    );
  }, []);

  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="space-y-6 text-center text-gray-800 p-6  dark:bg-gray-800 dark:text-white">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Search
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md mt-1 shadow-lg z-50 max-h-48 overflow-y-auto">
            {suggestions.map((sugg, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(sugg)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-700"
              >
                {sugg.display_name.split(",").slice(0, 2).join(", ")}
              </li>
            ))}
          </ul>
        )}
      </form>


      {/* Weather Info */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading weather...</p>
      ) : current ? (
        <>
          <div className="flex flex-col items-center">
            <div className="text-7xl">{weatherIcons[current.weathercode] || '❓'}</div>
            <div className="text-6xl font-bold mt-2">
              {Math.round(convertTemp(current.temperature_2m, unit))}{unitSymbol}
            </div>
            <p className="text-md text-gray-500 mt-1 dark:text-gray-400">
              {weatherDescriptions[current.weathercode] || 'Unknown'}
            </p>
          </div>

          <div className="text-lg mt-4">
            <p className="font-medium text-blue-600 dark:text-blue-400">{location.name}</p>
            <p>{today}</p>
          </div>


        {/* Toggleable Map Section */}
        {location.lat && location.lon && (
            <div className="mt-4">
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300 transition"
                >
                    {showMap ? 'Hide Map' : 'Show Map'}
                </button>

                {showMap && (
                    <div className="mt-9 rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            title="Location Map"
                            width="100%"
                            height="200"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lon - 0.05}%2C${location.lat - 0.05}%2C${location.lon + 0.05}%2C${location.lat + 0.05}&layer=mapnik&marker=${location.lat}%2C${location.lon}`}
                        />
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            Weather Forecast for <span className="font-medium">{location.name}</span>
                        </p>
                    </div>
                )}
            </div>
        )}

        </>
      ) : (
        <p className="text-red-500">Failed to load weather data</p>
      )}
    </div>
  );
}

export default Sidebar;
import React from 'react';
import { convertTemp } from "../utils/convertTemp";
import { Wind } from 'lucide-react';

function Highlights({ weather, unit }) {
    if (!weather) return <p className="text-gray-500">Loading highlights...</p>;
  


  const currentTempRaw = weather?.current?.temperature_2m;
  const currentTemp = currentTempRaw != null ? convertTemp(currentTempRaw, unit) : null;

  const uvIndex = weather?.daily?.uv_index_max?.[0] ?? null;
  const windSpeed = weather?.current?.wind_speed_10m ?? null;
  const windDir = weather?.current?.wind_direction_10m ?? null;
  const humidity = weather?.current?.relative_humidity_2m ?? null;
  const visibility = weather?.current?.visibility ?? null;
  const pressure = weather?.current?.surface_pressure ?? null;
  const sunrise = weather?.daily?.sunrise?.[0] ?? null;
  const sunset = weather?.daily?.sunset?.[0] ?? null;

  const getUVLabel = (uv) => {
    if (uv == null) return 'N/A';
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    return 'High';
  };

  const getHumidityLabel = (humidity) => {
    if (humidity == null) return 'N/A';
    
    if (humidity < 30) return 'Low';
    if (humidity < 70) return 'Normal 👍';
    return 'High 😓';
  };

  const getVisibilityLabel = (visibility) => {
    if (visibility == null) return 'N/A';
    return visibility >= 10000 ? 'Great 😎' : 'Average 😐';
  };

  const getCompassDirection = (degree) => {
  if (degree == null || isNaN(degree)) return 'N/A';

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
};

const getWindDirection = (degree) => {
  if (degree == null || isNaN(degree)) return 'N/A';

  const fullDirections = [
    'North Winds',
    'North Eastly Winds',
    'East Winds',
    'South Eastly Winds',
    'South Winds',
    'South Westly Winds',
    'West Winds',
    'North Westly Winds'
  ];

  const index = Math.round(degree / 45) % 8;
  return fullDirections[index];
};




  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <HighlightCard title="Current Temperature">
        <p className="text-3xl font-bold">
          {currentTemp != null ? `${Math.round(currentTemp)}°${unit === 'fahrenheit' ? 'F' : 'C'}` : 'N/A'}
        </p>
        <p className="text-sm text-gray-500">Now</p>
      </HighlightCard>

      <HighlightCard title="UV Index">
        <p className="text-3xl font-bold text-yellow-500">{uvIndex ?? 'N/A'}</p>
        <p className="text-sm text-gray-500">{getUVLabel(uvIndex)}</p>
      </HighlightCard>

      <HighlightCard title="Wind Status">
        <p className="text-3xl font-bold">
          {windSpeed != null ? `${windSpeed} km/h` : 'N/A'}
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
           { windDir != null ? (
            <>
              <Wind className="text-blue-400" size={30} />
              {getWindDirection(windDir)}
              
              <span
                className="text-gray-400 ml-1 text-xs hover:text-gray-600 transition"
                title={`${windDir}°`}
              >
                ℹ️
              </span>
              
            </>
          ) : 'N/A'}
        </p>
      </HighlightCard>



      <HighlightCard title="">
        <div className="flex items-center justify-between">
          {/* Sunrise */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Sunrise</h3>
            <p className="text-xl font-semibold mt-1 text-yellow-500">
              {sunrise ? new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </p>
          </div>

          {/* Icon */}
          <div className="text-6xl text-orange-400 mx-4">
            <span role="img" aria-label="Sunrise and Sunset">🌄</span>
          </div>

          {/* Sunset */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Sunset</h3>
            <p className="text-xl font-semibold mt-1 text-orange-500">
              {sunset ? new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </p>
          </div>
        </div>
      </HighlightCard>


      <HighlightCard title="Humidity">
        <p className="text-3xl font-bold">{humidity != null ? `${humidity}%` : 'N/A'}</p>
        <p className="text-sm text-gray-500">{getHumidityLabel(humidity)}</p>
      </HighlightCard>

      <HighlightCard title="Visibility">
        <p className="text-3xl font-bold">{visibility != null ? `${Math.round(visibility / 1000)} km` : 'N/A'}</p>
        <p className="text-sm text-gray-500">{getVisibilityLabel(visibility)}</p>
      </HighlightCard>

      {/* <HighlightCard title="Air Pressure">
        <p className="text-3xl font-bold">{pressure != null ? `${pressure} hPa` : 'N/A'}</p>
        <p className="text-sm text-gray-500">Standard: ~1013 hPa</p>
      </HighlightCard> */}
    </div>
  );
}

function HighlightCard({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h4 className="text-lg font-semibold mb-2 text-gray-700">{title}</h4>
      {children}
    </div>
  );
}

export default Highlights;
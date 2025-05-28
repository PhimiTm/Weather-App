export const fetchWeather = async (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,is_day,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure,visibility&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,uv_index_max&hourly=temperature_2m,weathercode,wind_speed_10m&timezone=auto`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Full weather data:", data);
      return data;
    } catch (error) {
      console.error("❌ Failed to fetch full weather data:", error);
      return null;
    }
  };
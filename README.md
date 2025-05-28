# 🌦️ Weather Forecast App

A modern weather forecasting web app built with **React**, **Tailwind CSS v4**, and the **Open-Meteo API**. It provides real-time weather data including hourly, daily, and weekly forecasts — and includes features like unit switching, geolocation support, dark mode, and helpful clothing advice.

---

## 🚀 Features

- 🌍 Geolocation-based weather fetching
- 🕐 Hourly forecast
- 📅 Weekly forecast with icons and color-coded backgrounds
- 🔆 Today's highlights (humidity, UV, wind, etc.)
- ♻️ Unit toggle between °C and °F
- 🌙 Dark mode support (with local storage)
- 👕 Clothing advice based on temperature (e.g., "Take a light jacket")

---

## 🧰 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4
- **API:** [Open-Meteo API](https://open-meteo.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)

---

## Links 
https://roadmap.sh/projects/weather-app

## Project Structure
weather-app/
├── components/
│   ├── Sidebar.jsx
│   ├── WeeklyForecast.jsx
│   ├── HourlyForecast.jsx
│   ├── Highlights.jsx
│   ├── Advice.jsx
│   └── DarkModeToggle.jsx
├── utils/
│   ├── fetchWeather.js
│   └── convertTemp.js
├── App.jsx
├── main.jsx
├── index.css
└── README.md

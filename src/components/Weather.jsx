import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search2.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import sunrise_icon from '../assets/sunrise.png';
import sunset_icon from '../assets/sunset.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(false);
  const [sunData2, setsunData2] = useState({ time: '' });
  const [searchValue, setsearchValue] = useState('');
  const [time, setTime] = useState('');
  const [theme, setTheme] = useState('light');
  const [background, setBackground] = useState('default');

  const apikey = import.meta.env.VITE_WEATHER_API_KEY;

  const handleChange = (event) => {
    setsearchValue(event.target.value);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateBackground = (condition) => {
    const conditionText = condition.toLowerCase();
    if (conditionText.includes('sunny')) setBackground('sunny');
    else if (conditionText.includes('rain')) setBackground('rainy');
    else if (conditionText.includes('cloud')) setBackground('cloudy');
    else if (conditionText.includes('snow')) setBackground('snowy');
    else setBackground('default');
  };

  const search = async (location) => {
    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${location}`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData({
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
        temperature: data.current.temp_c,
        status: data.current.condition.text,
        location: data.location.country,
        time: data.location.localtime,
        place: data.location.name,
        icon: data.current.condition.icon,
      });

      updateBackground(data.current.condition.text);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const search2 = async (location) => {
    try {
      const url2 = `https://api.weatherapi.com/v1/astronomy.json?key=${apikey}&q=${location}`;
      const response2 = await fetch(url2);
      const data2 = await response2.json();

      setsunData2({
        sunrise1: data2.astronomy.astro.sunrise,
        sunset1: data2.astronomy.astro.sunset,
        time: data2.location.localtime,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getValue = () => {
    search(searchValue);
    search2(searchValue);
  };

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;
        search(location);
        search2(location);
      },
      (err) => {
        console.error('Geolocation failed:', err);
        search('London');
        search2('London');
      }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (sunData2.time) {
      const timePart = sunData2.time.split(' ')[1];
      setTime(timePart);
    }
  }, [sunData2]);

  return (
    <div className={`weather ${theme} ${background}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div className="search-bar">
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search location"
        />
        <img className="search_icon" src={search_icon} alt="search" onClick={getValue} />
      </div>

      <div className="box-1">
        <div className="loc">
          <p className="place">{weatherData.place}</p>
          <p className="location">{weatherData.location}</p>
        </div>
        <div className="time">
          <p className="realtime">{time}</p>
          <p className="current-time">current time</p>
        </div>
      </div>

      <div className="box-2">
        <img className="weather-icon" src={`https:${weatherData.icon}`} alt="weather-icon" />
        <p className="temperature">{weatherData.temperature}°C</p>
        <p className="status">{weatherData.status}</p>
      </div>

      <div className="box-3">
        <div className="weather-info">
          <div className="content-1">
            <img className="humidity-icon" src={humidity_icon} alt="humidity" />
            <span className="humidity">humidity</span>
            <p className="data1">{weatherData.humidity}%</p>
          </div>
          <div className="content-2">
            <img className="wind-icon" src={wind_icon} alt="wind" />
            <span className="wind">wind</span>
            <p className="data2">{weatherData.wind} km/hr</p>
          </div>
        </div>
        <div className="weather-info2">
          <div className="content-3">
            <img className="sunrise" src={sunrise_icon} alt="sunrise" />
            <span>sunrise</span>
            <p className="sun-time">{sunData2.sunrise1}</p>
          </div>
          <div className="content-4">
            <img className="sunset" src={sunset_icon} alt="sunset" />
            <span>sunset</span>
            <p className="sun-time">{sunData2.sunset1}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;

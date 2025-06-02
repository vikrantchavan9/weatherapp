import React, { useEffect, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search2.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import sunrise_icon from '../assets/sunrise.png'
import sunset_icon from '../assets/sunset.png'


const Weather = () => {

     const [weatherData, setWeatherData] = useState(false); // weather data
     const [sunData2, setsunData2] = useState({ time: '' });  // sunrise and sunset data
     const [searchValue, setsearchValue ] = useState(""); // search bar
     const [time, setTime] = useState(''); // time
     
     const handleChange = (event) => {
     setsearchValue(event.target.value)
     }

     const search = async (searchValue)=> {
          try {
               const apikey = import.meta.env.VITE_WEATHER_API_KEY;
               const url = `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${searchValue}`;
               const response = await fetch(url);
               const data = await response.json();
               console.log(data.location.localtime,",",data.location.name,",",data.location.country);

               setWeatherData({
                    humidity: data.current.humidity,
                    wind: data.current.wind_kph,
                    temperature: data.current.temp_c,
                    status: data.current.condition.text,
                    location: data.location.country,
                    time: data.location.localtime,
                    place: data.location.name,
                    icon: data.current.condition.icon
               })               
          } catch (error) {
               console.error('Error fetching data:', error);
          }}
         
     const search2 = async (searchValue)=> {
          try {
               const apikey = import.meta.env.VITE_WEATHER_API_KEY;
               const url2 = `https://api.weatherapi.com/v1/astronomy.json?key=${apikey}&q=${searchValue}`;
               const response2 = await fetch(url2);
               const data2 = await response2.json();
     
               setsunData2({
                    sunrise1:data2.astronomy.astro.sunrise,
                    sunset1:data2.astronomy.astro.sunset,
                    time: data2.location.localtime
               })

          } catch (error) {
               console.error('Error fetching data:', error);
          }} 

     useEffect( () => {
          search("London");
          search2("London");
     },[])

     useEffect(() => {
          if (sunData2.time) {
            const timePart = sunData2.time.split(' ')[1];
            setTime(timePart);
          }
        }, [sunData2]);

     const getValue = () => {
          search(searchValue)
          search2(searchValue)
     }

  return (

     <div className="weather">

          <div className="search-bar">
               <input type="text" value = {searchValue} onChange={handleChange} placeholder='Search location' />
               <img className="search_icon" src={search_icon} alt="search-img" onClick={getValue}/>
          </div>
          
          <div className="box-1">
               <div className="loc">
                    <p className='place'>{weatherData.place}</p>
                    <p className='location'>{weatherData.location}</p>
               </div>

               <div className="time">
                    <p className='realtime'>{time}</p>
                    <p className='current-time'>current time</p>
               </div>
          </div>
          

     <div className="box-2">
               <img className="weather-icon" src = {`https://${weatherData.icon}` } alt="weather-icon" />
               <p className='temperature'>{weatherData.temperature}</p>
               <p className='status'>{weatherData.status}</p>

     </div>

     <div className="box-3">
          <div className="weather-info">
               <div className="content-1">
                    <img className="humidity-icon" src= {humidity_icon} alt="humidity-icon" />
                    <span className='humidity'>humidity</span>
                    <p className='data1'>{weatherData.humidity} %</p>
               </div>

               <div className="content-2">
                    <img className="wind-icon" src= {wind_icon} alt="wind-icon" />
                    <span className='wind'>wind</span>
                    <p className='data2'>{weatherData.wind} km/hr</p>
               </div>
          

          </div>
          <div className="weather-info2">
               <div className="content-3">
                         <img className="sunrise" src= {sunrise_icon} alt="humidity-icon" />
                         <span>sunrise</span>
                         <p className="sun-time">{sunData2.sunrise1}</p>
                    </div>

                    <div className="content-4">
                         <img className="sunset" src= {sunset_icon} alt="wind-icon" />
                         <span>sunset</span>
                         <p className="sun-time">{sunData2.sunset1}</p>
                    </div>

          </div>

     </div>
          

     </div>          

  )
}

export default Weather

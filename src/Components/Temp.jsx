import React, { useEffect, useState } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiShowers, WiSnow } from 'weather-icons-react'; 

const API_KEY = 'cc2ed1e89f044f7aaa8107f5fb47ed0e';

function Temp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = async () => {
    setError(null); 
    setWeatherData(null);
    setForecastData([]);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeatherData(data);

      // Fetch the 4-day forecast data
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!forecastResponse.ok) throw new Error('Unable to fetch forecast data'); 
      const forecastData = await forecastResponse.json();
      const filteredForecast = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 4); 
      setForecastData(filteredForecast);
    } catch (error) {
      setError('Input Correct City Name.'); 
      console.error('Error fetching weather data:', error);
    }
  };

  const handleCurrentLocation = async () => {
    setError(null); 
    setWeatherData(null);
    setForecastData([]);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`  // Use metric units for Celsius
          );
          if (!response.ok) throw new Error('Unable to fetch data'); // Added error handling for response
          const data = await response.json();
          setWeatherData(data);

          // Fetch the 4-day forecast data
          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`  // Use metric units for Celsius
          );
          if (!forecastResponse.ok) throw new Error('Unable to fetch forecast data');
          const forecastData = await forecastResponse.json();
          const filteredForecast = forecastData.list.filter((item, index) => index % 8 === 0);
          setForecastData(filteredForecast);
        } catch (error) {
          setError('Error fetching weather data using your location.');
          console.error('Error fetching weather data:', error);
        }
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

 
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WiDaySunny size={50} color="#FFD700" />;
      case 'Clouds':
        return <WiCloudy size={50} color="#B0C4DE" />;
      case 'Rain':
        return <WiRain size={50} color="#00BFFF" />;
      case 'Showers':
        return <WiShowers size={50} color="#1E90FF" />;
      case 'Snow':
        return <WiSnow size={50} color="#ADD8E6" />;
      default:
        return <WiCloudy size={50} color="#B0C4DE" />;
    }
  };

  return (
    <>
      <div>
        <header className="bg-warning text-center py-3">
          <h1 className="fw-bold h3 text-white my-1">Weather Dashboard</h1>
        </header>

        <div className="container-fluid my-4 weather-data">
          <div className="row">
            <div className="col-xxl-3 col-md-4 px-lg-4">
              <h5 className="fw-bold">Enter a City Name</h5>
              <input
                type="text"
                id="city-input"
                value={city}
                onChange={handleCityChange}
                className="py-2 form-control"
                placeholder="E.g., New York, London, Tokyo"
              />
              <button
                id="search-btn"
                onClick={handleSearch}
                className="btn btn-warning py-2 w-100 mt-3 mb-2"
              >
                Search
              </button>

              <button
                id="location-btn"
                onClick={handleCurrentLocation}
                className="btn btn-secondary py-2 w-100 mt-2"
              >
                Use Current Location
              </button>
            </div>
            <div className="col-xxl-9 col-md-8 mt-md-1 mt-4 pe-lg-4">
              {error && <p className="text-danger">{error}</p>}

              {weatherData && (
                <div className="current-weather bg-warning text-white py-2 px-4 rounded-3">
                  <div className="mt-3 d-flex justify-content-between">
                    <div>
                      <h3 className="fw-bold">
                        {weatherData.name} ({new Date().toLocaleDateString()})
                      </h3>
                      <h6 className="my-3 mt-3">
                        Temperature: {Math.round(weatherData.main.temp)}°C
                      </h6>
                      <h6 className="my-3">
                        Wind: {weatherData.wind.speed} M/S
                      </h6>
                      <h6 className="my-3">
                        Humidity: {weatherData.main.humidity}%
                      </h6>
                    </div>
                    <div>
                      {getWeatherIcon(weatherData.weather[0].main)}
                    </div>
                  </div>
                </div>
              )}

              {forecastData.length > 0 && (
                <>
                  <h4 className="fw-bold my-4">4-Day Forecast</h4>
                  <div className="days-forecast row row-cols-1 row-cols-sm-2 row-cols-lg-4 row-cols-xl-5 justify-content-between">
                    {forecastData.map((item, index) => (
                      <div className="col mb-3" key={index}>
                        <div className="card border-0 bg-secondary text-white">
                          <div className="card-body p-3 text-white">
                            <h5 className="card-title fw-semibold">
                              {new Date(item.dt * 1000).toLocaleDateString()}
                            </h5>
                            {getWeatherIcon(item.weather[0].main)}
                            <div className="d-flex align-items-center">
                              
                              <div className="ms-3">
                                <h6 className="card-text my-3 mt-3">
                                  Temp: {Math.round(item.main.temp)}°C
                                </h6>
                                <h6 className="card-text my-3">
                                  Wind: {item.wind.speed} M/S
                                </h6>
                                <h6 className="card-text my-3">
                                  Humidity: {item.main.humidity}%
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Temp;

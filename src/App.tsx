import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react';
import './App.css';

interface Location {
  latitude: number;
  longitude: number;
}

interface Weather {
  city: {
    name: string;
    id: number;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
  cnt: number;
  cod: string;
  list: [
    {
      dt: number;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
      };
    }
  ];
  message: number;
}

interface City {
  id: number;
  name: string;
  lon: number;
  lat: number;
}

const cities = [
  {
    id: 0,
    name: 'London',
    lon: -0.1278,
    lat: 51.5074,
  },
  {
    id: 1,
    name: 'Paris',
    lon: 2.3522,
    lat: 48.8566,
  },
  {
    id: 2,
    name: 'Tokyo',
    lon: 139.6917,
    lat: 35.6895,
  },
  {
    id: 3,
    name: 'Rio De Janeiro',
    lon: -43.1729,
    lat: -22.9068,
  },
  {
    id: 4,
    name: 'Mexico City',
    lon: -99.1332,
    lat: 19.4326,
  },
];

function App() {
  const [weather, setWeather] = useState<Weather>();
  const [location, setLocation] = useState<Location>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectedCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = cities.find((city) => city.id === +event.target.value);
    console.log(selectedCity);

    const location = {
      latitude: selectedCity!.lat,
      longitude: selectedCity!.lon,
    };
    fetchWeather(location);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  const fetchWeather = async (location: Location) => {
    if (location) {
      setLoading(true);
      const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=63fecd75520bd0cbbca13cbd49b2478f&units=metric`);
      const resp = await data.json();

      console.log(resp);
      setWeather(resp);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location!);
  }, [location]);

  if (loading) {
    return <div className='spinner'></div>
  }

  return (
    <main>
      {!weather && <button onClick={getCurrentLocation}>Get Weather In Your Location</button>}
      {weather && (
        <section>
          <select onChange={handleSelectedCity}>
            <option> Seleccione una ciudad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <h1>{weather.city.name}</h1>
          <ul>
            {weather.list.map((day) => {
              return <li key={day.dt}>{day.main.temp}</li>;
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;

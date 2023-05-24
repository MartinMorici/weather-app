import { useEffect, useState } from 'react';
import './App.css';

interface Location {
  latitude: number;
  longitude: number;
}

function App() {
  const [weather, setWeather] = useState();
  const [location, setLocation] = useState<Location>();

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
      const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=63fecd75520bd0cbbca13cbd49b2478f`);
      const resp = await data.json();

      console.log(resp);
      
    

    }
  };

  useEffect(() => {
    fetchWeather(location!);
  }, [location]);

  return (
    <>
      <button onClick={getCurrentLocation}>Get Location</button>
    </>
  );
}

export default App;

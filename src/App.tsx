import './App.css';
import { useEffect, useState } from 'react';
import { Location, Weather } from './utilities/types';
import { cities } from './utilities/cities';
import Water from './assets/water-solid.svg';
import Wind from './assets/wind-solid.svg';
import Cloudsun from './assets/cloud-sun-rain-solid.svg';

function App() {
  const [weather, setWeather] = useState<Weather>();
  const [location, setLocation] = useState<Location>();
  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<number | undefined>();

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

      const { 0: first, 8: second, 16: third, 24: fourth, 32: fifth, 39: sixth } = resp.list;
      const filteredList = [first, second, third, fourth, fifth, sixth];

      setWeather({ ...resp, list: filteredList });
      setActive(filteredList[0].dt);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location!);
  }, [location]);

  if (loading) {
    return <div className='spinner mx-auto w-full'></div>;
  }

  return (
    <main className='w-full'>
      {!weather && (
        <>
          <button className='text-xl' onClick={getCurrentLocation}>
            Get Weather In Your Location
          </button>
          <h2 className='my-6 font-bold text-2xl'>OR</h2>
        </>
      )}
      <select className='w-[200px] py-[0.6em] text-xl text-center' onChange={handleSelectedCity}>
        <option> Select a City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
      {weather && (
        <section className='flex justify-center h-[300px] mt-8'>
          {weather.list.map((day) => {
            const fecha = new Date(day.dt * 1000);
            return active === day.dt ? (
              <article className='cursor-pointer even:bg-[#272936] bg-[#323546] mb-4 max-w-[400px] w-full transition-all' key={day.dt}>
                <header className='even:bg-[#272936] flex justify-between py-2 px-4 bg-[#2C2F3E]'>
                  <span>{fecha.toLocaleString('en-EN', { weekday: 'long' })}</span>
                  <div className='flex gap-1'>
                    <span>{fecha.toLocaleString('en-EN', { day: 'numeric' })}</span>
                    <span>{fecha.toLocaleString('en-EN', { month: 'short' })}</span>
                  </div>
                </header>
                <main className=' px-4 mb-7 '>
                  <h2 className='text-left pt-6 mb-4 '>{weather.city.name}</h2>
                  <div className='flex items-end'>
                    <h2 className='font-bold text-8xl mt-[-5px]'>{day.main.temp.toFixed(0)}°C</h2>
                    <img className='w-32 h-[90px] object-cover  ml-4' src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='' />
                  </div>
                </main>
                <footer className='flex text-sm items-center gap-4 px-4 pb-8 text-[#7A7D84] font-semibold '>
                  <div className='flex '>
                    <img className='w-[22px]' src={Water} alt='' />
                    <span className='block ml-1'>{day.main.humidity}%</span>
                  </div>
                  <div className='flex'>
                    <img className='w-[22px]' src={Wind} alt='' />
                    <span className='block ml-1'>{(day.wind.speed * 3.6).toFixed(1)}km/h</span>
                  </div>
                  <div className='flex'>
                    <img className='w-[22px]' src={Cloudsun} alt='' />
                    <span className='block ml-1'>{day.weather[0].main}</span>
                  </div>
                </footer>
              </article>
            ) : (
              <article className='cursor-pointer  even:bg-[#272936] flex flex-col justify-center items-center bg-[#323546] mb-4 max-w-[150px] w-full transition-all' key={day.dt} onClick={() => setActive(day.dt)}>
                <header className='even:bg-[#272936] flex justify-center py-2 px-4 bg-[#2C2F3E] w-full'>
                  <span>{fecha.toLocaleString('en-EN', { weekday: 'long' })}</span>
                </header>
                <main className='flex-1 px-4 mb-7 justify-center items-center flex '>
                  <div className='flex flex-col  justify-center items-center'>
                    <img className='w-22 h-[3.5rem] object-cover mb-2 ml-4' src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='' />
                    <h2 className='font-bold text-4xl mt-[-5px]'>{day.main.temp.toFixed(0)}°C</h2>
                    <h3 className='text-[#7A7D84] font-semibold mt-1 text-lg'>{Math.round(day.main.temp_min)} °C</h3>
                  </div>
                </main>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
{
  /* Temp: {Math.round(day.main.temp)} Max: {Math.round(day.main.temp_max)} Min: {Math.round(day.main.temp_min)}
Wind: {(day.wind.speed * 3.6).toFixed(1)} km/h Fecha:{fecha.toLocaleString('en-EN', { weekday: 'long', day: 'numeric', month: 'short' })}
{day.weather[0].main} */
}

export default App;

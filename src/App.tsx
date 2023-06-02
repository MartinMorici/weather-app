import './App.css';
import { useEffect, useState } from 'react';
import { Location, Weather } from './types';
import { cities } from './cities';
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

      const { 0: first, 8: second, 16: third, 24: fourth, 32: fifth } = resp.list;
      const filteredList = [first, second, third, fourth, fifth];

      setWeather({ ...resp, list: filteredList });
      setActive(filteredList[0].dt);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location!);
  }, [location]);

  if (loading) {
    return <div className='spinner'></div>;
  }

  return (
    <main className='w-full'>
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

          <section className='flex justify-center'>
            {weather.list.map((day) => {
              const fecha = new Date(day.dt * 1000);
              return active === day.dt ? (
                <article className='rounded-l-xl bg-[#323546] mb-4 max-w-[400px] w-full' key={day.dt}>
                  <header className='flex justify-between rounded-tl-xl py-2 px-4 bg-[#2C2F3E]'>
                    <span>{fecha.toLocaleString('en-EN', { weekday: 'long' })}</span>
                    <div className='flex gap-1'>
                      <span>{fecha.toLocaleString('en-EN', { day: 'numeric' })}</span>
                      <span>{fecha.toLocaleString('en-EN', { month: 'short' })}</span>
                    </div>
                  </header>
                  <main className=' px-4 mb-7 '>
                    <h2 className='text-left pt-6 mb-4 '>{weather.city.name}</h2>
                    <div className='flex items-end'>
                      <h2 className='font-bold text-6xl mt-[-5px]'>{day.main.temp.toFixed(0)}°C</h2>
                      <img className='w-28 h-[3.5rem] object-cover mb-[-2px] ml-4' src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='' />
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
                <article className='flex flex-col justify-center items-center bg-[#323546] mb-4 max-w-[150px] w-full' key={day.dt} onClick={() => setActive(day.dt)}>
                  <header className='flex justify-center py-2 px-4 bg-[#2C2F3E] w-full'>
                    <span>{fecha.toLocaleString('en-EN', { weekday: 'long' })}</span>
                  </header>
                  <main className='flex-1 px-4 mb-7 justify-center items-center flex '>
                    <div className='flex flex-col  justify-center items-center'>
                      <img className='w-22 h-[3.5rem] object-cover mb-2 ml-4' src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='' />
                      <h2 className='font-bold text-4xl mt-[-5px]'>{day.main.temp.toFixed(0)}°C</h2>
                    </div>
                  </main>
                </article>
              );
            })}
          </section>
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

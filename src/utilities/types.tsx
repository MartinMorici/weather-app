export interface Location {
  latitude: number;
  longitude: number;
}

export interface Weather {
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
      dt_txt: string;
      main: {
        temp: number;
        temp_max: number;
        temp_min: number;
        humidity: number;
      };
      weather: [
        {
          icon: string;
          main: string;
        }
      ];
      wind: {
        speed: number;
      };
    }
  ];
  message: number;
}

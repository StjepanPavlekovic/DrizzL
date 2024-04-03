//current for location:
// https://samples.openweathermap.org/data/2.5/weather?q=London&appid=b1b15e88fa797225412429c1c50c122a1

//Icons: https://openweathermap.org/img/wn/<icon_id>@2x.png

//hourly:
//

import Forecast from "../models/forecast";

export default class WeatherService {
  constructor() {
    this.appId = "0e027b1161722328666fd6ccbdcd1323";
  }

  getIconUrl(id) {
    return `https://openweathermap.org/img/wn/${id}@2x.png`;
  }

  async getForecastForLocation(location) {
    let forecast = null;

    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.appId}`,
      { mode: "cors" }
    )
      .then(async (res) => {
        let data = await res.json();
        console.log(data);
        if (data && data.cod === 200) {
          forecast = new Forecast(
            data.main.temp,
            data.main.temp_min,
            data.main.temp_max,
            data.wind.speed,
            data.wind.deg,
            this.getIconUrl(data.weather[0].icon),
            null
          );
        } else {
          return null;
        }
      })
      .catch(() => {
        return null;
      });

    return forecast;
  }

  async getHourlyForecastForLocation(location) {
    let hourlyForecast = null;

    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${this.appId}`
    ).then(async (res) => {
      let data = await res.json();
    });
  }
}

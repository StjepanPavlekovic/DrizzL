import Forecast from "../models/forecast";
import CachingService from "./caching-service";

export default class WeatherService {
  constructor(cachingService) {
    this.appId = "0e027b1161722328666fd6ccbdcd1323";
    this.cachingService = cachingService;
  }

  getIconUrl(id) {
    return `https://openweathermap.org/img/wn/${id}@2x.png`;
  }

  async getForecastForLocation(location) {
    let forecast = null;

    let cachedForecast = this.cachingService.getForecastForQuery(location);
    if (cachedForecast && cachedForecast !== undefined) {
      return cachedForecast.forecast;
    }

    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.appId}`,
      { mode: "cors" }
    )
      .then(async (res) => {
        let data = await res.json();
        if (data && data.cod === 200) {
          forecast = new Forecast(
            data.main.temp,
            data.main.temp_min,
            data.main.temp_max,
            data.wind.speed,
            data.wind.deg,
            this.getIconUrl(data.weather[0].icon),
            null,
            data.name
          );
        } else {
          return null;
        }
      })
      .catch(() => {
        return null;
      });

    this.cachingService.addForecastToCache(location, forecast);
    return forecast;
  }

  async getHourlyForecastForLocation(location) {
    let hourlyForecast = [];

    let cachedForecast = this.cachingService.getForecastForQuery(location);
    if (cachedForecast.hourly && cachedForecast.hourly !== undefined) {
      return cachedForecast.hourly;
    }

    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${this.appId}`
    )
      .then(async (res) => {
        let data = await res.json();
        if (data && data.cod === "200") {
          data.list.forEach((forecast) => {
            hourlyForecast.push(
              new Forecast(
                forecast.main.temp,
                forecast.main.temp_min,
                forecast.main.temp_max,
                forecast.wind.speed,
                forecast.wind.deg,
                this.getIconUrl(forecast.weather[0].icon),
                forecast.dt_txt,
                forecast.name
              )
            );
          });
        } else {
          return null;
        }
      })
      .catch(() => {
        return null;
      });
    this.cachingService.addHourlyForecastToCache(location, hourlyForecast);
    return hourlyForecast;
  }
}

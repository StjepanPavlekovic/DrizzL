export default class CachingService {
  constructor() {
    this.cachedForecast = {};
  }

  addForecastToCache(query, forecast) {
    this.cachedForecast[query] = {
      time: new Date(),
      forecast: forecast,
      hourly: null,
    };
  }

  addHourlyForecastToCache(query, hourly) {
    this.cachedForecast[query].hourly = hourly;
  }

  getForecastForQuery(query) {
    if (query in this.cachedForecast) {
      let cached = this.cachedForecast[query];
      let currentTime = new Date();
      let expired =
        (currentTime - cached.time) / (1000 * 60) > 15 ? true : false;

      if (!expired) {
        return this.cachedForecast[query];
      }
    }
    return null;
  }
}

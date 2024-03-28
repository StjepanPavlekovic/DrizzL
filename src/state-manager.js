export default class StateManager {
  constructor() {
    this.currentForecast = null;
    this.hourlyForecast = null;
  }

  getCurrentForecast() {
    return this.currentForecast;
  }

  setCurrentForecast(forecast) {
    this.currentForecast = forecast;
  }

  getHourlyForecast() {
    return this.hourlyForecast;
  }

  setHourlyForecast(hourly) {
    this.hourlyForecast = hourly;
  }
}

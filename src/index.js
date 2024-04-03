import UiManager from "./ui-manager";
import StateManager from "./state-manager";
import WeatherService from "./services/weather-service";
import StorageService from "./services/storage-service";

const storageService = new StorageService();
const stateManager = new StateManager();
const weatherService = new WeatherService();
const uiManager = new UiManager(stateManager, weatherService);

window.onload = async () => {
  stateManager.setCurrentCity("Zagreb");

  // let forecast = await weatherService.getForecastForLocation("Zagreb");

  // let hourlyForecast = await weatherService.getHourlyForecastForLocation(
  //   "Zagreb"
  // );
};

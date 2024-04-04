import UiManager from "./ui-manager";
import StateManager from "./state-manager";
import WeatherService from "./services/weather-service";
import CachingService from "./services/caching-service";

const cachingService = new CachingService();
const stateManager = new StateManager();
const weatherService = new WeatherService(cachingService);
const uiManager = new UiManager(stateManager, weatherService);

// window.onload = async () => {};

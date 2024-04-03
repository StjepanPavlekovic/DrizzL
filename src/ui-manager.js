import Forecast from "./models/forecast";
import * as DOMPurify from "dompurify";

const txtLocation = document.querySelector("#txtLocation");
const btnSearch = document.querySelector("#btnSearch");
const search = document.querySelector(".search");
const loader = document.querySelector("#loader");
const container = document.querySelector(".container");
const mainInfo = document.querySelector(".main-info");
const loadingError = document.querySelector("#loadingError");
const btnRetry = document.querySelector("#btnRetry");
const wrapper = document.querySelector(".wrapper");

let canSearch = true;

export default class UiManager {
  constructor(stateManager, weatherService) {
    this.stateManager = stateManager;
    this.weatherService = weatherService;

    this.setupEventListeners();
  }

  setupEventListeners() {
    txtLocation.addEventListener("paste", (e) => e.preventDefault());
    txtLocation.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.loadForecastForLocation();
      }
    });
    btnRetry.addEventListener("click", () => this.resetView());
    btnSearch.addEventListener("click", () => this.loadForecastForLocation());
  }

  handleLoadError() {
    container.classList.add("hidden");
    search.classList.add("hidden");
    wrapper.classList.add("centered");
    loadingError.classList.remove("hidden");
  }

  toggleLoader() {
    loader.classList.toggle("hidden");
  }

  sanitizeString(str) {
    let stringToPurify =
      str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
    return DOMPurify.sanitize(stringToPurify);
  }

  async loadForecastForLocation() {
    if (!canSearch) {
      return;
    }
    canSearch = false;
    this.stateManager.setCurrentCity(this.sanitizeString(txtLocation.value));
    let city = txtLocation.value;

    this.toggleLoader();
    let forecast = await this.weatherService.getForecastForLocation(city);
    this.toggleLoader();
    if (forecast) {
      this.stateManager.setCurrentForecast(forecast);
      this.populateMainInfo(forecast);
      this.showResults();
    } else {
      this.handleLoadError();
    }

    canSearch = true;
  }

  showResults() {
    search.classList.add("moved");
    container.classList.remove("hidden");
  }

  resetView() {
    txtLocation.value = "";
    search.classList.remove("moved");
    search.classList.remove("hidden");
    container.classList.add("hidden");
    loadingError.classList.add("hidden");
    wrapper.classList.remove("centered");
  }

  populateMainInfo(forecast) {
    mainInfo.innerHTML = "";

    const mainInfoLeft = document.createElement("div");
    mainInfoLeft.className = "main-info-left";

    const cityName = document.createElement("h2");
    cityName.id = "cityName";
    cityName.innerText = this.stateManager.getCurrentCity();
    mainInfoLeft.appendChild(cityName);

    const weatherIcon = document.createElement("img");
    weatherIcon.id = "weatherIcon";
    weatherIcon.src = forecast.icon;
    mainInfoLeft.appendChild(weatherIcon);

    const mainInfoRight = document.createElement("div");
    mainInfoRight.className = "main-info-right";

    const temperature = document.createElement("h3");
    temperature.id = "temperature";
    temperature.innerText = "19.3 °C";
    mainInfoRight.appendChild(temperature);

    let spans = [];
    for (let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      spans.push(span);
    }

    spans[0].innerText = "22.7 °C";
    spans[1].innerText = "11.6 °C";
    spans[2].style.marginTop = "auto";
    spans[2].innerText = "8 ms, 60°";

    spans.forEach((span) => mainInfoRight.appendChild(span));

    mainInfo.appendChild(mainInfoLeft);
    mainInfo.appendChild(mainInfoRight);
  }
}

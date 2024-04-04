import * as DOMPurify from "dompurify";

const txtLocation = document.querySelector("#txtLocation");
const btnSearch = document.querySelector("#btnSearch");
const search = document.querySelector(".search");
const loader = document.querySelector("#loader");
const container = document.querySelector(".container");
const mainInfo = document.querySelector(".main-info");
const details = document.querySelector(".details");
const loadingError = document.querySelector("#loadingError");
const btnRetry = document.querySelector("#btnRetry");
const wrapper = document.querySelector(".wrapper");
const converter = document.querySelector(".converter");
const slider = document.querySelector(".slider");
const hourlyContainer = document.querySelector(".hourly");

let canSearch = true;
let isCelsius = true;

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
    converter.addEventListener("click", () => this.toggleUnits());
  }

  toggleUnits() {
    let forecast = this.stateManager.getCurrentForecast();
    let hourlyForecast = this.stateManager.getHourlyForecast();
    isCelsius = !isCelsius;

    this.populateMainInfo(forecast);
    this.populateDetails(forecast);
    this.populateHourly(hourlyForecast);

    converter.classList.toggle("celsius");
    slider.innerText = isCelsius ? "°C" : "°F";
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
    let stringToPurify = str.trim();
    stringToPurify = stringToPurify.toLowerCase();
    return DOMPurify.sanitize(stringToPurify);
  }

  async loadForecastForLocation() {
    if (txtLocation.value === "" || txtLocation.value.length > 20) return;
    if (!canSearch) {
      return;
    }
    canSearch = false;
    this.stateManager.setCurrentCity(this.sanitizeString(txtLocation.value));
    let city = this.stateManager.getCurrentCity();

    this.toggleLoader();
    let forecast = await this.weatherService.getForecastForLocation(city);
    this.toggleLoader();
    if (forecast) {
      this.stateManager.setCurrentForecast(forecast);
      this.populateMainInfo(forecast);
      this.populateDetails(forecast);

      let hourly = await this.weatherService.getHourlyForecastForLocation(city);

      if (hourly && hourly !== undefined) {
        this.stateManager.setHourlyForecast(hourly);
        this.populateHourly(hourly);
      }
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

    const cityName = document.createElement("h2");
    cityName.id = "cityName";
    cityName.innerText = forecast.cityName;
    mainInfo.appendChild(cityName);

    const weatherIcon = document.createElement("img");
    weatherIcon.id = "weatherIcon";
    weatherIcon.src = forecast.icon;
    mainInfo.appendChild(weatherIcon);
  }

  populateDetails(forecast) {
    details.innerHTML = "";

    const detailsLeft = document.createElement("h2");

    const detailsRight = document.createElement("div");
    detailsRight.className = "details-right";

    detailsLeft.innerText = this.getTempFormatted(forecast.temp);

    let spans = [];
    for (let i = 0; i < 3; i++) {
      const span = document.createElement("span");
      spans.push(span);
    }

    spans[0].innerHTML = `<img src="./public/max.svg">${this.getTempFormatted(
      forecast.tempMax
    )}`;
    spans[1].innerHTML = `<img src="./public/min.svg">${this.getTempFormatted(
      forecast.tempMin
    )}`;
    spans[2].style.marginTop = "auto";
    spans[2].innerHTML = `${
      forecast.windSpeed
    } ms <img src="./public/wind.svg" style="transform: rotate(${
      forecast.windDirection - 180
    }deg); margin-left: auto">`;
    spans[2].style.marginTop = "15px";

    spans.forEach((span) => detailsRight.appendChild(span));

    details.appendChild(detailsLeft);
    details.appendChild(detailsRight);
  }

  populateHourly(hourly) {
    hourlyContainer.innerHTML = "";

    hourly.forEach((forecast) => {
      let div = document.createElement("div");
      div.classList.add("hourly-entry");

      let h4 = document.createElement("h4");
      h4.textContent = this.getTempFormatted(forecast.temp);
      div.appendChild(h4);

      // Create an img element
      let img = document.createElement("img");
      img.src = forecast.icon;
      div.appendChild(img);

      // Create two span elements
      let span1 = document.createElement("span");
      span1.textContent = `${Math.round(forecast.windSpeed * 10) / 10} m/s`;
      div.appendChild(span1);

      let span2 = document.createElement("span");
      let time = new Date(forecast.time);
      span2.textContent = `${time.getHours()}:00`;
      div.appendChild(span2);

      hourlyContainer.appendChild(div);
    });
  }

  getTempFormatted(value) {
    return isCelsius
      ? `${Math.round((value - 273.15) * 10) / 10} °C`
      : `${Math.round(((value - 273.15) * 9) / 5 + 32)} °F`;
  }
}

export default class Forecast {
  constructor(
    temp,
    tempMin,
    tempMax,
    windSpeed,
    windDirection,
    icon,
    time = null,
    cityName
  ) {
    this.temp = temp;
    this.tempMin = tempMin;
    this.tempMax = tempMax;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;
    this.icon = icon;
    this.time = time;
    this.cityName = cityName;
  }
}

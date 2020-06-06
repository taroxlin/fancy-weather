import isoCountries from './countryCodes';
import '../styles/weatherInfo.css';

class WeatherInfo {
  constructor(parent) {
    this.parent = parent;
    this.key = parent.key;
    this.actLang = parent.chL;
    this.actTemp = parent.chT;
    this.init();
  }

  DaysType(a) {
    const { data } = this.parent;
    if (a === 'current') {
      this.todayDay(data[a]);
    } else if (a === 'forecast') {
      this.futureDays(data[a]);
    }
  }

  todayDay(json) {
    const obj = json;
    const cont = document.createElement('div');
    this.element.insertAdjacentElement('afterbegin', cont);
    cont.classList.add('today');
    const country = isoCountries[obj.country_code];
    cont.innerHTML = `<h2>${country}, ${obj.city_name}</h2><h3 class='date-info'></h3><div class = 'today-weather'></div>`;
    this.updateTime();
    this.todayWeather(obj);
  }

  todayWeather(obj) {
    const select = document.getElementsByClassName('today-weather')[0];
    const temp = this.parent.template[this.actLang].addInfo;
    const addInfo = [['wind_spd', `${this.parent.chT === 'C' ? '(m/s)' : '(mph)'}`], ['app_temp', `°${this.parent.chT}`], ['rh', '%']];
    select.innerHTML = `<h1>${obj.temp}°${this.parent.chT}</h1><img src ='./images/weather-icons/${obj.weather.icon}.png' alt ='weather-icon'>
        <div class='today-other-info'></div>`;
    for (let i = 0; addInfo.length > i; i += 1) {
      const infoCont = document.getElementsByClassName('today-other-info')[0];
      const elem = document.createElement('h2');
      infoCont.appendChild(elem);
      elem.innerText = `${temp[i]} ${obj[addInfo[i][0]].toFixed(1)} ${addInfo[i][1]}`;
    }
  }

  updateTime() {
    const select = document.getElementsByClassName('date-info')[0];
    const date = this.parent.actualTime;
    const { months } = this.parent.template[this.actLang];
    const shDay = this.parent.template[this.actLang].shorterDay;
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const time = `${hour}:${mins}`;
    const dateStr = `${shDay[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    select.innerHTML = `${dateStr} ${time}`;
  }

  futureDays(json) {
    const g = document.createElement('div');
    this.element.appendChild(g);
    g.classList.add('future-days');
    for (let i = 1; json.data.length > i; i += 1) {
      this.futureSingleDay(g, json.data[i]);
    }
  }

  futureSingleDay(parent, dailyData) {
    const weekDay = new Date(dailyData.datetime);
    const cont = document.createElement('div');
    const temp = this.parent.template[this.actLang];
    parent.appendChild(cont);
    cont.classList.add('future-day-single');
    const avgTemp = (dailyData.high_temp + dailyData.low_temp) / 2;
    cont.innerHTML = `<h2>${temp.days[weekDay.getDay()]}</h></h2><h4>${avgTemp.toFixed(2)}°${this.parent.chT}</h4><img src=./images/weather-icons/${dailyData.weather.icon}.png></img>`;
  }

  init() {
    this.element = document.createElement('div');
    document.getElementsByClassName('naviRight')[0].after(this.element);
    this.element.classList.add('weather-info');
    this.DaysType('current');
    this.DaysType('forecast');
  }
}

export default WeatherInfo;

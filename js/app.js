import MenuLeft from './menuleft';
import MenuRight from './menuright';
import WeatherInfo from './weatherinfo';
import WeatherMap from './weathermap';
import '../styles/styles.css';

class MainContainer {
  constructor(template) {
    this.template = template;
    this.key = {
      wBit: '619b6dd131094859b162bb2577321b2a',
      openW: '2481fb9c00fa150040b10da0e356266a',
      unsplash: '3_MsUqnMunTYxG5BxHEERe00JaLqQsa7cw8LHZ7rm9c',
    };
    this.lang = ['en', 'pl'];
    this.temp = ['C', 'F'];
    this.chT = localStorage.getItem('temp') ? localStorage.getItem('temp') : this.temp[0];
    this.root = document.getElementsByTagName('body');
    this.parentElem = document.createElement('div');
    this.root[0].appendChild(this.parentElem);
    this.parentElem.classList.add('app');
    this.intervalTime = setInterval(() => {
      this.weatherInf.updateTime();
    }, 60 * 1000);
  }

  initOptions() {
    this.menuLeft = new MenuLeft(this);
  }

  initSearch() {
    this.menuRight = new MenuRight(this);
  }

  initMap() {
    this.weatherMap = new WeatherMap(this);
  }

  initInfo() {
    this.weatherInf = new WeatherInfo(this);
  }

  tagger(time) {
    this.tags = `${this.data.current.weather.description}`;
    if (time.getMonth() > 1 && time.getMonth() < 5) {
      this.tags += ',spring';
    } else if (time.getMonth() > 4 && time.getMonth() < 8) {
      this.tags += ',summer';
    } else if (time.getMonth() > 7 && time.getMonth() < 11) {
      this.tags += ',autumn';
    } else {
      this.tags += ',winter';
    }
    if (time.getHours() >= 6 && time.getHours() <= 9) {
      this.tags += ',morning';
    } else if (time.getHours() >= 10 && time.getHours() <= 17) {
      this.tags += ',day';
    } else if (time.getHours() >= 18 && time.getHours() <= 21) {
      this.tags += ',evening';
    } else {
      this.tags += ',night';
    }
    return this.tags;
  }

  async bodyImageFetch(time) {
    const tags = this.tagger(time);
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tags}&client_id=${this.key.unsplash}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return false;
      })
      .then((response) => response.json())
      .then((data) => {
        this.bodyChange(data.urls.full);
        return true;
      });
  }

  bodyChange(url) {
    const imgUrl = `linear-gradient(to bottom, rgba(255,255,255,0.3) 0%,rgba(255,255,255,0.3) 100%), url(${url})`;
    this.parentElem.style.backgroundImage = imgUrl;
  }

  async feacher() {
    let api = '';
    this.data = {};
    const proper = ['current', 'forecast'];
    const unit = this.chT === 'C' ? 'M' : 'I';
    for (let i = 0; proper.length > i; i += 1) {
      if (proper[i] === 'current') {
        api = `https://api.weatherbit.io/v2.0/current?lat=${this.lat}&lon=${this.lon}&units=${unit}&key=${this.key.wBit}`;
      } else {
        api = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${this.lat}&lon=${this.lon}&days=4&units=${unit}&key=${this.key.wBit}`;
      }
      fetch(api)
        .then((response) => {
          if (response.ok) {
            return response;
          }
          return false;
        })
        .then((response) => response.json())
        .then((data) => {
          if (proper[i] === 'current') {
            const [dataArr] = data.data;
            this.data[proper[i]] = dataArr;
          } else {
            this.data[proper[i]] = data;
          }
        });
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve('fecher Done'), 1000);
    });
  }


  locationUpd(lon, lat) {
    this.lat = lat;
    this.lon = lon;
    this.feacher().then(() => {
      this.rebuild('weather-info');
      this.rebuild('weather-map');
    });
  }

  rebuild(selClass) {
    const destr = document.getElementsByClassName(selClass)[0];
    this.element.removeChild(destr);
    switch (selClass) {
      case 'weather-info': {
        clearInterval(this.a);
        this.initInfo();
        break;
      }
      case 'weather-map': {
        this.initMap();
        break;
      }
      default: {
        break;
      }
    }
  }

  switchLang(lang) {
    this.chL = lang;
    localStorage.setItem('lang', lang);
    this.rebuild('weather-info');
    this.rebuild('weather-map');
  }

  switchTemp(temp) {
    this.chT = temp;
    localStorage.setItem('temp', temp);
    this.feacher()
      .then(() => {
        this.rebuild('weather-info');
      });
  }

  async geoloc() {
    navigator.geolocation.getCurrentPosition((e) => {
      this.lat = Number(e.coords.latitude).toFixed(2);
      this.lon = Number(e.coords.longitude).toFixed(2);
    });
    return new Promise((resolve) => {
      setTimeout(() => resolve('Geo Done'), 1000);
    });
  }


  initModules(parent) {
    this.geoloc().then(() => this.feacher())
      .then(() => {
        const locLang = this.data.current.country_code === 'PL' ? 'pl' : 'en';
        this.chL = localStorage.getItem('lang') !== null ? localStorage.getItem('lang') : locLang;
        this.initOptions(parent);
        this.initSearch(parent);
        const getLocTime = new Date().toLocaleString('en-US', {
          timeZone: this.data.current.timezone,
        });
        this.actualTime = new Date(getLocTime);
        this.initInfo();
        this.initMap();
        this.bodyImageFetch(this.actualTime);
      });
  }

  init() {
    this.element = document.createElement('div');
    this.parentElem.appendChild(this.element);
    this.element.classList.add('container');
    this.initModules(this.element);
  }
}

export default MainContainer;

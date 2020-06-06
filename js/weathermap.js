import '../styles/weatherMap.css';

class WeatherMap {
  constructor(parent) {
    this.parent = parent;
    this.key = 'pk.eyJ1IjoidGFyb3hsaW4iLCJhIjoiY2thcmR2YmhlMGVxeDJ3cWZyb3lob2ZsdCJ9.ukPfQVyv6FVytvoLQE162g';
    this.init();
  }

  fetchMap() {
    // eslint-disable-next-line no-undef
    mapboxgl.accessToken = this.key;
    // eslint-disable-next-line no-undef
    const map = new mapboxgl.Map({
      container: 'weatherMap',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.parent.lon, this.parent.lat],
      zoom: 8,
    });

    // eslint-disable-next-line no-undef
    new mapboxgl.Marker()
      .setLngLat([this.parent.lon, this.parent.lat])
      .addTo(map);
  }

  init() {
    const sad = document.createElement('div');
    this.parent.element.appendChild(sad);
    sad.classList.add('weather-map');
    const asd = document.createElement('div');
    sad.appendChild(asd);
    asd.id = 'weatherMap';
    this.fetchMap();
    const asx = document.createElement('div');
    sad.appendChild(asx);
    asx.classList.add('geo-size');
    asx.innerHTML = `<h3>${this.parent.template[this.parent.chL].lon}: ${this.parent.lon}</h3>
                <h3>${this.parent.template[this.parent.chL].lat}: ${this.parent.lat}</h3>`;
  }
}

export default WeatherMap;

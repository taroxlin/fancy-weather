import '../styles/menuRight.css';

class MenuRight {
  constructor(parent) {
    this.parent = parent;
    this.key = parent.key.openW;
    this.form = {
      input: {
        element: 'input',
        inner: '',
        class: 'form-input',
      },
      mic: {
        element: 'button',
        type: 'button',
        inner: '<img class = \'mic-button-image\' src=\'./images/microphone.png\' alt=\'Microphone Icon\'/>',
        class: 'mic-button',
        click: () => true,
      },
      search: {
        element: 'button',
        type: 'button',
        inner: '<div class = \'search-button-div\'>Search</div>',
        class: 'search-button',
        click: () => {
          this.inputLocation();
        },
      },
    };
    this.init();
  }

  inputLocation() {
    const city = document.getElementsByClassName('form-input')[0].value;
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.key}`;
    fetch(api)
      .then((response) => {
        if (response.statusText === 'OK') {
          return response;
        }
        return false;
      })
      .then((response) => (response ? response.json() : null))
      .then((data) => {
        if (data !== null) {
          console.log(data);
          const lon = Number(data.coord.lon).toFixed(2);
          const lat = Number(data.coord.lat).toFixed(2);
          this.parent.locationUpd(lon, lat);
        }
      });
  }

  initFormElems(form) {
    const items = Object.keys(this.form);
    for (let i = 0; items.length > i; i += 1) {
      const obj = this.form[items[i]];
      const element = document.createElement(obj.element);
      form.appendChild(element);
      element.classList.add(obj.class);
      element.innerHTML = obj.inner;
      if (Object.prototype.hasOwnProperty.call(obj, 'click')) {
        element.addEventListener('click', (e) => obj.click(e));
      }
      if (Object.prototype.hasOwnProperty.call(obj, 'type')) {
        element.type = obj.type;
      }
    }
  }

  initForm(par) {
    const form = document.createElement('form');
    par.appendChild(form);
    form.classList.add('rightNavi');
    this.initFormElems(form);
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.inputLocation();
      }
    });
  }


  init() {
    const a = document.createElement('div');
    this.parent.element.appendChild(a);
    a.classList.add('naviRight');
    this.initForm(a);
  }
}

export default MenuRight;

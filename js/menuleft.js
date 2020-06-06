import '../styles/menuLeft.css';

class MenuLeft {
  constructor(parent) {
    this.parent = parent;
    this.buttons = {
      imgChanger: {
        value: '⟳',
        click: () => this.parent.bodyImageFetch(this.parent.actualTime),
        classAtr: 'refresh-button',
      },
    };
    this.init();
  }

  addButton(obj) {
    this.buttons[obj.name] = {
      value: obj.value,
      click: obj.click,
      classAtr: obj.classAtr,
    };
  }

  changeTemp(temp) {
    const buttSel = document.getElementsByClassName('temp-button');
    for (let i = 0; buttSel.length > i; i += 1) {
      const but = buttSel[i];
      if (but.innerText === temp) {
        but.classList.remove('disableTemp');
      } else {
        but.classList.add('disableTemp');
      }
    }
    this.parent.switchTemp(temp);
  }

  initSelect(parSel) {
    const selCont = document.createElement('select');
    parSel.appendChild(selCont);
    let str = '';
    const { lang } = this.parent;
    for (let i = 0; lang.length > i; i += 1) {
      if (lang[i] === this.parent.chL) {
        str += `<option value="${lang[i]}" selected>${lang[i]}</option>`;
      } else {
        str += `<option value="${lang[i]}">${lang[i]}</option>`;
      }
    }
    selCont.innerHTML = str;
    selCont.addEventListener('change', (e) => { this.parent.switchLang(e.target.value); });
  }

  initTempButtons(parent) {
    const tempArr = this.parent.temp;
    for (let i = 0; tempArr.length > i; i += 1) {
      const propName = `temp${tempArr[i]}`;
      const obj = {
        name: propName,
        value: tempArr[i],
        click: () => this.changeTemp(tempArr[i]),
        classAtr: 'temp-button',
      };
      this.addButton(obj);
      this.initButton(obj.name, parent);
    }
  }

  initButton(prop, parent) {
    const obj = this.buttons;
    const elem = obj[prop];
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const ButtCont = document.createElement('button');
      parent.appendChild(ButtCont);
      ButtCont.classList.add(elem.classAtr);
      if (elem.classAtr === 'temp-button' && this.parent.chT !== elem.value) {
        ButtCont.classList.add('disableTemp');
      }
      ButtCont.innerHTML = `<div>${elem.value}</div>`;
      ButtCont.addEventListener('click', () => {
        elem.click();
      });
    }
  }

  initRender(parent) {
    this.initButton('imgChanger', parent);
    this.initSelect(parent);
    this.initTempButtons(parent);
  }

  init() {
    const divCont = document.createElement('div');
    this.parent.element.appendChild(divCont);
    divCont.classList.add('naviLeft');
    this.initRender(divCont);
  }
}

export default MenuLeft;

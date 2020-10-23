class Dial {

  constructor(el, opt) {
    this.el = el;
    this.opt = opt;
    this.base
    this.wheel;
    this.knob;
    this.wheelRad;
    this.deg = 0;
    this.x;
    this.y;
    this.pressed = false;
    this.weight = 0;
  }

  makeDiv() {
    const base = document.createElement('div');
    base.setAttribute('id', 'base');
    Object.assign(base.style, {
      position: 'relative',
      width: '300px',
      height: '300px',
      margin: '20px auto'
    });
    this.base = base;
    document.body.appendChild(base);

    const wheel = document.createElement('div');
    wheel.setAttribute('id', 'base_wheel');
      Object.assign(wheel.style, {
      position: 'absolute',
      width: this.opt.wheelSize,
      height: this.opt.wheelSize,
      backgroundColor: '#ffcfc7',
      borderRadius: '50%',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    });
    this.wheel = wheel;
    this.base.appendChild(wheel);

    const knob = document.createElement("div");
    knob.setAttribute('id', 'base_knob');
      Object.assign(knob.style, {
        position: 'absolute',
        width: this.opt.knobSize,
        height: this.opt.knobSize,
        backgroundColor: 'white',
        borderRadius: '50%',
        left: '50%',
        top: '50%',
        zIndex: 9999
      })
    this.knob = knob;
    this.base.appendChild(knob);
  }

  getWheelRad() {
    const wheel = this.wheel;
    const wheelRad = wheel.clientWidth/2;
    this.wheelRad = wheelRad;

    return wheelRad;
  }
  
  getCoordinate(ev) {
    //스크롤과 상관없이 값이 유지되야될 경우 getBoundingClientRect() 함수 사용

    //wheel_rect.left,top = {235.00001525878906, 35}
    const wheel_rect = this.wheel.getBoundingClientRect()
    const x = ev.clientX - wheel_rect.left - this.wheelRad;
    const y = (ev.clientY - wheel_rect.top - this.wheelRad) ;

    this.x = x;
    this.y = y;

    const coordinate = {
      x: x,
      y: y
    }
    this.coordinate = coordinate;
    return coordinate;
  }
  
  getDegree(x, y){
    x = this.x;
    y = this.y;
    let deg = Math.atan2(y, x) * (180 / Math.PI) + 90;

    if(deg < 0) {
      deg += 360;
    }
    
    return deg;
  }

  draw(deg) {
    let changedeg;

    if(deg > this.opt.maxDegree) {
      changedeg = this.opt.maxDegree;
    }
    else if(deg <= this.opt.minDegree) {
      changedeg = this.opt.minDegree;
    }
    else {
      changedeg = deg
    } 

    const knob = this.knob;
    knob.style.transformOrigin = '50% 150%'
    knob.style.transform = `translate(-50%, -150%) rotate(${changedeg}deg)`; // template literals : ${}
  }
  
  setEvent() {
    const base = this.base;
    const knob = this.knob;
    const wheel = this.wheel;
    
    knob.addEventListener('mousedown', (ev)=>this.mouseDown(ev))
    window.addEventListener('mousemove', (ev)=>this.mouseMove(ev))
    window.addEventListener('mouseup', (ev)=>this.mouseUp(ev))
  }

  mouseDown(ev) {
    this.pressed = true;
    this.start_deg = this.getDegree(this.getCoordinate(ev)) - this.deg;
  }
  
  mouseMove(ev) {
    ev.preventDefault(); //window이벤트 일어나지 않게 막음
    
    if (!this.pressed) return; // 전부다 조건을 만족해야 실행하는 경우 반대조건을 걸어서 탈출하는 조건으로 걸어주기
    console.log(this.start_deg + this.deg)
    // 방법 1
    const now_deg = this.getDegree(this.getCoordinate(ev));
    // const distance = this.deg - (now_deg -  this.start_deg) ; // 현재 각도 - 이전 각도
    let distance = (now_deg -  this.start_deg) - (this.deg - this.weight); // 현재 각도 - 이전 각도
    this.deg = now_deg - this.start_deg; 
    // knob이 한바퀴 넘어갈 때(12시 위치에 왔을 때)
    if (Math.abs(distance) > 180) { 
      
      if (distance > 0 ) { // 왼쪽으로 회전
        this.weight -= 360 
      }
      else if (distance < 0) { //오른쪽으로 회전
        this.weight += 360 
      }
    }
    this.deg += this.weight
    
    // console.log(this.deg)
    this.draw(this.deg)

    // 방법2 start 값을 업데이트 원래있는 deg + delta 
  }

  mouseUp(ev) {
    this.pressed = false;
    
    //오른쪽으로 더 돌리다가 mouse up
    if(this.deg > this.opt.maxDegree) {
      this.deg = this.opt.maxDegree
      this.weight = (Math.ceil(this.opt.maxDegree / 360) - ((Math.ceil(this.opt.maxDegree / 360)) - 1))  * 360
    }
    //왼쪽으로 더 돌리다가 mouse up
    else if (this.deg < this.opt.minDegree) {
      this.deg = this.opt.minDegree
      this.weight = (Math.ceil(this.opt.minDegree / 360) - ((Math.ceil(this.opt.minDegree / 360)) - 1))  * (-360)
      // this.weight = 0;
    }
    console.log(this.weight)
  }
}

function newDial (ol, opt) {
  const dial = new Dial(this.base,
    {wheelSize : '270px', knobSize : '70px', minDegree: -135, maxDegree: 135});
    dial.makeDiv();
    dial.getWheelRad();
    dial.draw(dial.opt.minDegree);
    dial.deg = dial.opt.minDegree;
    dial.setEvent();
    return dial
}
newDial();

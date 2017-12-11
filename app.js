const scene = document.querySelector('a-scene')
const scoreboard = document.getElementById('scoreboard')
const SCORE_TEXT_LEN = 2
const INACTIVITY_TIMEOUT = 30
const ball = document.getElementById('ball')
//const timer = document.getElementById('timer')

let score = 0, timeLeft = INACTIVITY_TIMEOUT

scene.addEventListener('renderstart', function () {
  const cam = document.querySelector('[camera]')

  window.addEventListener('triggerup', () => {
    timeLeft = INACTIVITY_TIMEOUT
  })

  window.addEventListener('gripup', () => {
    timeLeft = INACTIVITY_TIMEOUT
    ball.removeAttribute('dynamic-body')
    const pos = cam.getAttribute('position')
    ball.setAttribute('position', `${pos.x} 1 ${pos.z}`)
    ball.setAttribute('dynamic-body', 'mass: 1000; shape: sphere; sphereRadius: 0.2')
  })

  io3d.scene.getAframeElements('8e5864db-6a66-4e50-ac2b-c84da16e2faf')
  .then(function (elements) {
    elements
    .filter(function(elem) { return !elem.hasAttribute('camera') })
    .forEach(function (elem) {
      elem.setAttribute('position', '2.983 0 -17.3')
      elem.setAttribute('rotation', '0 90 0')
      prepareFurnitureForFun(elem)
      document.getElementById('holder').appendChild(elem)
    })
  })

  scene.addEventListener('model-loaded', function startTimer() {
    setInterval(tickTock, 1000)
    scene.removeEventListener('model-loaded', startTimer)
  })
})

function prepareFurnitureForFun(elem) {
  if (elem.hasAttribute('io3d-furniture')) {
    elem.setAttribute('dynamic-body', 'mass: 2; shape: box')
    elem.addEventListener('collide', onCollide)
  }

  if (elem.children.length > 0) {
    Array.from(elem.children).forEach(prepareFurnitureForFun)
  }
}

function onCollide(evt) {
  const BALL_ID = document.getElementById('ball').body.id
  if (evt.detail.body.id !== BALL_ID) return

  this.removeEventListener('collide', onCollide)

  score++
  let scoreString = score.toString(), len = scoreString.length
  for (let i = len; i < SCORE_TEXT_LEN; i++) scoreString = '0' + scoreString
  scoreboard.setAttribute('text-geometry', { value: scoreString })
}

function tickTock() {
  if (--timeLeft < 0) {
//    localStorage.setItem('currentScore', score)
    window.location.href = '/'
  }
//  timer.setAttribute('text-geometry', { value: `${('00' + Math.floor(timeLeft / 60)).slice(-2)}:${('00' + (timeLeft % 60)).slice(-2)}` })
}

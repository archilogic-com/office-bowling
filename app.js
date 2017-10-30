const scene = document.querySelector('a-scene')
const scoreboard = document.getElementById('scoreboard')
const SCORE_TEXT_LEN = 3
const ball = document.getElementById('ball')
let score = 0

scene.addEventListener('renderstart', function () {
  const cam = document.querySelector('[camera]')

  window.addEventListener('gripup', () => {
    ball.removeAttribute('dynamic-body')
    const pos = cam.getAttribute('position')
    ball.setAttribute('position', `${pos.x} 0.5 ${pos.z}`)
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
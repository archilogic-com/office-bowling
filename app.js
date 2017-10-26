const scene = document.querySelector('a-scene')
const scoreboard = document.getElementById('scoreboard')
const SCORE_TEXT_LEN = 3

let score = 0

scene.addEventListener('renderstart', function () {

  io3d.scene.getAframeElements('650b989a-ca47-41ec-bec8-53896e8b354e')
  .then(function (elements) {
    elements
    .filter(function(elem) { return !elem.hasAttribute('camera') })
    .forEach(function (elem) {
      prepareFurnitureForFun(elem)
      elem.setAttribute('position', '5.954 0 0')
      scene.appendChild(elem)
    })
  })
})

function prepareFurnitureForFun(elem) {
  if (elem.hasAttribute('io3d-furniture')) {
    elem.setAttribute('dynamic-body', 'mass: 10; shape: box')
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
const THREE = require('three')

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
 return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

function mapNumber(n, in_min, in_max, out_min, out_max) {
 return ((n - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

function Vector2 (x, y) {
  return new THREE.Vector2(x, y)
}

function Vector3(x, y, z) {
  return new THREE.Vector3(x, y, z)
}

function loadTexture(loader, url, index) {
  return new Promise((resolve, reject) => {
    if (!url) {
      return resolve({ texture: null, index })
    }

    loader.load(
      url,
      texture => {
        resolve({ texture, index })
      },
      undefined,
      error => {
        console.error('Error loading texture', error)
        reject(error)
      }
    )
  })
}

function styleDomElements(container, canvas) {
    container.style.position = 'relative'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.bottom = '0'
    canvas.style.left = '0'
    canvas.style.right = '0'
    canvas.style.zIndex = '10'
    canvas.style.pointerEvents = 'none'
  }

module.exports = {
  Vector2,
  Vector3,
  loadTexture,
  mapNumber,
  styleDomElements,
}

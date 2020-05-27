Number.prototype.map = function(in_min, in_max, out_min, out_max) {
 return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
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
      console.warn('loaded texture with null url at index: ', index)
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
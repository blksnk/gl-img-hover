const THREE = require('three')
const { Vector2, Vector3, loadTexture } = require('./helpers.js')

class EffectShell {
  constructor(container = document.body, itemsWrapper = null, selector = '.link') {
    this.container = container
    this.itemsWrapper = itemsWrapper
    this.selector = selector
    this.isLoaded = false
    this.mouse = { x: 0, y: 0 }

    if (!this.itemsWrapper || !this.container) {
      return
    } else {
      this.setup()
      this.initEffectShell().then(() => {
        console.log('loading finished')
        this.isLoaded = true
      })
      this.initEvents()
    }
  }

  get viewport() {
    let o = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    return {
      ...o,
      aspectRatio: o.width / o.height
    }
  }

  get viewSize() {
    let distance = this.camera.position.z
    let vFov = (this.camera.fov * Math.PI) / 180
    let height = 2 * Math.tan(vFov / 2) * distance
    let width = height * this.viewport.aspectRatio
    return { width, height, vFov }
  }

  get itemsElements() {
    // nodelist to array
    const items = [...this.itemsWrapper.querySelectorAll(this.selector)]
    return items.map((item, index) => ({
      element: item,
      img: item.querySelector('img') || null,
      index: index
    }))
  }

  setup() {
    // resize event
    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    this.renderer.setPixelRatio = window.devicePixelRatio
    this.container.appendChild(this.renderer.domElement)

    // scene
    this.scene = new THREE.Scene()

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 7)

    // animation loop
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  render() {
    // render loop
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.viewport.width, this.viewport.height)
  }

  initEffectShell() {
    let promises = []
    this.items = this.itemsElements
    const loader = new THREE.TextureLoader()

    promises = this.items.map((item, index) => {
      return loadTexture(
        loader,
        item.img ? item.img.src : null,
        index
      )
    })

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(results => {
          results.forEach((result, index) => {
            this.items[index].texture = result.texture
          })
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  initEvents() {
    this.items.forEach((item, index) => {
      item.element.addEventListener(
        'mouseover',
        this._onMouseOver.bind(this, index),
        false
      )

      this.container.addEventListener(
        'mousemove',
        this._onMouseMove.bind(this),
        false
      )
      this.itemsWrapper.addEventListener(
        'mouseleave',
        this._onMouseLeave.bind(this),
        false
      )
    })
  }

  _onMouseLeave(event) {
    this.isMouseOver = false
    this.onMouseLeave(event)
  }

  _onMouseMove(event) {
    // get normalized mouse position on viewport
    this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
    this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

    this.onMouseMove(event)
  }

  _onMouseOver(index, event) {
    this.onMouseOver(index, event)
  }

  onMouseEnter() {}
  onMouseOver() {}
  onMouseMove() {}
  onMouseLeave() {}
}

module.exports = EffectShell

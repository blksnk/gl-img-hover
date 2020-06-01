const THREE = require('three')
const { TweenLite, Power4 } = require('gsap')
const EffectShell = require('./EffectShell.js')
const { Vector2, Vector3, mapNumber } = require('./helpers')

class Effect extends EffectShell {
  constructor(options) {
    console.log(options)
    super(options.container, options.itemsWrapper, options.selector)
    this.options = options

    if (!this.container || !this.itemsWrapper) return

    this.init()
  }

  init() {
    this.position = Vector3(0, 0, 0)
    this.scale = Vector3(1, 1, 1)
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

    this.uniforms = {
      uTexture: {
        value: null
      },
      uOffset: {
        value: Vector2(0.0, 0.0)
      },
      uAlpha: {
        value: 1
      }
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
       uniform vec2 uOffset;

       varying vec2 vUv;

       vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
         float M_PI = 3.1415926535897932384626433832795;
         position.x = position.x + (sin(uv.y * M_PI) * offset.x);
         position.y = position.y + (sin(uv.x * M_PI) * offset.y);
         return position;
       }

      void main() {
       vUv =  uv + (uOffset * 2.);
       vec3 newPosition = position;
       newPosition = deformationCurve(position,uv,uOffset);
       gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
     }
     `,
      fragmentShader: `
       uniform sampler2D uTexture;
       uniform float uAlpha;

       varying vec2 vUv;

       vec2 scaleUV(vec2 uv,float scale) {
        float center = 0.5;
        return ((uv - center) * scale) + center;
       }

       void main() {
         vec3 color = texture2D(uTexture,scaleUV(vUv,0.7)).rgb;
         gl_FragColor = vec4(color,uAlpha);
       }
     `,
      transparent: true,
    })
    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)

  }

  onMouseEnter() {
    if (!this.currentItem || !this.isMouseOver) {
      this.isMouseOver = true
      // show plane
      TweenLite.to(this.uniforms.uAlpha, 1, {
        value: 1,
        ease: Power4.easeOut,
        onUpdate: () => {
          console.log(this.uniforms.uAlpha.value)
        }
      })
    }
  }

  onMouseLeave(event) {
    // hide plane
    TweenLite.to(this.uniforms.uAlpha, 1, {
      value: 0,
      ease: Power4.easeOut,
      onUpdate: () => {
        console.log(this.uniforms.uAlpha.value)
      }
    })
  }

  onMouseOver(index, e) {
    if (this.isLoaded) {
      this.onMouseEnter()
      if (this.currentItem && this.currentItem.index === index) return
      this.onTargetChange(index)
    }
  }

  onMouseMove(event) {
    const { width, height } = this.viewSize
    let x = mapNumber(
      this.mouse.x,
      -1,
      1,
      - width / 2,
      width / 2
    )
    let y = mapNumber(
      this.mouse.y
      -1,
      1,
      - height / 2,
      height / 2
    )
    console.log(width, height)

    this.position = Vector3(x, y, 0)
    TweenLite.to(this.plane.position, 1, {
      x,
      y,
      ease: Power4.easeOut,
      onUpdate: this.onPositionUpdate.bind(this)
    })
  }

  onTargetChange(index) {
    this.currentItem = this.items[index]
    if (this.currentItem.texture) {

      this.uniforms.uTexture.value = this.currentItem.texture

      let imageRatio = this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight
      console.log(imageRatio)

      this.scale = Vector3(imageRatio, 1, 1)
      this.plane.scale.copy(this.scale)
    }
  }

  onPositionUpdate() {
    let offset = this.plane.position
      .clone()
      .sub(this.position)
      .multiplyScalar(-this.options.strength)

    this.uniforms.uOffset.value = offset
  }
}

module.exports = Effect

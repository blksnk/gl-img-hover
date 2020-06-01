const Effect = require('./js/Effect.js')

const defaultOptions = {
  strength: .75,
  itemsWrapper: '#links',
  selector: '.link',
  container: '#container',
}

class Wrapper {
  constructor(options) {
    this.options = { ...defaultOptions, ...options }
    if(typeof this.options.itemsWrapper === 'string') {
      this.options.itemsWrapper = document.querySelector(this.options.itemsWrapper)
    }
    if(typeof this.options.container === 'string') {
      this.options.container = document.querySelector(this.options.itemsWrapper)
    }
    console.warn(this.options)
    this.effect = new Effect(this.options)
    console.warn(this.effect)
  }
}

module.exports = Wrapper

const Effect = require('./js/Effect.js')

const defaultOptions = {
  strength: .75,
  itemsWrapper: '#links',
  selector: '.link',
  container: '#container',
  scale: 1,
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
    this.effect = new Effect(this.options)
  }
}

module.exports = Wrapper

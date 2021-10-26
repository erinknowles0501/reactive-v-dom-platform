export default class Reactable {
  constructor(prop) {
    this.prop = prop;
    this.subs = [];
  }

  register(func) {
    this.subs.push(func);
  }

  update() {
    this.subs.forEach((target) => target());
  }
}

// ------------------------------------------------------------------------------
// name: index
// author: mudas( mschool.tech )
// created: 2020/9/30 17:26
// ------------------------------------------------------------------------------

// decorator 外部可以包装一个函数，函数可以带参数
function Decorator(type) {

  /**
   * 这里是真正的 decorator
   * @target 装饰的属性所述的类的原型，注意，不是实例后的类。如果装饰的是 Car 的某个属性，这个 target 的值就是 Car.prototype
   * @name 装饰的属性的 key
   * @descriptor 装饰的对象的描述对象
   */
  return function(target, name, descriptor) {
    console.warn('Decorator:', type, target, name, descriptor);

    // const src = descriptor.value;
    // descriptor.value = function(a, b) {
    //   return console.warn(`${a}+${b}=${src(a, b)}`);
    // };
    // return descriptor;

    const src = target.test;
    target.test = function(a, b) {
      return console.warn(`${a}+${b}=${src(a, b)}`);
    };

    return target;
  };
}

class A {

  @Decorator('t1')
  test(a, b) {
    console.warn('run in test:', a, b);
    return a + b;
  }

}

new A().test(1, 2);

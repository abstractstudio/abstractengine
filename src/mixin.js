goog.provide("abstract.mixin.mix");

/** Create a superclass with mixins.

http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/ 

Mixins are a byproduct of functional inheritance that has crossed over from
previous versions ECMAScript. They provide a method of imitating symbolic
multiple inheritance. This particular implementation requires mixins to be in 
the form of a function returning a class constructor that extends the 
function's first argument:

class Base {...}
var Mixin = (superclass) => class extends superclass {...}
class Class extends mix(Base, Mixin, ...) {...}
*/

function mix(superclass, ...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
}

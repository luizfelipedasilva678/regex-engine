import Regex from "./src/regex";

console.log(new Regex("a|b").match("a")); // true;
console.log(new Regex("a(b|c)*d").match("acbd")); // true;
console.log(new Regex("a|b").match("a")); // true;
console.log(new Regex("a|b").match("")); // false;
console.log(new Regex("a|b").match("b")); // true;
console.log(new Regex("a(b|c)*d").match("ad")); // true
console.log(new Regex("a(b|c)*d").match("abcbcd")); // true
console.log(new Regex("a(b|c)+d").match("ad")); // false
console.log(new Regex("a(b|c)+d").match("abd")); // true
console.log(new Regex("as?d").match("asd")); // true
console.log(new Regex("as?d").match("ad")); // true
console.log(new Regex("as?d").match("a")); // false
console.log(new Regex("as?d").match("d")); // false
console.log(new Regex("a*").match("a")); // false

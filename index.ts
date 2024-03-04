import Regex from "./src/regex";
const regex = new Regex();

console.log(regex.match("a|b", "a")); // true;
console.log(regex.match("a|b", "")); // false;
console.log(regex.match("a|b", "b")); // true;
console.log(regex.match("a|b", "aabbc")); // true;
console.log(regex.match("a(b|c)*d", "aad")); // false;
console.log(regex.match("a(b|c)*d", "ad")); // true
console.log(regex.match("a(b|c)*d", "abcbcd")); // true
console.log(regex.match("a(b|c)+d", "ad")); // false
console.log(regex.match("a(b|c)+d", "abd")); // true
console.log(regex.match("as?d", "asd")); // true
console.log(regex.match("as?d", "ad")); // true
console.log(regex.match("as?d", "a")); // false

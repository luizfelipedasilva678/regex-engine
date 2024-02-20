import NFA from "./nfa/nfa";
const nfa = new NFA("aaca");

console.log(nfa.test("asdasdaaaabbcasdasd"));

import NFA from "./nfa/nfa";
const nfa = new NFA("aa*(a+b)");

console.log(nfa.test("asdasdaaaabbcasdasd"));

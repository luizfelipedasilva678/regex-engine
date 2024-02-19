import { NFA } from "./nfa";

const nfa = new NFA("aaa|bbb");

console.log(nfa.test("sadfsdafscccdfsdf"));

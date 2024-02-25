import NFA from "./src/nfa";
const nfa = new NFA();

nfa.buildNFA("(s|d)|dd");

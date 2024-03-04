import RegexFormatter from "../regex-formatter";
import Stack from "../data-structures/stack";
import * as constants from "../constants";

type Out = {
  nextState: string | null;
};

class Transition {
  constructor(
    public symbol: string,
    public out1: Out = { nextState: null },
    public out2: Out = { nextState: null }
  ) {}
}

class NFAFrag {
  constructor(public start: string, public out: Out | null = null) {}
}

export default class Regex {
  private idCounter = constants.INITIAL_STATE;
  private adjList = new Map<string, Transition>();
  private nfaStack = new Stack<NFAFrag>();
  private formatter = new RegexFormatter();
  private clist = new Set<string>();
  private nlist = new Set<string>();

  private tokenize(regex: string) {
    return regex.split("");
  }

  private getState() {
    const id = String(this.idCounter);
    this.idCounter++;
    return id;
  }

  private join(out1: Out, out2: Out): Out {
    const state = this.getState();
    const transition = new Transition(constants.EPSILON);
    this.adjList.set(state, transition);

    out1.nextState = state;
    out2.nextState = state;

    return transition.out1;
  }

  private buildNFA(regex: string) {
    const formattedRegex = this.formatter.infixToPostfix(regex);
    const tokens = this.tokenize(formattedRegex);
    this.nfaStack.clear();
    this.adjList.clear();
    this.idCounter = 0;

    for (const token of tokens) {
      switch (token) {
        case constants.ONE_OR_MORE: {
          const frag = this.nfaStack.pop();
          const state = this.getState();
          const transition = new Transition(constants.SPLIT_TRANSITION);
          this.adjList.set(state, transition);
          frag!.out!.nextState = state;
          transition.out1.nextState = frag!.start;
          this.nfaStack.push(new NFAFrag(frag!.start, transition.out2));
          break;
        }
        case constants.ZERO_OR_MORE: {
          const frag = this.nfaStack.pop();
          const state = this.getState();
          const transition = new Transition(constants.SPLIT_TRANSITION);
          this.adjList.set(state, transition);
          frag!.out!.nextState = state;
          transition.out1.nextState = frag!.start;
          this.nfaStack.push(new NFAFrag(state, transition.out2));
          break;
        }
        case constants.ZERO_OR_ONE: {
          const frag = this.nfaStack.pop();
          const state = this.getState();
          const transition = new Transition(constants.SPLIT_TRANSITION);
          this.adjList.set(state, transition);
          transition.out1.nextState = frag!.start;
          this.nfaStack.push(
            new NFAFrag(state, this.join(frag!.out!, transition.out2))
          );
          break;
        }
        case constants.ALTERNATION: {
          const frag2 = this.nfaStack.pop();
          const frag1 = this.nfaStack.pop();
          const state = this.getState();
          const transition = new Transition(constants.SPLIT_TRANSITION);
          this.adjList.set(state, transition);
          transition!.out1.nextState = frag1!.start;
          transition!.out2.nextState = frag2!.start;
          this.nfaStack.push(
            new NFAFrag(state, this.join(frag1!.out!, frag2!.out!))
          );
          break;
        }
        case constants.CONCATENATION: {
          const frag2 = this.nfaStack.pop();
          const frag1 = this.nfaStack.pop();
          frag1!.out!.nextState = frag2!.start;
          this.nfaStack.push(new NFAFrag(frag1!.start, frag2!.out));
          break;
        }
        default: {
          const state = this.getState();
          const transition = new Transition(token);
          this.adjList.set(state, transition);
          this.nfaStack.push(new NFAFrag(state, transition.out1));
          break;
        }
      }
    }

    const nfa = this.nfaStack.pop();
    nfa!.out!.nextState = constants.FINAL_STATE;
    return nfa;
  }

  private matchSymbol(state: string, c: string) {
    if (state === constants.FINAL_STATE) {
      this.nlist.add(state);
      return;
    }

    const transition = this.adjList.get(state);

    if (!transition) return;

    if (transition!.symbol === constants.SPLIT_TRANSITION) {
      this.matchSymbol(transition.out1.nextState!, c);
      this.matchSymbol(transition.out2.nextState!, c);
      return;
    }

    if (transition!.symbol === constants.EPSILON) {
      this.matchSymbol(transition.out1.nextState!, c);
      return;
    }

    if (transition && transition!.symbol === c) {
      this.nlist.add(transition.out1.nextState!);
    }
  }

  public match(regex: string, input: string) {
    const nfa = this.buildNFA(regex);
    this.nlist.clear();
    this.clist.clear();
    this.clist.add(nfa!.start);

    for (const c of input) {
      for (const state of this.clist) {
        this.matchSymbol(state, c);
      }

      const tmp = this.clist;
      this.clist = this.nlist;
      this.nlist = tmp;
    }

    for (const state of this.clist) {
      if (state === constants.FINAL_STATE) return true;

      const transition = this.adjList.get(state);

      if (transition) {
        if (
          transition.symbol === constants.EPSILON &&
          transition.out1.nextState === constants.FINAL_STATE
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

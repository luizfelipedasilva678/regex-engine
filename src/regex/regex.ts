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
  private readonly regex: string;
  private idCounter = constants.INITIAL_STATE;
  private readonly adjList = new Map<string, Transition>();
  private readonly nfaStack = new Stack<NFAFrag>();
  private readonly formatter = new RegexFormatter();
  private clist: string[] = [];
  private nlist: string[] = [];

  constructor(regex: string) {
    this.regex = regex;
  }

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

  private addState(nextState: string, list: string[]) {
    if (nextState === constants.FINAL_STATE) {
      this.nlist.push(nextState);
      return;
    }

    if (list.indexOf(nextState) !== -1 || !this.adjList.get(nextState)) return;

    if (this.adjList.get(nextState)!.symbol === constants.EPSILON) {
      this.addState(this.adjList.get(nextState)!.out1!.nextState!, list);
      return;
    }

    if (this.adjList.get(nextState)!.symbol === constants.SPLIT_TRANSITION) {
      this.addState(this.adjList.get(nextState)!.out1!.nextState!, list);
      this.addState(this.adjList.get(nextState)!.out2!.nextState!, list);
      return;
    }

    list.push(nextState);
  }

  public match(input: string) {
    const nfa = this.buildNFA(this.regex);

    this.addState(nfa!.start, this.clist);

    for (const c of input) {
      this.nlist = [];

      for (const state of this.clist) {
        if (this.adjList.get(state) && this.adjList.get(state)!.symbol === c) {
          this.addState(this.adjList.get(state)!.out1!.nextState!, this.nlist);
        }
      }

      this.clist = this.nlist;
    }

    for (const state of this.clist) {
      if (state === constants.FINAL_STATE) {
        return true;
      }
    }

    return false;
  }
}

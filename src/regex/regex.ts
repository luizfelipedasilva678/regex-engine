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

  test(regex: string, str: string) {
    const nfa = this.buildNFA(regex);
    const currentState = this.adjList.get(nfa!.start)!;

    console.log(currentState);

    for (const char of str) {
      console.log(char);
    }
  }
}

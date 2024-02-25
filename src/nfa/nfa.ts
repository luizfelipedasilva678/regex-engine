import RegexFormatter from "../regex-formatter";
import Stack from "../stack";
import * as constants from "../constants";

type State = string;

class Transition {
  constructor(
    public symbol: string,
    public toState: string = constants.FINAL_STATE
  ) {}
}

class NFAFrag {
  constructor(
    public startState: string,
    public endState = constants.FINAL_STATE,
    public adjList = new Map<State, Transition[]>()
  ) {}
}

export default class NFA {
  constructor(
    private nfaStack = new Stack<NFAFrag>(),
    private formatter = new RegexFormatter()
  ) {}

  private tokenize(regex: string) {
    return regex.split("");
  }

  private handleConcatenation() {
    const frag2 = this.nfaStack.pop();
    const frag1 = this.nfaStack.pop();

    if (frag1 && frag2) {
      frag1.endState = frag2.startState;

      const transitionsFrag1 = Array.from(frag1.adjList.values()).flat(
        Infinity
      ) as Transition[];
      const transitionsFrag2 = Array.from(frag2.adjList.values()).flat(
        Infinity
      ) as Transition[];

      for (const transition of transitionsFrag1) {
        if (transition.toState === constants.FINAL_STATE) {
          transition.toState = frag2.startState;
          break;
        }
      }

      frag1.adjList.set(frag2.startState, [...transitionsFrag2]);
      this.nfaStack.push(frag1);
    }
  }

  private mergeState(frag1: NFAFrag, frag2: NFAFrag) {
    frag1.adjList.forEach((transitions, state) => {
      frag2.adjList.set(state, [...transitions]);
    });
  }

  public buildNFA(regex: string) {
    this.nfaStack.clear();
    const formattedRegex = this.formatter.infixToPostfix(regex);
    const tokens = this.tokenize(formattedRegex);
    let idCounter = 0;

    for (const token of tokens) {
      switch (token) {
        case constants.ONE_OR_MORE: {
          break;
        }
        case constants.ZERO_OR_MORE: {
          break;
        }
        case constants.ZERO_OR_ONE: {
          break;
        }
        case constants.CONCATENATION: {
          this.handleConcatenation();
          break;
        }
        case constants.ALTERNATION: {
          const frag2 = this.nfaStack.pop();
          const frag1 = this.nfaStack.pop();

          if (frag1 && frag2) {
            const startState = String(idCounter);
            idCounter++;
            const endState = String(idCounter);
            const frag = new NFAFrag(startState, endState);
            this.mergeState(frag1, frag);
            this.mergeState(frag2, frag);

            frag.adjList.set(startState, [
              new Transition(constants.EPSILON, frag1.startState),
              new Transition(constants.EPSILON, frag2.startState),
            ]);

            frag.adjList.set(endState, [
              new Transition(constants.EPSILON, frag1.endState),
              new Transition(constants.EPSILON, frag2.endState),
            ]);

            this.nfaStack.push(frag);
          }
          break;
        }
        default: {
          const frag = new NFAFrag(String(idCounter));
          frag.adjList.set(String(idCounter), [new Transition(token)]);
          this.nfaStack.push(frag);
          break;
        }
      }

      idCounter++;
    }

    const nfa = this.nfaStack.pop();

    console.log(nfa);
    console.log(nfa?.adjList);
  }
}

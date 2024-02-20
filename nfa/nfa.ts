import {
  ALTERNATION,
  ONE_OR_MORE,
  ZERO_OR_MORE,
  ZERO_OR_ONE,
} from "../constants";

type Transition = {
  symbol: string;
  nextState: string;
};

export default class NFA {
  constructor(
    public regex: string,
    public adjList = new Map<string, Transition[]>()
  ) {
    this.init();
  }

  init() {
    let currentState = 0;
    const lastSymbolIdx = this.regex.length - 1;

    for (let i = 0; i < this.regex.length; i++) {
      const symbol = this.regex.charAt(i);
      const isFinalState = lastSymbolIdx === i;

      switch (symbol) {
        case ALTERNATION: {
          break;
        }
        case ONE_OR_MORE: {
          break;
        }
        case ZERO_OR_MORE: {
          break;
        }
        case ZERO_OR_ONE: {
          break;
        }
        default: {
          this.adjList.set(String(currentState), [
            {
              symbol,
              nextState: isFinalState
                ? String(Infinity)
                : String(currentState + 1),
            },
          ]);
        }
      }

      currentState++;
    }
  }

  test(input: string) {
    let currentState = "0";

    for (let i = 0; i < input.length; i++) {
      for (let j = i; j < input.length; j++) {
        const symbol = input[j];
        const transitions = this.adjList.get(currentState) ?? [];
        const transition = transitions.find(
          (transition) => transition.symbol === symbol
        );

        if (transition && transition.nextState === "Infinity") {
          return 1;
        }

        currentState = transition ? transition.nextState : "0";
      }
    }

    return 0;
  }
}

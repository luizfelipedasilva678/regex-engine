import RegexFormatter from "../regex-formatter";
import Stack from "../stack";
import * as constants from "../constants";

export default class NFA {
  constructor(
    private nfaStack = new Stack<string>(),
    private formatter = new RegexFormatter(),
    private adjList = new Map<string, Record<string, string>>()
  ) {}

  private tokenize(regex: string) {
    return regex.split("");
  }

  public buildNFA(regex: string) {
    this.nfaStack.clear();
    const formattedRegex = this.formatter.infixToPostfix(regex);
    const tokens = this.tokenize(formattedRegex);
    let idCounter = 0;

    console.log(formattedRegex);

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
          const state2 = this.nfaStack.pop();
          const state1 = this.nfaStack.pop();

          if (state1 && state2) {
            const state1Transitions = this.adjList.get(state1);

            if (state1Transitions) {
              for (const [symbol, state] of Object.entries(state1Transitions)) {
                if (state === constants.FINAL_STATE) {
                  state1Transitions[symbol] = state2;
                }
              }
            }

            this.nfaStack.push(state1);
          }
          break;
        }
        case constants.ALTERNATION: {
          console.log("Alternation", this.nfaStack);
          break;
        }
        default: {
          this.adjList.set(String(idCounter), {
            [token]: constants.FINAL_STATE,
          });
          this.nfaStack.push(String(idCounter));
          break;
        }
      }

      console.log(this.adjList);
      idCounter++;
    }
  }
}

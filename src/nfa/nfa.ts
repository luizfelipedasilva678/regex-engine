import RegexFormatter from "../regex-formatter";
import Stack from "../stack";
import * as constants from "../constants";

class Transition {
  constructor(public rule: string, public nextState: string | null = null) {}
}

export default class NFA {
  constructor(
    private nfaStack = new Stack<string>(),
    private formatter = new RegexFormatter(),
    private adjList = new Map<string, Transition[]>()
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
          break;
        }
        case constants.ALTERNATION: {
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}

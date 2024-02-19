import { NFAState } from "./nfa-state";

export class NFA {
  public paths: NFAState[] = [];
  public count = 0;
  public currentPath = 0;

  constructor(regex: string) {
    for (const symbol of regex) {
      this.createState(symbol);
    }
  }

  createState(symbol: string) {
    if (!this.paths[this.currentPath]) {
      this.paths.push(new NFAState(symbol, this.count));
    } else {
      let currentState = this.paths[this.currentPath];

      while (currentState.next !== undefined) {
        currentState = currentState.next;
      }

      switch (symbol) {
        case "|":
          this.currentPath++;
          break;
        case "?":
          console.log("----");
          break;
        case "*":
          console.log("----");
          break;
        case "+":
          console.log("-----");
          break;
        default:
          currentState.next = new NFAState(symbol, this.count);
      }
    }

    this.count++;
  }

  test(input: string) {
    let path = 0;

    while (path <= this.paths.length - 1) {
      let currentState = this.paths[path];

      for (const symbol of input) {
        if (currentState?.match(symbol)) {
          if (currentState.next !== undefined) {
            currentState = currentState.next;
          } else {
            return 1;
          }
        } else {
          currentState = this.paths[path];
        }
      }

      path++;
    }

    return 0;
  }
}

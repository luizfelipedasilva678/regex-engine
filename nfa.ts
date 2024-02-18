class NFAState {
  public state: number;
  public symbol: string;
  public next: NFAState | undefined = undefined;

  constructor(symbol: string, state: number, next = undefined) {
    this.state = state;
    this.symbol = symbol;
    this.next = next;
  }

  match(input: string) {
    return input === this.symbol;
  }
}

class NFA {
  initialState: NFAState | undefined = undefined;
  count = 0;

  createState(symbol: string) {
    if (this.initialState === undefined) {
      this.initialState = new NFAState(symbol, this.count);
    } else {
      let currentState = this.initialState;

      while (currentState.next !== undefined) {
        currentState = currentState.next;
      }

      switch (symbol) {
        case "|":
          console.log("----");
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
    let currentState = this.initialState;

    for (const symbol of input) {
      if (currentState?.match(symbol)) {
        if (currentState.next !== undefined) {
          currentState = currentState.next;
        } else {
          return 1;
        }
      } else {
        currentState = this.initialState;
      }
    }

    return 0;
  }
}

function client() {
  const regex = "aaddddas";
  const nfa = new NFA();

  for (const symbol of regex) {
    nfa.createState(symbol);
  }

  console.log(nfa.test("asdasdasdasdasdasdasdvvvzxxczzxczxcaaddddas"));
}

client();

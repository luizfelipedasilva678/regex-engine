export class NFAState {
  public state: number;
  public symbol: string;
  public next: NFAState | undefined;

  constructor(symbol: string, state: number, next = undefined) {
    this.state = state;
    this.symbol = symbol;
    this.next = next;
  }

  match(input: string) {
    return input === this.symbol;
  }
}

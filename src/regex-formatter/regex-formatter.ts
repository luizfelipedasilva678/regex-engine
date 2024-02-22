import Stack from "../stack";
import * as constants from "../constants";

export default class RegexFormatter {
  private operatorsStack = new Stack<string>();
  private precedenceTable: Record<string, number> = {
    [constants.ONE_OR_MORE]: 3,
    [constants.ZERO_OR_MORE]: 3,
    [constants.ZERO_OR_ONE]: 3,
    [constants.CONCATENATION]: 2,
    [constants.ALTERNATION]: 1,
  };

  private formatRegex(regex: string) {
    const output: string[] = [];

    for (let i = 0; i < regex.length; i++) {
      const nextIdx = i + 1;
      const currentChar = regex.charAt(i);

      output.push(regex[i]);

      if (nextIdx < regex.length) {
        const nextChar = regex.charAt(nextIdx);

        if (
          currentChar !== constants.LEFT_PARENTHESIS &&
          currentChar !== constants.ALTERNATION &&
          nextChar !== constants.RIGHT_PARENTHESIS &&
          !this.isOperator(nextChar)
        ) {
          output.push(constants.CONCATENATION);
        }
      }
    }

    return output.join("");
  }

  private tokenize(expression: string) {
    const pattern = new RegExp(/\w|\d|-|\*|\(|\)|\^|\+|\||\?|\/|\./, "g");
    const tokens = this.formatRegex(expression).match(pattern) ?? [];
    return tokens;
  }

  private isOperator(token: string) {
    return [
      constants.ONE_OR_MORE,
      constants.ZERO_OR_MORE,
      constants.ZERO_OR_ONE,
      constants.CONCATENATION,
      constants.ALTERNATION,
    ].includes(token);
  }

  private handleOperator(token: string, outputList: string[]) {
    let operator = this.operatorsStack.peek();

    while (
      operator &&
      this.precedenceTable[operator] >= this.precedenceTable[token]
    ) {
      outputList.push(this.operatorsStack.pop() ?? "");
      operator = this.operatorsStack.peek();
    }

    this.operatorsStack.push(token);
  }

  private handleRightParenthesis(outputList: string[]) {
    let operator = this.operatorsStack.pop();

    while (operator !== constants.LEFT_PARENTHESIS) {
      outputList.push(operator ?? "");
      operator = this.operatorsStack.pop();
    }
  }

  public infixToPostfix(expression: string) {
    this.operatorsStack.clear();
    const tokens = this.tokenize(expression);
    const outputList: string[] = [];

    for (const token of tokens) {
      if (this.isOperator(token)) {
        this.handleOperator(token, outputList);
        continue;
      }

      if (token === constants.RIGHT_PARENTHESIS) {
        this.handleRightParenthesis(outputList);
        continue;
      }

      if (token === constants.LEFT_PARENTHESIS) {
        this.operatorsStack.push(token);
        continue;
      }

      outputList.push(token);
    }

    while (!this.operatorsStack.isEmpty()) {
      outputList.push(this.operatorsStack.pop() ?? "");
    }

    return outputList.join("");
  }
}

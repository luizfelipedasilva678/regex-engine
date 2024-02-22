export default class Stack<T> {
  private _items: Array<T>;

  constructor() {
    this._items = [];
  }

  public push(element: T): void {
    this._items.push(element);
  }

  public pop(): T | undefined {
    return this._items.pop();
  }

  public peek(): T | undefined {
    return this._items[this._items.length - 1];
  }

  public isEmpty(): boolean {
    return this._items.length === 0;
  }

  public size(): number {
    return this._items.length;
  }

  public clear(): void {
    this._items = [];
  }
}

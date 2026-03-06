export interface OverlayEntry {
  id: string;
  modal?: boolean;
}

export class OverlayStack {
  private stack: OverlayEntry[] = [];

  register(entry: OverlayEntry): void {
    this.stack.push(entry);
  }

  unregister(id: string): void {
    this.stack = this.stack.filter((entry) => entry.id !== id);
  }

  top(): OverlayEntry | undefined {
    return this.stack.at(-1);
  }

  isTop(id: string): boolean {
    return this.top()?.id === id;
  }

  size(): number {
    return this.stack.length;
  }
}

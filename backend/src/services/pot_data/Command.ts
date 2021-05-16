export class Command {
  time: number;
  constructor(public command: string, public args?: any) {
    this.time = Math.floor(Date.now() / 1000);
  }
  refreshTime() {
    this.time = Math.floor(Date.now() / 1000);
    return this;
  }
}

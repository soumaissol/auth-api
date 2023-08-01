class InvalidInput extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super();
    this.message = message;
    this.code = code;
  }
}

export default InvalidInput;

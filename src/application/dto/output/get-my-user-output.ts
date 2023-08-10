export default class GetMyUserOutput {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly roles: string[],
  ) {}
}

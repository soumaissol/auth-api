export default class NewPasswordRequiredForUserOutput {
  constructor(
    readonly token: string | null,
    readonly refreshToken: string | null,
    readonly expiresIn: number | null,
    readonly challenge: string | null,
    readonly session: string | null,
  ) {}
}

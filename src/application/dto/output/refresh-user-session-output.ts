export default class RefreshUserSessionOutput {
  constructor(
    readonly token: string | null,
    readonly refreshToken: string | null,
    readonly expiresIn: number | null,
    readonly challenge: string | null,
    readonly session: string | null,
  ) {}
}

export class JwtPayload {
    sub: number;
    email: string;
    permissions: string[];
    iat?: number;
    exp?: number;
}

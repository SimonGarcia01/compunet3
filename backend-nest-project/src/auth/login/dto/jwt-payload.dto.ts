export class JwtPayload {
    sub!: number;
    email!: string;
    roles!: string[];
    permissions!: string[];
    iat?: number;
    exp?: number;
}
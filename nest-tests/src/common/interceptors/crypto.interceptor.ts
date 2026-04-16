import * as crypto from 'crypto';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CryptoInterceptor implements NestInterceptor {
    private readonly algorithm = 'aes-256-cbc';
    private readonly secretKey: Buffer;
    private readonly iv: Buffer;

    constructor(private readonly configService: ConfigService) {
        this.secretKey = this.getCryptoBuffer('CRYPTO_SECRET_KEY', 32);
        this.iv = this.getCryptoBuffer('CRYPTO_IV', 16);
    }

    private getCryptoBuffer(key: 'CRYPTO_SECRET_KEY' | 'CRYPTO_IV', expectedLength: number): Buffer {
        const value = this.configService.get<string>(key);

        if (!value) {
            throw new Error(`${key} is required in environment variables`);
        }

        const buffer = Buffer.from(value, 'utf8');
        if (buffer.length !== expectedLength) {
            throw new Error(`${key} must be exactly ${expectedLength} bytes`);
        }

        return buffer;
    }

    private decrypt(encryptedText: string): unknown {
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.iv);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    private encrypt(value: unknown): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        let encrypted = cipher.update(JSON.stringify(value), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<{ encrypted: string }> {
        const request = context.switchToHttp().getRequest<{ body: unknown }>();

        if (this.hasEncryptedProperty(request.body)) {
            try {
                request.body = this.decrypt(request.body.encrypted);
            } catch (e) {
                if (e instanceof Error) {
                    throw new BadRequestException('Invalid encrypted body', e.message);
                }
            }
        }
        console.info('Decrypted request body:', request.body);
        return next.handle().pipe(
            map((data: unknown) => {
                return { encrypted: this.encrypt(data) };
            }),
        );
    }

    private hasEncryptedProperty(body: unknown): body is { encrypted: string } {
        return typeof body === 'object' && body !== null && 'encrypted' in body;
    }
}

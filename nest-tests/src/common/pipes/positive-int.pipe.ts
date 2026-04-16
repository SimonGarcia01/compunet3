import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
    transform(value: string, _metadata: ArgumentMetadata): number {
        const val = parseInt(value, 10);
        if (isNaN(val) || val <= 0) {
            throw new BadRequestException('Validation failed (positive integer is expected)');
        }
        return val;
    }
}

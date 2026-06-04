import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
    constructor(private readonly seedService: SeedService) {}

    @Mutation(() => String)
    async runSeed(): Promise<string> {
        return await this.seedService.runSeed();
    }
}

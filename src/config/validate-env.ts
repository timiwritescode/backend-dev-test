import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "src/validation/env.validation";



/**
 * Validates environment variables from process.env using class validator
 * to catch missing required variables during build
 * 
 * 
 * @param config - A record of envrionment variables from process.env
 * @returns An instance of validated EnvironmentVariable class
 * @throws Error if any required env veriable is missing
 */
export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        {enableImplicitConversion: true},
    );

    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        const errorMessage = errors
                .map((e) => Object.values(e.constraints || {}).join(', '))
                .join('\n');

        throw new Error(`Environment validation failed:\n${errorMessage}`);
    }


    return validatedConfig;
}
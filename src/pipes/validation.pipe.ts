import { ArgumentMetadata, Injectable, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { ValidationException } from "src/exceptions/validation.exception";


@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = errors
                .map(error => Object.values(error.constraints || {}))
                .reduce((acc, val) => acc.concat(val), []);

                return new ValidationException(messages);
            }
        })
    }

    
}
import { BadRequestException } from "@nestjs/common";

export class ValidationException extends BadRequestException {
    constructor(validationErrors: string[]) {
        super({statusCode: 400, message: validationErrors, error: "Validation Error"});
    }
}
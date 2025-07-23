import { ErrorResponseDto } from "./errorResponse.dto";

export class ValidationErrorResponseDto extends ErrorResponseDto {
    errors: string[] = []

    constructor(errors: string[]) {
        super(400, "Validation Failed")
        this.errors = errors;
    }
}
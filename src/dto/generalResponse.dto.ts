export class GeneralResponseDto<T>{
    success: boolean;
    description: string;
    data: T;

    constructor(success: boolean, description: string, data: T) {
        this.success = success;
        this.description = description;
        this.data = data;
    }
}
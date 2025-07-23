export class GeneralResponseDto{
    success: boolean;
    description: string;
    data: any;

    constructor(success: boolean, description: string, data: any) {
        this.success = success;
        this.description = description;
        this.data = data;
    }
}
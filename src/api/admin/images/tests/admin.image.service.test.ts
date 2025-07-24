import { Test, TestingModule } from "@nestjs/testing";
import { AdminImageService } from "../admin.image.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AwsService } from "src/aws/aws.service";
import { Image } from "src/entities/image.entity";
import { generateFileHash } from "src/util/util";
import { mockImageRepositoryCreateMethod, mockImageRepositorySaveMethod, mockUserRepositoryFindOnByMethod } from "./util/serviceMocks";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { send } from "process";


jest.mock("src/util/util")

describe("AdminImageService", () => {
    let service: AdminImageService;

    const mockUserRepository = {
        findOneBy: mockUserRepositoryFindOnByMethod
    }

    const mockImageRepository = {
        create: mockImageRepositoryCreateMethod,
        save: mockImageRepositorySaveMethod
    }

    const mockAWSService = {
        uploadSingleFile: jest.fn().mockImplementation((image: Express.Multer.File, imageHash: string) => 'http://mock.image.com/')
    }
    beforeEach(async () => {
        jest.clearAllMocks()
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: getRepositoryToken(User),
                useValue: mockUserRepository
            }, 
            {
            provide: getRepositoryToken(Image),
            useValue: mockImageRepository
            },
        AwsService,
        AdminImageService]
        })
        .overrideProvider(AwsService)
        .useValue(mockAWSService)
        .compile();

        service = module.get<AdminImageService>(AdminImageService);
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })

    let senderId = "senderUserId";
    let recipientId = "recipientUserId";
    let mockImage = {
        buffer: Buffer.from("mock-images"), 
        mimetype: "jpeg", 
        filename:"mock_image"} as Express.Multer.File; 

    it("should return GeneralResponseDto with a data field of ImageDto", async () => {
        

        (generateFileHash as jest.Mock).mockReturnValue("image_hash");

        expect((await service.sendImageToUser(senderId, recipientId, mockImage)).success).toBe(true);
        
        expect(mockUserRepository.findOneBy).toHaveBeenCalled();
        expect(mockImageRepository.create).toHaveBeenCalled();
        expect(mockImageRepository.save).toHaveBeenCalled();
        
    })

    it ("should throw NotFoundException if sender is not found", async () => {
        
        await expect(service.sendImageToUser(null, recipientId, mockImage)).rejects.toThrow(NotFoundException)

    })

    it("should throw NotFoundException if recipient is not found", async () => {
        
        await expect(service.sendImageToUser(senderId, null, mockImage)).rejects.toThrow(NotFoundException)
    })


    it("shoould throw BadRequestException if sender and recipient are the same", async () => {
        

        await expect(service.sendImageToUser(senderId, senderId, mockImage)).rejects.toThrow(BadRequestException)
    })
})
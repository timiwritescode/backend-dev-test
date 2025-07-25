import { Test, TestingModule } from "@nestjs/testing";
import { AdminImageController } from "../admin.image.controller"
import { AdminImageService } from "../admin.image.service";
import { FirebaseAuthGuard } from "src/guards/firebaseAuth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GeneralResponseDto } from "src/dto/generalResponse.dto";
import { ImageDto } from "src/api/image/dto/image.dto";
import { UserRole } from "src/entities/user.entity";
import { ImageUploadRequestDto } from "../../dtos/imageUpload.dto";
import { BadRequestException } from "@nestjs/common";

describe("AdminImageController", () => {
    let controller: AdminImageController;

    const mockAdminImageService = {
        sendImageToUser: jest.fn().mockImplementation((senderId, recipientId, image): GeneralResponseDto<ImageDto> => {
            return {
                success: true,
                description: "success",
                data: {
                    imageId: "mockImageID",
                    imageUrl: "mockImageUrl",
                    sender:{
                        userId: "mockSenderId",
                        email: "mock@sender.com",
                        username: "mockSenderUsername",
                        role: UserRole.ADMIN
                    },
                    recipient: {
                        userId: "mockReceiverId",
                        email: "mock@recipient.com",
                        username: "mockRecipientUsername",
                        role: UserRole.USER

                    },
                    caption: "Image caption",
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }
            }
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminImageController],
            providers: [AdminImageService]
        })
        .overrideGuard(FirebaseAuthGuard)
        .useValue({})
        .overrideGuard(RolesGuard)
        .useValue({})
        .overrideInterceptor(FileInterceptor)
        .useValue({})
        .overrideProvider(AdminImageService)
        .useValue(mockAdminImageService)
        .compile()

        controller = module.get<AdminImageController>(AdminImageController);
    })

    afterEach(() => {
    jest.clearAllMocks();
  });

  
    it("should be defined", () => {
        expect(controller).toBeDefined();
    })


    it("should return success to be true, call sendImageToUser with userId, recipientId, image", async () => {
      const mockImage = {
        buffer: Buffer.from("mock-images"), 
        mimetype: "jpeg", 
        filename:"mock_image"} as Express.Multer.File; 

        const mockReq = {user: {sub: "mockUserId"}};
        const mockDto:ImageUploadRequestDto = {
            recipientId: "mockRecipientID",
            caption: "mock image caption"
        };

        expect((await controller.sendImageToUser(mockImage, mockReq, mockDto)).success).toBe(true);
        expect(mockAdminImageService.sendImageToUser).toHaveBeenCalled();
        expect(mockAdminImageService.sendImageToUser).toHaveBeenCalledWith(mockReq.user.sub, mockDto.recipientId, mockImage)

    })


    it("should throw BadRequestException if image field is absent from request", async () => {
        const mockImage = undefined;
        const mockReq = {user: {sub: "mockUserId"}};
        const mockDto:ImageUploadRequestDto = {
            recipientId: "mockRecipientID",
            caption: "mock image caption"
        };
        await expect(controller.sendImageToUser(mockImage, mockReq, mockDto)).rejects.toThrow(BadRequestException);
    })
})
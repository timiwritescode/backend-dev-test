import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from '../image.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { GeneralResponseDto } from 'src/dto/generalResponse.dto';
import { multipleImagesDto } from '../dto/multipleImages.dto';
import { ImageDto } from '../dto/image.dto';
import { UserRole } from 'src/entities/user.entity';

describe('ImageService', () => {
  let service: ImageService;

  const mockImageRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(Image),
          useValue: mockImageRepo,
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRecievedImages', () => {
    it('should return paginated images for a user', async () => {
      const userId = 'user123';
      const mockImages = [{
          id: 1,
          imageUrl: "example_url",
          recipient: {},
          sender: {},
          caption: "example caption",
          customImageId: "imageID",
          createdAt: new Date(),
          updatedAt: new Date(),
          addId: jest.fn(),
      }]
      mockImageRepo.find.mockResolvedValue(mockImages);

      const result = await service.getAllRecievedImages(userId, 1, 10);

      expect(mockImageRepo.find).toHaveBeenCalledWith({
        where: { recipient: { fireBaseAuthUserId: userId } },
        skip: 0,
        take: 10,
        order: { updatedAt: 'DESC' },
        relations: { recipient: true, sender: true },
      });

      expect(result).toBeInstanceOf(GeneralResponseDto);
      expect(result.data).toBeInstanceOf(multipleImagesDto);
      expect(result.success).toBe(true);
    });
  });

  describe('getReceivedImageById', () => {
    it('should return image details if image is found', async () => {
      const userId = 'user123';
      const imageId = 'image456';
      const mockImage = {
                    id: 1,
                    imageUrl: "example_url",
                    recipient: {},
                    sender: {},
                    caption: "example caption",
                    customImageId: "imageID",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    addId: jest.fn(),
                };

      mockImageRepo.findOne.mockResolvedValue(mockImage);

      const result = await service.getReceivedImageById(userId, imageId);

      expect(mockImageRepo.findOne).toHaveBeenCalledWith({
        where: { recipient: { fireBaseAuthUserId: userId }, customImageId: imageId },
        relations: { recipient: true, sender: true },
      });

      expect(result).toBeInstanceOf(GeneralResponseDto);
      expect(result.data).toBeInstanceOf(ImageDto);
      expect(result.success).toBe(true);
    });

    it('should throw NotFoundException if image is not found', async () => {
      mockImageRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getReceivedImageById('mockUserId', 'mockImageId')
      ).rejects.toThrow(NotFoundException);
    });
  });
});

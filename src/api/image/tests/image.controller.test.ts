import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from '../image.controller';
import { ImageService } from '../image.service';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

describe('ImageController', () => {
  let controller: ImageController;

  const mockImageService = {
    getAllRecievedImages: jest.fn(),
    getReceivedImageById: jest.fn(),
  };

  const mockUserId = 'mock-user-id';
  const mockReq = { user: { sub: mockUserId } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [ImageService],
    })
    .overrideProvider(ImageService)
    .useValue(mockImageService)
    .overrideGuard(FirebaseAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .compile();

    controller = module.get<ImageController>(ImageController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe('getAllReceivedImages', () => {
    it('should call service with defaults if no query params provided', async () => {
      const result = ['image1', 'image2'];
      mockImageService.getAllRecievedImages.mockResolvedValue(result);

      const response = await controller.getAllReceivedImages(mockReq, undefined, undefined);

      expect(response).toEqual(result);
      expect(mockImageService.getAllRecievedImages).toHaveBeenCalledWith(mockUserId, 1, 10);
    }); 

    it('should call service with provided page and pageSize', async () => {
      const result = ['imageA'];
      mockImageService.getAllRecievedImages.mockResolvedValue(result);

      const response = await controller.getAllReceivedImages(mockReq, 2, 5);

      expect(response).toEqual(result);
      expect(mockImageService.getAllRecievedImages).toHaveBeenCalledWith(mockUserId, 2, 5);
    });
  });

  describe('getImageById', () => {
    it('should call service with user id and image id', async () => {
      const mockImageId = 'image123';
      const result = { id: mockImageId };
      mockImageService.getReceivedImageById.mockResolvedValue(result);

      const response = await controller.getImageById(mockReq, mockImageId);

      expect(response).toEqual(result);
      expect(mockImageService.getReceivedImageById).toHaveBeenCalledWith(mockUserId, mockImageId);
    });
  });
});

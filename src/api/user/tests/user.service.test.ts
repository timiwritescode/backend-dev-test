import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    fireBaseAuthUserId: 'firebase_uid',
    username: 'testuser',
    role: UserRole.USER,
    companies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    imagesPosted: [],
    imagesReceived: []
  };

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserDetails', () => {
    it('should return user details wrapped in GeneralResponseDto', async () => {
      mockRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserDetails(mockUser.email);

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        relations: { companies: false },
      });

      expect(result.success).toBe(true);
      expect(result.description).toEqual(expect.any(String));
      expect(result.data).toBeInstanceOf(UserDto);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, "getUserByEmail").mockResolvedValue(null);

      await expect(service.getUserDetails('notfound@example.com')).rejects.toThrow(NotFoundException);
    });
  });
});

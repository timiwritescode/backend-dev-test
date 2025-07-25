import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
 
  const mockUserService = {
    getUserDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .overrideGuard(FirebaseAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .compile();

    controller = module.get<UserController>(UserController);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserDetails', () => {
    it('should return user details from service', async () => {
      const mockUser = { email: 'user@example.com' };
      const mockReq = { user: mockUser };

      const mockResponse = { 
        success: true, 
        description: "Success", 
        data:  { email: 'email@mock.co',
                username: "mock_username",
                userId: "mock_id",
                role: UserRole.ADMIN    
                }};

      mockUserService.getUserDetails.mockResolvedValue(mockResponse);

      const result = await controller.getUserDetails(mockReq);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.getUserDetails).toHaveBeenCalledWith(mockUser.email);
    });
  });
});

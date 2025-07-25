import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../company.controller';
import { CompanyService } from '../company.service';
import { CreateCompanyDto } from '../dto/createCompanyRequest.dto';
import { UpdateCompanyDto } from '../dto/updateCompany.dto';
import { UserService } from 'src/api/user/user.service';
import { FirebaseAuthGuard } from 'src/guards/firebaseAuth.guard';
import { RolesGuard } from 'src/guards/roles.guard';


describe('CompanyController', () => {
  let controller: CompanyController;
  
  const mockResponse = {
        success: true,
        description: "Success",
        data: {}
    }


  const mockService = {
    getUserCompanies: jest.fn().mockResolvedValue(mockResponse),
    createCompany: jest.fn().mockResolvedValue(mockResponse),
    getUserCompanyById: jest.fn().mockResolvedValue(mockResponse),
    updateCompany: jest.fn().mockResolvedValue(mockResponse),
    deleteCompany: jest.fn().mockResolvedValue(null),
  };

  const mockReq = {
    user: {
      email: 'user@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService],
    })
    .overrideGuard(FirebaseAuthGuard)
    .useValue({})
    .overrideGuard(RolesGuard)
    .useValue({})
    .overrideProvider(CompanyService)
    .useValue(mockService)
    .compile();
    controller = module.get<CompanyController>(CompanyController);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUserCompanies', () => {
    it('should call service with default pagination', async () => {
      expect((await controller.getAllUserCompanies(mockReq, undefined, undefined)).success).toBe(true);
      expect(mockService.getUserCompanies).toHaveBeenCalledWith(mockReq.user.email, 1, 10);
    });

    it('should call service with custom pagination', async () => {
      expect((await controller.getAllUserCompanies(mockReq, 2, 20)).success).toBe(true);
      expect(mockService.getUserCompanies).toHaveBeenCalledWith(mockReq.user.email, 2, 20);
    });
  });

  describe('createCompany', () => {
    it('should call createCompany with email and dto', async () => {
      const dto: CreateCompanyDto = { 
        companyName: 'mock company',
        numberOfProducts: 2,
        numberOfUsers: 10000 };


      expect((await controller.createCompany(mockReq, dto)).success).toBe(true);
      expect(mockService.createCompany).toHaveBeenCalledWith(mockReq.user.email, dto);
    });
  });

  describe('getCompanyDetailsById', () => {
    it('should call getUserCompanyById with email and companyId', async () => {

      expect((await controller.getCompanyDetailsById('123', mockReq)).success).toBe(true);
      expect(mockService.getUserCompanyById).toHaveBeenCalledWith(mockReq.user.email, '123');
    });
  });

  describe('updateCompany', () => {
    it('should call updateCompany with email, id, and dto', async () => {
      const dto: UpdateCompanyDto = { name: 'Updated Co' } as any;
      expect((await controller.updateCompany(mockReq, '456', dto)).success).toBe(true);
      expect(mockService.updateCompany).toHaveBeenCalledWith(mockReq.user.email, '456', dto);
    });
  });

  describe('deleteCompany', () => {
    it('should call deleteCompany with email and id', async () => {
      expect(await controller.deleteCompany(mockReq, '789')).toBeNull();
      expect(mockService.deleteCompany).toHaveBeenCalledWith(mockReq.user.email, '789');
    });
  });
});

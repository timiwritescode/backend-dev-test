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
  let service: CompanyService;

  const mockService = {
    getUserCompanies: jest.fn(),
    createCompany: jest.fn(),
    getUserCompanyById: jest.fn(),
    updateCompany: jest.fn(),
    deleteCompany: jest.fn(),
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
      await controller.getAllUserCompanies(mockReq, undefined, undefined);
      expect(mockService.getUserCompanies).toHaveBeenCalledWith(mockReq.user.email, 1, 10);
    });

    it('should call service with custom pagination', async () => {
      await controller.getAllUserCompanies(mockReq, 2, 20);
      expect(mockService.getUserCompanies).toHaveBeenCalledWith(mockReq.user.email, 2, 20);
    });
  });

  describe('createCompany', () => {
    it('should call createCompany with email and dto', async () => {
      const dto: CreateCompanyDto = { name: 'Test Co' } as any;
      await controller.createCompany(mockReq, dto);
      expect(mockService.createCompany).toHaveBeenCalledWith(mockReq.user.email, dto);
    });
  });

  describe('getCompanyDetailsById', () => {
    it('should call getUserCompanyById with email and companyId', async () => {
      await controller.getCompanyDetailsById('123', mockReq);
      expect(mockService.getUserCompanyById).toHaveBeenCalledWith(mockReq.user.email, '123');
    });
  });

  describe('updateCompany', () => {
    it('should call updateCompany with email, id, and dto', async () => {
      const dto: UpdateCompanyDto = { name: 'Updated Co' } as any;
      await controller.updateCompany(mockReq, '456', dto);
      expect(mockService.updateCompany).toHaveBeenCalledWith(mockReq.user.email, '456', dto);
    });
  });

  describe('deleteCompany', () => {
    it('should call deleteCompany with email and id', async () => {
      await controller.deleteCompany(mockReq, '789');
      expect(mockService.deleteCompany).toHaveBeenCalledWith(mockReq.user.email, '789');
    });
  });
});

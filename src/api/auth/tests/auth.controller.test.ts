 import { AuthController } from "../auth.controller";
 import { Test, TestingModule} from "@nestjs/testing"
import { AuthService } from "../auth.service";
import { UserRole } from "src/entities/user.entity";
 

 describe("AuthService", () => {
     let controller: AuthController;

    const mockAuthService = {
        signUpUser: jest.fn().mockImplementation(dto => {
            return {
                success: true,
                description: "User created",
                data: {
                    userId: "mock_id",
                    ...dto
                } 
            }
        }),

        signInUser: jest.fn().mockImplementation((dto) => {
            return {
                success: true,
                description: "Login successful",
                data: {
                    idToken: "mock_id_token"
                }
            }
        })
    };

     beforeEach(async () => {
         const module: TestingModule = await Test.createTestingModule({
             controllers: [AuthController],
             providers: [AuthService]
         }).overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

         controller = module.get<AuthController>(AuthController);
     })


     it('should be defined', () => {
        expect(controller).toBeDefined();
     });

     it('should regster user', async () => {
        const mockDto = {
            email: "mock@email.com",
            username: "mock_user",
            password: "some_password",
            role: UserRole.USER
        }
        const mockSuccess ={
            success: true,
            description: expect.any(String),
            data: {
                userId: expect.any(String),
                ...mockDto
            }
        }
        
        expect(await controller.registerUser(mockDto)).toEqual(mockSuccess)
        expect(mockAuthService.signUpUser).toHaveBeenCalled();
        expect(mockAuthService.signUpUser).toHaveBeenCalledWith(mockDto)
        
     })

     it('should sign in a user', async () => {
        const mockSignInDto = {
            email: "mock@email.com",
            password: "mockPassword"
        };

        const mock_response = {
            success: true,
            description: expect.any(String),
            data: {
                idToken: expect.any(String)
            }
        }
        expect(await controller.signInUser(mockSignInDto)).toEqual(mock_response)
        expect(mockAuthService.signInUser).toHaveBeenCalled();
        expect(mockAuthService.signInUser).toHaveBeenCalledWith(mockSignInDto);
     })
 })
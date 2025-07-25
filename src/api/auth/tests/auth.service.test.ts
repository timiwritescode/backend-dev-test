import { UserService } from "src/api/user/user.service";
import { AuthService } from "../auth.service"
import { Test, TestingModule} from "@nestjs/testing"
import { FirebaseAdmin } from "src/config/firebase.config";
import { FirebaseService } from "../firebase.service";
import { UserDto } from "src/api/user/dto/user.dto";
import { SignUpRequestDto } from "../dtos/signUpRequest.dto";
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { SignInRequestDto } from "../dtos/signInRequest.dto";

describe("AuthService", () => {
    let authService: AuthService;

    let mockUserService = {
        createUser: jest.fn().mockImplementation((email, uid, username, role) => {
            return {
                email: email,
                userId: uid,
                role: role,
                username: username
            }
        })
    }

    const mockAuth = {
        createUser: jest.fn().mockImplementation((options) => {
                            return {
                                uid: "Mock_UID"
                            }
                        }),
        setCustomUserClaims: jest.fn((uid, options) => jest.fn())
                                
    }

    const mockFirebaseApp = {
        auth: jest.fn(() => mockAuth)
    }

    let mockFirebaseAdmin = {
        getFirebaseApp: jest.fn().mockImplementation(() => mockFirebaseApp)
    }

    let mockFirebaseService = {
        signInWithEmailAndPassword: jest.fn().mockImplementation((email, password) => {
            return {idToken: "mock_firebase_id_token"}
        })
    }


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, UserService, FirebaseAdmin, FirebaseService]
        }).overrideProvider(UserService)
        .useValue(mockUserService)
        .overrideProvider(FirebaseAdmin)
        .useValue(mockFirebaseAdmin)
        .overrideProvider(FirebaseService)
        .useValue(mockFirebaseService)
        .compile();

        authService = module.get<AuthService>(AuthService);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    })

    it('should create a new firebase user, save user to database', async () => {
        const mockDto: SignUpRequestDto = {
            email: "email@mock.co",
            username: "mock_username",
            password: "mock_password",
            role: "user"
        };
        
        const mock_response = {
            success: true,
            description: expect.any(String),
            data: {
                email: mockDto.email,
                userId: expect.any(String),
                role: mockDto.role,
                username: mockDto.username
            }
        }
        expect(await authService.signUpUser(mockDto)).toEqual(mock_response);
        expect(mockFirebaseAdmin.getFirebaseApp).toHaveBeenCalled();
        expect(mockUserService.createUser).toHaveBeenCalledWith(mockDto.email, "Mock_UID", mockDto.username, mockDto.role);
    })

    it('should throw BadRequestException if password is invalid', async () => {
        const dto = {
            email: 'mock@email.com',
            password: '123',
            username: 'user',
            role: "user",
        };

        mockAuth.createUser.mockRejectedValue({code: 'auth/invalid-password'})
        
        await expect(authService.signUpUser(dto)).rejects.toThrow(BadRequestException);
    });


    it("should throw ConflictException if email already exists", async () => {
        const dto = {
            email: 'mock@email.com',
            password: '123',
            username: 'user',
            role: "user",
        };

        mockAuth.createUser.mockRejectedValue({code: "auth/email-already-exists"});
        await expect(authService.signUpUser(dto)).rejects.toThrow(ConflictException)
    })

    it("should throw BadRequestException if email is invalid", async () => {
        const dto = {
            email: 'invalid_email',
            password: '123',
            username: 'user',
            role: "user",
        };

        mockAuth.createUser.mockRejectedValue({code: "auth/invalid-email"})
        await expect(authService.signUpUser(dto)).rejects.toThrow(BadRequestException);
    })
    

    it ("return fetch id token and return GeneralResponseDto", async () => {
        const dto: SignInRequestDto = {
            email: "mock@email.co",
            password: "mock_password"
        };

        const mockResponse = {
            success: true,
            description: expect.any(String),
            data: {
                idToken: expect.any(String)
            }
        }
        expect(await authService.signInUser(dto)).toEqual(mockResponse)
        expect(mockFirebaseService.signInWithEmailAndPassword).toHaveBeenCalled();
        expect(mockFirebaseService.signInWithEmailAndPassword).toHaveBeenCalledWith(dto.email, dto.password)

    })

    it("should throw UnauthorizedException when email is not found", async () => {
        const dto: SignInRequestDto = {
            email: "mock@email.co",
            password: "mock_password"
        };

        mockFirebaseService.signInWithEmailAndPassword.mockRejectedValue({response: {data: {error: {message: "EMAIL_NOT_FOUND"}}}})
        await expect(authService.signInUser(dto)).rejects.toThrow(UnauthorizedException)
    })

    it("should throw UnauthorizedException when password is invalid", async () => {
        const dto: SignInRequestDto = {
            email: "mock@email.co",
            password: "mock_password"
        };

        mockFirebaseService.signInWithEmailAndPassword.mockRejectedValue({response: {data: {error: {message: "INVALID_PASSWORD"}}}})
        await expect(authService.signInUser(dto)).rejects.toThrow(UnauthorizedException)
    })

        it("should throw UnauthorizedException when credential is invalid", async () => {
        const dto: SignInRequestDto = {
            email: "mock@email.co",
            password: "mock_password"
        };

        mockFirebaseService.signInWithEmailAndPassword.mockRejectedValue({response: {data: {error: {message: "INVALID_LOGIN_CREDENTIALS"}}}})
        await expect(authService.signInUser(dto)).rejects.toThrow(UnauthorizedException)
    })
})
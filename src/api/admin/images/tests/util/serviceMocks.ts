import { Image } from "src/entities/image.entity";
import { User, UserRole } from "src/entities/user.entity";
import { FindOptionsWhere } from "typeorm";


const mockUserObjs = [{
            id: 1,
            email: 'email@mock.co',
            username: "mock_username",
            fireBaseAuthUserId: "mock_id",
            role: UserRole.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date(),
            imagesPosted: [],
            imagesReceived: [],
            companies: []
        }, {
            id: 2,
            email: 'email@mock.co',
            username: "mock_username",
            fireBaseAuthUserId: "mock_id",
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
            imagesPosted: [],
            imagesReceived: [],
            companies: []
        }]


const userObj = {}
const imageObj: Image = {
    id: 1,
    imageUrl: "example_url",
    recipient: mockUserObjs[1],
    sender: mockUserObjs[0],
    caption: "example caption",
    customImageId: "imageID",
    createdAt: new Date(),
    updatedAt: new Date(),
    addId: jest.fn(),
}        
export const mockUserRepositoryFindOnByMethod = jest
                                                .fn()
                                                .mockImplementation((findOptions: FindOptionsWhere<User>): User => {
                                                    if (findOptions.fireBaseAuthUserId?.toString().startsWith("sender")) {
                                                        return mockUserObjs[0]
                                                    }
                                                    if (findOptions.fireBaseAuthUserId?.toString().startsWith("recipient")){
                                                        return mockUserObjs[1]
                                                    }
                                                    })



export const mockImageRepositoryCreateMethod = jest.fn()
                                            .mockImplementation((image: Image) => imageObj)
                                            
                                            
export const mockImageRepositorySaveMethod = jest.fn().mockImplementation((image: Image) => imageObj)
import { Injectable, UnauthorizedException } from "@nestjs/common";
import axios from "axios";
import { EnvService } from "src/config/env.service";

@Injectable()
export class FirebaseService {
    constructor(private readonly envService: EnvService) {}

    
    async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
        const signInURL = this.envService.firebaseEmailAndPasswordSigninUrl + 
                                                "?key=" + 
                                                this.envService.firebaseApiKey;

        try {
                
            const { data } = await axios.post(
                signInURL,
                {   
                    email, 
                    password,
                    returnSecureToken: true
                },
                {   
                    headers: {
                        "Content-Type":  "application/json"
                    }
                }
            );
            return data;
            
        } catch (error) {
            const possibleErrorMessages = ["EMAIL_NOT_FOUND", "INVALID_PASSWORD", "INVALID_LOGIN_CREDENTIALS"]
            const code = error.response?.data?.error?.message;
            console.log(code)
            console.log(possibleErrorMessages.includes(code))
            if (possibleErrorMessages.includes(code)) {
                throw new UnauthorizedException("Invalid login credentials")
            }
            
        }
    }


}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { FirebaseAdmin } from "src/config/firebase.config";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly admin: FirebaseAdmin) {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("No bearer token provided");
        }

        const idToken = authHeader.split(' ')[1];

        try {
            const app = this.admin.getFirebaseApp();
            const decodedToken = await app.auth().verifyIdToken(idToken);
            request.user =  decodedToken;
            return true

        } catch(error) {
            throw new UnauthorizedException("Invalid token")
        }

    }
}
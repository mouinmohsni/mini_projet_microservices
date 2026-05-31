import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'MON_SECRET_TRES_SECURISE', // ⚠️ Le MÊME secret que dans auth-service
        });
    }

    async validate(payload: any) {
        // On récupère le rôle qui était caché dans le token !
        return { id: payload.sub, email: payload.email, role: payload.role , nom :payload.nom, prenom : payload.prenom };
    }
}

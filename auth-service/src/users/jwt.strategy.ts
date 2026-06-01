import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // On dit au videur de chercher le token dans le header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MON_SECRET_TRES_SECURISE', // Le même secret que dans users.module.ts
    });
  }

  // Si le token est valide, cette méthode est appelée automatiquement avec le contenu décodé (le payload)
  async validate(payload: any) {
    // On renvoie les infos qui seront attachées à la requête (req.user)
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      nom: payload.nom,
      prenom: payload.prenom,
    };
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // On dit de chercher le token dans le header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ⚠️ TRÈS IMPORTANT : Ce secret doit être EXACTEMENT le même que celui
      // que tu as mis dans le JwtModule du service Authentification !
      secretOrKey: 'MON_SECRET_TRES_SECURISE',
    });
  }

  // Cette méthode est appelée automatiquement si le token est valide
  async validate(payload: any) {
    // On extrait les infos du token pour les donner au Resolver
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      nom: payload.nom,
      prenom: payload.prenom,
    };
  }
}

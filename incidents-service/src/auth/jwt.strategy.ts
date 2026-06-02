import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      //  chercher le token et verification sa valideter
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  // Cette méthode est appelée automatiquement si le token est valide
  validate(payload: {
    sub: number;
    email: string;
    role: string;
    nom: string;
    prenom: string;
  }) {
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

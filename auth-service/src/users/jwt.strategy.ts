import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // verification du validiter du token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }
  validate(payload: {
    sub: number;
    email: string;
    role: string;
    nom: string;
    prenom: string;
  }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      nom: payload.nom,
      prenom: payload.prenom,
    };
  }
}

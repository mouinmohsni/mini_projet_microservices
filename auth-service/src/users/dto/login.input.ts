import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginInput {
    @Field()
    @IsEmail({}, { message: 'L\'email doit être valide' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;
}

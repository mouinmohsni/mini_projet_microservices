import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateZoneInput {
    @Field()
    @IsNotEmpty({ message: 'Le nom de la zone est requis' })
    @IsString()
    nom: string;
}

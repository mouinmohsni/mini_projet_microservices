import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateDensityInput {
    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(0, { message: 'La densité ne peut pas être négative' }) // On empêche d'avoir -5 véhicules !
    densite: number;
}

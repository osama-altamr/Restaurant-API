import { User } from 'src/auth/schemas/user.schema';
import { Category } from '../schemas/meal.schema';
import { IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  readonly price: number;
  @IsNotEmpty()
  @IsEnum(Category)
  readonly category: Category;
  @IsString()
  @IsNotEmpty()
  readonly resaturant: string;
  @IsEmpty({ message: 'You can not provide a user ID.' })
  readonly user: User;
}

import {
  IsNotEmpty,
  IsString,
  IsEmail,
  // IsPhoneNumber,
  IsEnum,
  IsEmpty,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.schema';
import { Meal } from 'src/meal/schemas/meal.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsEmail({}, { message: 'Please enter correct email address' })
  @IsString()
  readonly email: string;
  // @IsPhoneNumber()
  readonly phoneNo: number;
  @IsNotEmpty()
  @IsString()
  readonly address: string;
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category' })
  readonly category: Category;
  @IsEmpty({ message: 'You cannot provide the user ID' })
  readonly user: User;
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schemas/meal.schema';
import * as mongoose from 'mongoose';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name) private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restarantModel: mongoose.Model<Restaurant>,
  ) { }
  async findAll(): Promise<Meal[]> {
    const meals = await this.mealModel.find();
    return meals;
  }
  async findAllByRestaurant(id: string): Promise<Meal[]> {
    const meals = await this.mealModel.find({ restaurant: id });
    return meals;
  }

  async create(meal, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });
    console.log(meal.restaurant);
    const rest = await this.restarantModel.findById(meal.restaurant);
    if (!rest) {
      throw new NotFoundException('Restaurant not found ');
    }
    // Check ownership of the restaurnat
    if (rest.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not add meal to this restaurant ');
    }
    const mealCreated = await this.mealModel.create(data);

    rest.menu.push(mealCreated._id);
    await rest.save();
    return mealCreated;
  }

  findById(id: string): Promise<Meal> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Wrong mongoose id ' + id);
    }
    const meal = this.mealModel.findById(id);
    if (!meal) {
      throw new NotFoundException('Meal not found with this id ');
    }
    return meal;
  }

  async updateById(id: string, meal): Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, meal, {
      runValidators: true,
      new: true,
    });
  }
  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const res = await this.mealModel.findByIdAndDelete(id);
    if (!res) return { deleted: false };
    return { deleted: true };
  }
}

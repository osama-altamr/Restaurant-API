import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import mongoose, { Model } from 'mongoose';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async findAll(query): Promise<Restaurant[]> {
    const resPerPage = 1;
    const page = Number(query.page) || 1;
    const skip = resPerPage * (page - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return restaurants;
  }
  async create(restaurant: Restaurant, user: User): Promise<Restaurant> {
    const location = await APIFeatures.getRestaurantLocation(
      restaurant.address,
    );
    const data = Object.assign(restaurant, { user: user._id, location });
    const rest = await this.restaurantModel.create(data);

    return rest;
  }
  async findOne(id: string): Promise<Restaurant> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Wrong mongoose ID Error');
    }
    const rest = await this.restaurantModel.findById(id);
    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }
    return rest;
  }
  async updateById(id: string, restaurant): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }
  async deleteById(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }
  async uploadImages(id: string, files: Array<Express.Multer.File>) {
    const images = await APIFeatures.uplaod(files);

    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images,
      },
      { runValidators: true, new: true },
    );
    return restaurant;
  }
}

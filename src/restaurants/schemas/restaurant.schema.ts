import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Location } from './location.schema';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Meal } from 'src/meal/schemas/meal.schema';

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phoneNo: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images?: object[];
  @Prop({ type: Object, ref: 'Location' })
  location?: Location;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }] })
  menu?: object[];
}
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

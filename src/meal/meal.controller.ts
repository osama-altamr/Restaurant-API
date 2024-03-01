import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Meal } from './schemas/meal.schema';
import { CreateMealDto } from './dots/create-meal.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { MealService } from './meal.service';
import { UpdateMealDto } from './dots/update-meal.dto';

@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {
    console.log(mealService);
  }

  @Get()
  getMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get('restaurant/:id')
  getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findAllByRestaurant(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  createMeal(
    @CurrentUser() user: User,
    @Body() createMealDto: CreateMealDto,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }

  @Get(':id')
  getMealById(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateMeal(
    @Body() updateMealDto: UpdateMealDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    const meal = await this.mealService.findById(id);
    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not udpate this meal ');
    }
    console.log(updateMealDto);
    return this.mealService.updateById(id, updateMealDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteMeal(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const meal = await this.mealService.findById(id);
    if (meal.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not delete this meal ');
    }
    return this.mealService.deleteById(id);
  }
}

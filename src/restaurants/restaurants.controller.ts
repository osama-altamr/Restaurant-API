import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}
  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }
  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  @UsePipes(ValidationPipe)
  async createRestaurant(
    @CurrentUser() user: User,
    @Body() createRestaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurant, user);
  }
  @Get(':id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async updateRestaurant(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.findOne(id);
    if (user._id.toString() !== res.user.toString()) {
      throw new ForbiddenException('You can not update this restaurant.');
    }
    return this.restaurantsService.updateById(id, updateRestaurantDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.deleteById(id);

    if (restaurant) {
      return {
        deleted: true,
      };
    }
  }
  @Put('upload/:id')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(
            null,
            `${randomName}_${file.originalname.split('.')[0]}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const res = await this.restaurantsService.uploadImages(id, files);
    return res;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantEntity } from "./restaurant.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "restaurant",
  version: "1",
})
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(AccessGuard)
  async getHello(): Promise<RestaurantEntity[]> {
    return this.restaurantService.findAll();
  }

  @Post("fetch")
  @UseGuards(AccessGuard)
  async fetchOne(@Body() body): Promise<RestaurantEntity> {
    return this.restaurantService.getRestaurant(body.restaurant_uuid);
  }

  @Post()
  @UseGuards(AdminGuard)
  async createRestaurant(
    @Body() restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantService.createRestaurant(restaurant);
  }
}

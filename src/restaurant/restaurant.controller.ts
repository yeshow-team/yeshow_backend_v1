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
import {
  RestaurantEntity,
  RestaurantDetailEntity,
  RestaurantMenuEntity,
  RestaurantReviewEntity,
} from "./restaurant.entity";
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

  @Post()
  @UseGuards(AdminGuard)
  async createRestaurant(
    @Body() restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantService.createRestaurant(restaurant);
  }

  @Post("detail")
  @UseGuards(AccessGuard)
  async getRestaurantDetail(@Body() body): Promise<object> {
    const restaurant = await this.restaurantService.getRestaurantDetail(
      body.restaurant_uuid,
    );
    const menu = await this.restaurantService.getRestaurantMenu(
      body.restaurant_uuid,
    );
    const review = await this.restaurantService.getRestaurantReview(
      body.restaurant_uuid,
    );
    return {
      restaurant,
      menu,
      review,
    };
  }

  @Post("detail/fetch")
  @UseGuards(AccessGuard)
  async fetchDetail(@Body() body): Promise<RestaurantDetailEntity> {
    return this.restaurantService.getRestaurantDetail(body.restaurant_uuid);
  }

  @Post("detail/create")
  @UseGuards(AdminGuard)
  async createDetail(
    @Body() restaurantDetail: RestaurantDetailEntity,
  ): Promise<RestaurantDetailEntity> {
    return this.restaurantService.createRestaurantDetail(restaurantDetail);
  }

  @Post("menu/fetch")
  @UseGuards(AccessGuard)
  async fetchMenu(@Body() body): Promise<RestaurantMenuEntity[]> {
    return this.restaurantService.getRestaurantMenu(body.restaurant_uuid);
  }

  @Post("menu/create")
  @UseGuards(AdminGuard)
  async createMenu(
    @Body() restaurantMenu: RestaurantMenuEntity,
  ): Promise<RestaurantMenuEntity> {
    return this.restaurantService.createRestaurantMenu(restaurantMenu);
  }

  @Post("review/fetch")
  @UseGuards(AccessGuard)
  async fetchReview(@Body() body): Promise<RestaurantReviewEntity[]> {
    return this.restaurantService.getRestaurantReview(body.restaurant_uuid);
  }

  @Post("review/create")
  @UseGuards(AccessGuard)
  async createReview(
    @Body() restaurantReview: RestaurantReviewEntity,
    @Req() req,
  ): Promise<RestaurantReviewEntity> {
    return this.restaurantService.createRestaurantReview(
      this.restaurantService.getUUIDFromReq(req),
      restaurantReview,
    );
  }
}

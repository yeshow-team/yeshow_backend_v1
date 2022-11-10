import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
  Delete,
  Param,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import {
  RestaurantEntity,
  RestaurantDetailEntity,
  RestaurantMenuEntity,
  RestaurantReviewEntity,
  RestaurantLikeEntity,
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

  @Get("detail/:restaurant_uuid")
  @UseGuards(AccessGuard)
  async getRestaurantDetail(
    @Param("restaurant_uuid") restaurant_uuid,
  ): Promise<object> {
    const restaurant = await this.restaurantService.getRestaurant(
      restaurant_uuid.restaurant_uuid,
    );
    const restaurant_detail = await this.restaurantService.getRestaurantDetail(
      restaurant_uuid.restaurant_uuid,
    );
    const menu = await this.restaurantService.getRestaurantMenu(
      restaurant_uuid.restaurant_uuid,
    );
    const review = await this.restaurantService.getRestaurantReview(
      restaurant_uuid.restaurant_uuid,
    );
    return {
      restaurant,
      restaurant_detail,
      menu,
      review,
    };
  }

  @Post("detail/fetch")
  @UseGuards(AccessGuard)
  async fetchDetail(@Body() body): Promise<object> {
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

  @Post("review")
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

  @Patch("review")
  @UseGuards(AccessGuard)
  async updateReview(
    @Body() restaurantReview: RestaurantReviewEntity,
    @Req() req,
  ): Promise<RestaurantReviewEntity> {
    return this.restaurantService.updateRestaurantReview(
      this.restaurantService.getUUIDFromReq(req),
      restaurantReview,
    );
  }

  @Delete("review")
  @UseGuards(AccessGuard)
  async deleteReview(
    @Body() restaurant_uuid: string,
    @Req() req,
  ): Promise<RestaurantReviewEntity> {
    return this.restaurantService.deleteRestaurantReview(
      this.restaurantService.getUUIDFromReq(req),
      restaurant_uuid,
    );
  }

  @Post("like/fetch")
  @UseGuards(AccessGuard)
  async getRestaurantLike(@Body() body): Promise<number> {
    return this.restaurantService.getRestaurantLike(body.restaurant_uuid);
  }

  @Post("like")
  @UseGuards(AccessGuard)
  async createRestaurantLike(
    @Body() restaurant_uuid: string,
    @Req() req,
  ): Promise<RestaurantLikeEntity> {
    return this.restaurantService.createRestaurantLike(
      this.restaurantService.getUUIDFromReq(req),
      restaurant_uuid,
    );
  }

  @Delete("like")
  @UseGuards(AccessGuard)
  async deleteRestaurantLike(
    @Body() restaurant_uuid: string,
    @Req() req,
  ): Promise<RestaurantLikeEntity> {
    return this.restaurantService.deleteRestaurantLike(
      this.restaurantService.getUUIDFromReq(req),
      restaurant_uuid,
    );
  }
}

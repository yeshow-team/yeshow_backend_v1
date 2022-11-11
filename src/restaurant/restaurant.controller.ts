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
  async findAll(): Promise<RestaurantEntity[]> {
    return this.restaurantService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async createRestaurant(
    @Body() restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantService.createRestaurant(restaurant);
  }

  @Get(":restaurant_uuid")
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
    const like = await this.restaurantService.getRestaurantLike(
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
      like,
      menu,
      review,
    };
  }

  @Get("detail/:restaurant_uuid")
  @UseGuards(AccessGuard)
  async fetchDetail(
    @Param("restaurant_uuid") restaurant_uuid,
  ): Promise<object> {
    return this.restaurantService.getRestaurantDetail(restaurant_uuid);
  }

  @Post("detail")
  @UseGuards(AdminGuard)
  async createDetail(
    @Body() restaurantDetail: RestaurantDetailEntity,
  ): Promise<RestaurantDetailEntity> {
    return this.restaurantService.createRestaurantDetail(restaurantDetail);
  }

  @Get("like/:restaurant_uuid")
  @UseGuards(AccessGuard)
  async getRestaurantLike(
    @Param("restaurant_uuid") restaurant_uuid,
  ): Promise<number> {
    return this.restaurantService.getRestaurantLike(restaurant_uuid);
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

  @Get("menu/:restaurant_uuid")
  @UseGuards(AccessGuard)
  async fetchMenu(
    @Param("restaurant_uuid") restaurant_uuid,
  ): Promise<RestaurantMenuEntity[]> {
    return this.restaurantService.getRestaurantMenu(restaurant_uuid);
  }

  @Post("menu")
  @UseGuards(AdminGuard)
  async createMenu(
    @Body() restaurantMenu: RestaurantMenuEntity,
  ): Promise<RestaurantMenuEntity> {
    return this.restaurantService.createRestaurantMenu(restaurantMenu);
  }

  @Get("review/:restaurant_uuid")
  @UseGuards(AccessGuard)
  async fetchReview(
    @Param("restaurant_uuid") restaurant_uuid,
  ): Promise<RestaurantReviewEntity[]> {
    return this.restaurantService.getRestaurantReview(restaurant_uuid);
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

  @Post("search")
  @HttpCode(200)
  @UseGuards(AccessGuard)
  async searchRestaurant(@Body() body): Promise<RestaurantEntity[]> {
    return this.restaurantService.searchRestaurant(body.search);
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  RestaurantEntity,
  RestaurantDetailEntity,
  RestaurantMenuEntity,
  RestaurantReviewEntity,
} from "./restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(RestaurantDetailEntity)
    private readonly restaurantDetailRepository: Repository<RestaurantDetailEntity>,
    @InjectRepository(RestaurantMenuEntity)
    private readonly restaurantMenuRepository: Repository<RestaurantMenuEntity>,
    @InjectRepository(RestaurantReviewEntity)
    private readonly restaurantReviewRepository: Repository<RestaurantReviewEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async findAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find();
  }

  async createRestaurant(
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantRepository.save(restaurant);
  }

  async getRestaurantDetail(
    restaurant_uuid: string,
  ): Promise<RestaurantDetailEntity> {
    return this.restaurantDetailRepository.findOne({
      where: { restaurant_uuid },
    });
  }

  async createRestaurantDetail(
    restaurantDetail: RestaurantDetailEntity,
  ): Promise<RestaurantDetailEntity> {
    return this.restaurantDetailRepository.save(restaurantDetail);
  }

  async getRestaurantMenu(
    restaurant_uuid: string,
  ): Promise<RestaurantMenuEntity[]> {
    return await this.restaurantMenuRepository.find({
      where: { restaurant_uuid },
    });
  }

  async createRestaurantMenu(
    restaurantMenu: RestaurantMenuEntity,
  ): Promise<RestaurantMenuEntity> {
    return this.restaurantMenuRepository.save(restaurantMenu);
  }

  async getRestaurantReview(
    restaurant_uuid: string,
  ): Promise<RestaurantReviewEntity[]> {
    return await this.restaurantReviewRepository.find({
      where: { restaurant_uuid },
    });
  }

  async createRestaurantReview(
    user_uuid: string,
    restaurantReview: RestaurantReviewEntity,
  ): Promise<RestaurantReviewEntity> {
    return this.restaurantReviewRepository.save({
      ...restaurantReview,
      user_uuid,
    });
  }
}

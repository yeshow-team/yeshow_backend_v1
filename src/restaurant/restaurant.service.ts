import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  RestaurantEntity,
  RestaurantDetailEntity,
  RestaurantMenuEntity,
  RestaurantReviewEntity,
  RestaurantLikeEntity,
} from "./restaurant.entity";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

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
    @InjectRepository(RestaurantLikeEntity)
    private readonly restaurantLikeRepository: Repository<RestaurantLikeEntity>,
    @InjectRepository(UserEntity)
    private readonly userService: UserService,
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

  async findAll(): Promise<any> {
    const restaurants = await this.restaurantRepository.find();
    restaurants.forEach(async (restaurant) => {
      const [result, total] =
        await this.restaurantReviewRepository.findAndCount({
          where: { restaurant_uuid: restaurant.restaurant_uuid },
          select: ["restaurant_review_rating"],
        });
      const rating = (await result).reduce(
        (acc, cur) => acc + cur.restaurant_review_rating,
        0,
      );
      restaurant.restaurant_rating = rating / total;
    });
    return restaurants;
  }

  async createRestaurant(
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantRepository.save(restaurant);
  }

  async getRestaurant(restaurant_uuid: string): Promise<RestaurantEntity> {
    return await this.restaurantRepository.findOne({
      where: { restaurant_uuid },
    });
  }

  async updateRestaurant(
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantRepository.save(restaurant);
  }

  async deleteRestaurant(restaurant_uuid: string): Promise<any> {
    this.restaurantDetailRepository.delete({ restaurant_uuid });
    this.restaurantMenuRepository.delete({ restaurant_uuid });
    this.restaurantLikeRepository.delete({ restaurant_uuid });
    this.restaurantReviewRepository.delete({ restaurant_uuid });
    return this.restaurantRepository.delete({ restaurant_uuid });
  }

  async getRestaurantDetail(restaurant_uuid: string): Promise<object> {
    const [result, total] = await this.restaurantReviewRepository.findAndCount({
      where: { restaurant_uuid },
      select: ["restaurant_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.restaurant_review_rating,
      0,
    );
    return {
      ...(await this.restaurantDetailRepository.findOne({
        where: { restaurant_uuid },
      })),
      rating: rating / total,
    };
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
    user_uuid: string,
  ): Promise<any> {
    const reviews = await this.restaurantReviewRepository.find({
      where: { restaurant_uuid },
    });
    const reviewResult = [];
    for (const review of reviews) {
      const user = await this.userService.getUserByUUID(review.user_uuid);
      reviewResult.push({
        ...review,
        ...user,
        myReview: review.user_uuid === user_uuid,
      });
    }
    return reviewResult;
  }

  async createRestaurantReview(
    user_uuid: string,
    restaurantReview: RestaurantReviewEntity,
  ): Promise<RestaurantReviewEntity> {
    // restaurants entity에 rating update
    const [result, total] = await this.restaurantReviewRepository.findAndCount({
      where: { restaurant_uuid: restaurantReview.restaurant_uuid },
      select: ["restaurant_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.restaurant_review_rating,
      0,
    );
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_uuid: restaurantReview.restaurant_uuid },
    });
    restaurant.restaurant_rating = rating / total;
    await this.restaurantRepository.save(restaurant);
    return this.restaurantReviewRepository.save({
      ...restaurantReview,
      user_uuid,
    });
  }

  async updateRestaurantReview(
    user_uuid: string,
    restaurantReview: RestaurantReviewEntity,
  ): Promise<RestaurantReviewEntity> {
    // restaurants entity에 rating update
    const [result, total] = await this.restaurantReviewRepository.findAndCount({
      where: { restaurant_uuid: restaurantReview.restaurant_uuid },
      select: ["restaurant_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.restaurant_review_rating,
      0,
    );
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_uuid: restaurantReview.restaurant_uuid },
    });
    restaurant.restaurant_rating = rating / total;
    await this.restaurantRepository.save(restaurant);
    return this.restaurantReviewRepository.save({
      ...restaurantReview,
      user_uuid,
    });
  }

  async deleteRestaurantReview(
    user_uuid: string,
    restaurant_uuid: string,
  ): Promise<any> {
    // restaurants entity에 rating update
    const [result, total] = await this.restaurantReviewRepository.findAndCount({
      where: { restaurant_uuid },
      select: ["restaurant_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.restaurant_review_rating,
      0,
    );
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_uuid },
    });
    restaurant.restaurant_rating = rating / total;
    await this.restaurantRepository.save(restaurant);
    return this.restaurantReviewRepository.delete({
      user_uuid,
      restaurant_uuid,
    });
  }

  async getRestaurantLike(restaurant_uuid: string): Promise<number> {
    const like = await this.restaurantLikeRepository.count({
      where: { restaurant_uuid },
    });
    return like;
  }

  async createRestaurantLike(
    user_uuid: string,
    restaurant_uuid: string,
  ): Promise<RestaurantLikeEntity> {
    // restaurants entity에 like +1
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_uuid },
    });
    restaurant.restaurant_like += 1;
    await this.restaurantRepository.save(restaurant);
    return this.restaurantLikeRepository.save({
      user_uuid,
      restaurant_uuid,
    });
  }

  async deleteRestaurantLike(
    user_uuid: string,
    restaurant_uuid: string,
  ): Promise<any> {
    // restaurants entity에 like -1
    const restaurant = await this.restaurantRepository.findOne({
      where: { restaurant_uuid },
    });
    restaurant.restaurant_like -= 1;
    await this.restaurantRepository.save(restaurant);
    return this.restaurantLikeRepository.delete({
      user_uuid,
      restaurant_uuid,
    });
  }

  async searchRestaurant(search: string): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      where: [
        { restaurant_name: Like(`%${search}%`) },
        { restaurant_category: Like(`%${search}%`) },
      ],
    });
  }
}

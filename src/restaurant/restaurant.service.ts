import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RestaurantEntity } from "./restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
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

  async getRestaurant(restaurant_uuid: string): Promise<RestaurantEntity> {
    return this.restaurantRepository.findOne({ where: { restaurant_uuid } });
  }

  async createRestaurant(
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    return this.restaurantRepository.save(restaurant);
  }
}

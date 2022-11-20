import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RestaurantController } from "./restaurant.controller";
import {
  RestaurantEntity,
  RestaurantDetailEntity,
  RestaurantMenuEntity,
  RestaurantReviewEntity,
  RestaurantLikeEntity,
} from "./restaurant.entity";
import { RestaurantService } from "./restaurant.service";
import { UserEntity } from "src/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantEntity,
      RestaurantDetailEntity,
      RestaurantMenuEntity,
      RestaurantReviewEntity,
      RestaurantLikeEntity,
      UserEntity,
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, ConfigService, JwtService],
})
export class RestaurantModule {}

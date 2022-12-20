import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ShopController } from "./shop.controller";
import {
  ShopEntity,
  ShopDetailEntity,
  ShopMenuEntity,
  ShopReviewEntity,
  ShopLikeEntity,
} from "./shop.entity";
import { ShopService } from "./shop.service";
import { UserEntity } from "src/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShopEntity,
      ShopDetailEntity,
      ShopMenuEntity,
      ShopReviewEntity,
      ShopLikeEntity,
      UserEntity,
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService, ConfigService, JwtService],
})
export class ShopModule {}

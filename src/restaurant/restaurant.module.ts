import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantEntity } from "./restaurant.entity";
import { RestaurantService } from "./restaurant.service";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  controllers: [RestaurantController],
  providers: [RestaurantService, ConfigService, JwtService],
})
export class RestaurantModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AdminController } from "./admin.controller";
import { UserEntity } from "src/user/user.entity";
import { AdminService } from "./admin.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AdminController],
  providers: [AdminService, ConfigService, JwtService],
})
export class AdminModule {}

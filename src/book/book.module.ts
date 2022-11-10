import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BookController } from "./book.controller";
import { BookEntity } from "./book.entity";
import { BookService } from "./book.service";

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService, ConfigService, JwtService],
})
export class BookModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BookController } from "./book.controller";
import { BookEntity, BookMenuEntity } from "./book.entity";
import { BookService } from "./book.service";

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, BookMenuEntity])],
  controllers: [BookController],
  providers: [BookService, ConfigService, JwtService],
})
export class BookModule {}

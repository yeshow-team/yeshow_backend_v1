import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { BookEntity, BookMenuEntity } from "./book.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "user",
  version: "1",
})
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get(":book_id")
  @UseGuards(AccessGuard)
  getHello(): string {
    return;
  }
}

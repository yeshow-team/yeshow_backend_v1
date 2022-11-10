import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
  Param,
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

  @Get()
  @UseGuards(AccessGuard)
  async getBookList(@Req() req): Promise<BookEntity[]> {
    return this.bookService.getBookList(this.bookService.getUUIDFromReq(req));
  }

  @Get(":book_id")
  @UseGuards(AccessGuard)
  async getBook(
    @Req() req,
    @Param("book_id") book_id: number,
  ): Promise<BookEntity> {
    return this.bookService.getBook(
      this.bookService.getUUIDFromReq(req),
      book_id,
    );
  }

  @Post()
  @UseGuards(AccessGuard)
  async createBook(@Req() req, @Body() book: BookEntity): Promise<BookEntity> {
    return this.bookService.createBook(
      this.bookService.getUUIDFromReq(req),
      book,
    );
  }
}

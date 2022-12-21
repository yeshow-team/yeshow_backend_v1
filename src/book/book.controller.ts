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
import { createBook } from "./book.interface";
import { Delete } from "@nestjs/common/decorators";

@Controller({
  path: "book",
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
  async createBook(@Req() req, @Body() book: createBook): Promise<BookEntity> {
    return this.bookService.createBook(
      this.bookService.getUUIDFromReq(req),
      book,
    );
  }

  @Delete()
  @UseGuards(AdminGuard)
  async deleteBook(@Body() body): Promise<void> {
    return this.bookService.deleteBook(body.book_id);
  }
}

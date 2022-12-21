import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { BookEntity, BookMenuEntity } from "./book.entity";
import { createBook } from "./book.interface";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(BookMenuEntity)
    private readonly bookMenuRepository: Repository<BookMenuEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async getBookList(user_uuid: string): Promise<BookEntity[]> {
    return await this.bookRepository.find({
      where: { user_uuid },
    });
  }

  async getBook(user_uuid: string, book_id: number): Promise<BookEntity> {
    return await this.bookRepository.findOne({
      where: { user_uuid, book_id },
    });
  }

  async createBook(user_uuid: string, book: createBook): Promise<BookEntity> {
    const bookCreate = this.bookRepository.create({
      user_uuid,
      ...book.book,
    });
    await this.bookRepository.save(bookCreate);
    book.book_menu.forEach(async (menu) => {
      const bookMenuCreate = this.bookMenuRepository.create({
        book_id: bookCreate.book_id,
        ...menu,
      });
      await this.bookMenuRepository.save(bookMenuCreate);
    });
    return this.getBook(user_uuid, bookCreate.book_id);
  }

  async deleteBook(book_id: number): Promise<void> {
    await this.bookRepository.delete({ book_id });
    return;
  }
}

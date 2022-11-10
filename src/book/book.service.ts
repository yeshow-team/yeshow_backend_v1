import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { BookEntity, BookMenuEntity } from "./book.entity";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly userRepository: Repository<BookEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }
}

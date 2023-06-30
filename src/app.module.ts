import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ShopModule } from "./shop/shop.module";
import { BookModule } from "./book/book.module";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    ShopModule,
    BookModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

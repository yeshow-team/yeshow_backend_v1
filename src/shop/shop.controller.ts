import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
  Delete,
  Param,
} from "@nestjs/common";
import { ShopService } from "./shop.service";
import {
  ShopEntity,
  ShopDetailEntity,
  ShopMenuEntity,
  ShopReviewEntity,
  ShopLikeEntity,
} from "./shop.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { IMenu, IShop, IShopAndMenus, IShopDetail } from "./shop.interface";

@Controller({
  path: "shop",
  version: "1",
})
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @UseGuards(AccessGuard)
  async findAll(): Promise<ShopEntity[]> {
    return this.shopService.findAll();
  }

  @Get("myshop")
  @UseGuards(AdminGuard)
  async findMyShops(@Req() req): Promise<ShopEntity[]> {
    return this.shopService.findMyShops(this.shopService.getUUIDFromReq(req));
  }

  @Post()
  @UseGuards(AdminGuard)
  async createShopAndMenus(
    @Req() req,
    @Body() shopData: IShopAndMenus,
  ): Promise<void> {
    return this.shopService.createShopAndMenus(
      this.shopService.getUUIDFromReq(req),
      shopData,
    );
  }

  @Post("create")
  @UseGuards(AdminGuard)
  async createShop(@Req() req, @Body() shop: IShop): Promise<ShopEntity> {
    return this.shopService.createShop(
      this.shopService.getUUIDFromReq(req),
      shop,
    );
  }

  @Get(":shop_uuid")
  @UseGuards(AccessGuard)
  async getShopDetail(
    @Req() req,
    @Param("shop_uuid") shop_uuid: string,
  ): Promise<object> {
    const shop = await this.shopService.getShop(shop_uuid);
    const shop_detail = await this.shopService.getShopDetail(shop_uuid);
    const like = await this.shopService.getShopLike(shop_uuid);
    const menu = await this.shopService.getShopMenu(shop_uuid);
    const review = await this.shopService.getShopReviewByUser(
      shop_uuid,
      this.shopService.getUUIDFromReq(req),
    );
    const shopReview = await this.shopService.getShopReview(shop_uuid);
    const reviewCount = await this.shopService.getShopReviewCount(shop_uuid);
    let ratingSum = 0;
    for await (const i of shopReview) {
      ratingSum += i.rating;
    }
    shop.shop_rating = 4.5;
    return {
      shop,
      shop_detail,
      like,
      menu,
      review,
    };
  }

  @Patch()
  @UseGuards(AdminGuard)
  async updateShop(@Body() shop: IShopAndMenus): Promise<void> {
    return this.shopService.updateShopAndMenus(shop);
  }

  @Delete()
  @UseGuards(AdminGuard)
  async deleteShop(@Body() body): Promise<any> {
    return this.shopService.deleteShop(body.shop_uuid);
  }

  @Get("detail/:shop_uuid")
  @UseGuards(AccessGuard)
  async fetchDetail(@Param("shop_uuid") shop_uuid: string): Promise<object> {
    return this.shopService.getShopDetail(shop_uuid);
  }

  @Post("detail")
  @UseGuards(AdminGuard)
  async createDetail(
    @Body() shopDetail: IShopDetail,
  ): Promise<ShopDetailEntity> {
    return this.shopService.createShopDetail(shopDetail);
  }

  @Get("like/:shop_uuid")
  @UseGuards(AccessGuard)
  async getShopLike(@Param("shop_uuid") shop_uuid: string): Promise<number> {
    return this.shopService.getShopLike(shop_uuid);
  }

  @Post("like")
  @UseGuards(AccessGuard)
  async createShopLike(@Body() body: any, @Req() req): Promise<ShopLikeEntity> {
    return this.shopService.createShopLike(
      this.shopService.getUUIDFromReq(req),
      body.shop_uuid,
    );
  }

  @Delete("like")
  @UseGuards(AccessGuard)
  async deleteShopLike(@Body() body: any, @Req() req): Promise<ShopLikeEntity> {
    return this.shopService.deleteShopLike(
      this.shopService.getUUIDFromReq(req),
      body.shop_uuid,
    );
  }

  @Get("menu/:shop_uuid")
  @UseGuards(AccessGuard)
  async fetchMenu(
    @Param("shop_uuid") shop_uuid: string,
  ): Promise<ShopMenuEntity[]> {
    return this.shopService.getShopMenu(shop_uuid);
  }

  @Post("menu")
  @UseGuards(AdminGuard)
  async createMenu(@Body() shopMenu: IMenu): Promise<ShopMenuEntity> {
    return this.shopService.createShopMenu(shopMenu);
  }

  @Patch("menu")
  @UseGuards(AdminGuard)
  async updateMenu(@Body() shopMenu: IMenu): Promise<ShopMenuEntity> {
    return this.shopService.updateShopMenu(shopMenu);
  }

  @Delete("menu")
  @UseGuards(AdminGuard)
  async deleteMenu(@Body() body: { menu_id: number }): Promise<void> {
    return this.shopService.deleteShopMenu(body.menu_id);
  }

  @Get("review/:shop_uuid")
  @UseGuards(AccessGuard)
  async fetchReview(
    @Req() req,
    @Param("shop_uuid") shop_uuid: string,
  ): Promise<any> {
    return this.shopService.getShopReviewByUser(
      shop_uuid,
      this.shopService.getUUIDFromReq(req),
    );
  }

  @Get("review/all/:shop_uuid")
  @UseGuards(AdminGuard)
  async getShopReview(@Param("shop_uuid") shop_uuid: string) {
    return this.shopService.getShopReview(shop_uuid);
  }

  @Get("review/count/:shop_uuid")
  @UseGuards(AccessGuard)
  async getShopReviewCount(
    @Param("shop_uuid") shop_uuid: string,
  ): Promise<number> {
    return this.shopService.getShopReviewCount(shop_uuid);
  }

  @Post("review")
  @UseGuards(AccessGuard)
  async createReview(
    @Body() shopReview: ShopReviewEntity,
    @Req() req,
  ): Promise<ShopReviewEntity> {
    return this.shopService.createShopReview(
      this.shopService.getUUIDFromReq(req),
      shopReview,
    );
  }

  @Patch("review")
  @UseGuards(AccessGuard)
  async updateReview(
    @Body() shopReview: ShopReviewEntity,
    @Req() req,
  ): Promise<ShopReviewEntity> {
    return this.shopService.updateShopReview(
      this.shopService.getUUIDFromReq(req),
      shopReview,
    );
  }

  @Delete("review")
  @UseGuards(AccessGuard)
  async deleteReview(@Body() body, @Req() req): Promise<ShopReviewEntity> {
    return this.shopService.deleteShopReview(
      this.shopService.getUUIDFromReq(req),
      body.shop_uuid,
    );
  }

  @Post("search")
  @HttpCode(200)
  @UseGuards(AccessGuard)
  async searchShop(@Body() body): Promise<ShopEntity[]> {
    return this.shopService.searchShop(body.search);
  }
}

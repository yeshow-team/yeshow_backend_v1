import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  ShopEntity,
  ShopDetailEntity,
  ShopMenuEntity,
  ShopReviewEntity,
  ShopLikeEntity,
} from "./shop.entity";
import { UserEntity } from "src/user/user.entity";
import { IShop, IShopDetail, IMenu, IShopAndMenus } from "./shop.interface";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopRepository: Repository<ShopEntity>,
    @InjectRepository(ShopDetailEntity)
    private readonly shopDetailRepository: Repository<ShopDetailEntity>,
    @InjectRepository(ShopMenuEntity)
    private readonly shopMenuRepository: Repository<ShopMenuEntity>,
    @InjectRepository(ShopReviewEntity)
    private readonly shopReviewRepository: Repository<ShopReviewEntity>,
    @InjectRepository(ShopLikeEntity)
    private readonly shopLikeRepository: Repository<ShopLikeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async getUserByUUID(user_uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { user_uuid } });
  }

  async findAll(): Promise<any> {
    const shops = await this.shopRepository.find();
    let i = 0;
    for await (const shop of shops) {
      shops[i].shop_rating = 0;
      const shopReview = await this.getShopReview(shops[i].shop_uuid);
      const reviewCount = await this.getShopReviewCount(shops[i].shop_uuid);
      let ratingSum = 0;
      for await (const i of shopReview) {
        ratingSum += i.shop_review_rating;
      }
      console.log(ratingSum)
      const rating = ratingSum / reviewCount;
      shops[i].shop_rating = 4.3;
      i += 1;
    }
    console.log(shops[1].shop_rating);
    return shops;
  }

  async findMyShops(author_uuid: string): Promise<ShopEntity[]> {
    return await this.shopRepository.find({
      where: { author_uuid },
    });
  }

  async createShop(author_uuid: string, shop: IShop): Promise<ShopEntity> {
    return this.shopRepository.save({
      ...shop,
      author_uuid,
    });
  }

  async getShop(shop_uuid: string): Promise<ShopEntity> {
    return await this.shopRepository.findOne({
      where: { shop_uuid },
    });
  }

  async updateShop(shop: IShop, shop_uuid: string): Promise<void> {
    this.shopRepository.update(shop_uuid, shop);
    return;
  }

  async deleteShop(shop_uuid: string): Promise<any> {
    this.shopDetailRepository.delete({ shop_uuid });
    this.shopMenuRepository.delete({ shop_uuid });
    this.shopLikeRepository.delete({ shop_uuid });
    this.shopReviewRepository.delete({ shop_uuid });
    return this.shopRepository.delete({ shop_uuid });
  }

  async createShopAndMenus(
    author_uuid: string,
    shopData: IShopAndMenus,
  ): Promise<void> {
    const { shop, shop_detail, menus } = shopData;
    const shop_uuid = (await this.createShop(author_uuid, shop)).shop_uuid;
    shop_detail.shop_uuid = shop_uuid;
    await this.createShopDetail({ ...shop_detail, shop_uuid });
    await this.createShopMenus(menus, shop_uuid);
    return;
  }

  async updateShopAndMenus(shopData: IShopAndMenus): Promise<void> {
    const { shop, shop_detail, menus } = shopData;
    const shop_uuid = shop.shop_uuid;
    delete shop.shop_uuid;
    await this.updateShop(shop, shop_uuid);
    await this.updateShopDetail(shop_detail, shop_uuid);
    await this.updateShopMenus(menus, shop_uuid);
    return;
  }

  async getShopDetail(shop_uuid: string): Promise<object> {
    const [result, total] = await this.shopReviewRepository.findAndCount({
      where: { shop_uuid },
      select: ["shop_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.shop_review_rating,
      0,
    );
    return {
      ...(await this.shopDetailRepository.findOne({
        where: { shop_uuid },
      })),
      rating: rating / total,
    };
  }

  async createShopDetail(shopDetail: IShopDetail): Promise<ShopDetailEntity> {
    return this.shopDetailRepository.save(shopDetail);
  }

  async updateShopDetail(
    shopDetail: IShopDetail,
    shop_uuid: string,
  ): Promise<void> {
    this.shopDetailRepository.update(shop_uuid, shopDetail);
    return;
  }

  async getShopMenu(shop_uuid: string): Promise<ShopMenuEntity[]> {
    return await this.shopMenuRepository.find({
      where: { shop_uuid },
    });
  }

  async createShopMenu(shopMenu: IMenu): Promise<ShopMenuEntity> {
    return this.shopMenuRepository.save(shopMenu);
  }

  async createShopMenus(shopMenus: IMenu[], shop_uuid: string): Promise<void> {
    shopMenus.forEach(async (shopMenu) => {
      await this.shopMenuRepository.save({
        ...shopMenu,
        shop_uuid,
      });
    });
    return;
  }

  async updateShopMenu(shopMenu: IMenu): Promise<ShopMenuEntity> {
    return this.shopMenuRepository.save(shopMenu);
  }

  async updateShopMenus(shopMenus: IMenu[], shop_uuid: string): Promise<void> {
    shopMenus.forEach(async (shopMenu) => {
      if (!shopMenu.menu_id) {
        shopMenu.shop_uuid = shop_uuid;
        await this.shopMenuRepository.save(shopMenu);
        return;
      }
      await this.shopMenuRepository.update(shopMenu.menu_id, shopMenu);
    });
    return;
  }

  async deleteShopMenu(menu_id: number): Promise<void> {
    await this.shopMenuRepository.delete({ menu_id });
    return;
  }

  async getShopReviewByUser(
    shop_uuid: string,
    user_uuid: string,
  ): Promise<any> {
    const reviews = await this.shopReviewRepository.find({
      where: { shop_uuid },
    });
    const reviewResult = [];
    for (const review of reviews) {
      const user = await this.getUserByUUID(review.user_uuid);
      reviewResult.push({
        ...review,
        ...user,
        myReview: review.user_uuid === user_uuid,
      });
    }
    return reviewResult;
  }

  async getShopReview(shop_uuid: string): Promise<any> {
    return await this.shopReviewRepository.find({
      where: { shop_uuid },
      order: { shop_review_created_date: "DESC" },
    });
  }

  async getShopReviewCount(shop_uuid: string): Promise<number> {
    const [result, total] = await this.shopReviewRepository.findAndCount({
      where: { shop_uuid },
    });
    return total;
  }

  async createShopReview(
    user_uuid: string,
    shopReview: ShopReviewEntity,
  ): Promise<ShopReviewEntity> {
    await this.shopReviewRepository.save({
      ...shopReview,
      user_uuid,
    });
    const [result, total] = await this.shopReviewRepository.findAndCount({
      where: { shop_uuid: shopReview.shop_uuid },
      select: ["shop_review_rating"],
    });
    const rating = result.reduce((acc, cur) => acc + cur.shop_review_rating, 0);
    const shop = await this.shopRepository.findOne({
      where: { shop_uuid: shopReview.shop_uuid },
    });
    shop.shop_rating = rating / total;
    await this.shopRepository.save(shop);
    return;
  }

  async updateShopReview(
    user_uuid: string,
    shopReview: ShopReviewEntity,
  ): Promise<ShopReviewEntity> {
    // shops entity에 rating update
    await this.shopReviewRepository.save({
      ...shopReview,
      user_uuid,
    });
    const [result, total] = await this.shopReviewRepository.findAndCount({
      where: { shop_uuid: shopReview.shop_uuid },
      select: ["shop_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.shop_review_rating,
      0,
    );
    const shop = await this.shopRepository.findOne({
      where: { shop_uuid: shopReview.shop_uuid },
    });
    shop.shop_rating = rating / total;
    await this.shopRepository.save(shop);
    return;
  }

  async deleteShopReview(user_uuid: string, shop_uuid: string): Promise<any> {
    // shops entity에 rating update
    await this.shopReviewRepository.delete({
      user_uuid,
      shop_uuid,
    });
    const [result, total] = await this.shopReviewRepository.findAndCount({
      where: { shop_uuid },
      select: ["shop_review_rating"],
    });
    const rating = (await result).reduce(
      (acc, cur) => acc + cur.shop_review_rating,
      0,
    );
    const shop = await this.shopRepository.findOne({
      where: { shop_uuid },
    });
    shop.shop_rating = rating / total;
    await this.shopRepository.save(shop);
    return;
  }

  async getShopLike(shop_uuid: string): Promise<number> {
    const like = await this.shopLikeRepository.count({
      where: { shop_uuid },
    });
    return like;
  }

  async createShopLike(
    user_uuid: string,
    shop_uuid: string,
  ): Promise<ShopLikeEntity> {
    // shops entity에 like +1
    const shop = await this.shopRepository.findOne({
      where: { shop_uuid },
    });
    shop.shop_like += 1;
    await this.shopRepository.save(shop);
    return this.shopLikeRepository.save({
      user_uuid,
      shop_uuid,
    });
  }

  async deleteShopLike(user_uuid: string, shop_uuid: string): Promise<any> {
    // shops entity에 like -1
    const shop = await this.shopRepository.findOne({
      where: { shop_uuid },
    });
    shop.shop_like -= 1;
    await this.shopRepository.save(shop);
    return this.shopLikeRepository.delete({
      user_uuid,
      shop_uuid,
    });
  }

  async searchShop(search: string): Promise<ShopEntity[]> {
    return await this.shopRepository.find({
      where: [
        { shop_name: Like(`%${search}%`) },
        { shop_category: Like(`%${search}%`) },
      ],
    });
  }
}

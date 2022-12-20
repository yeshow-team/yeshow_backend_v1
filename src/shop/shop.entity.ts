import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity("shops")
export class ShopEntity {
  @PrimaryGeneratedColumn("uuid")
  shop_uuid: string;

  @Column({ length: 36, nullable: false })
  author_uuid: string;

  @Column({ length: 20, nullable: false })
  shop_name: string;

  @Column({ type: "text" })
  shop_image: string;

  @Column({ length: 32, nullable: false })
  shop_category: string;

  @Column({ default: 0, nullable: false })
  shop_type: number;

  @Column("decimal", {
    default: 0,
    nullable: false,
    precision: 38,
    scale: 0,
  })
  shop_rating: number;

  @Column({ default: 0, nullable: false })
  shop_like: number;

  @Column({ type: "text", nullable: false })
  business_registration_image: string;

  @Column({ type: "text", nullable: false })
  business_registration_certificate_image: string;

  @CreateDateColumn({ insert: false, update: false, select: false })
  shop_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  shop_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  shop_deleted_at: Date;
}

@Entity("shop_details")
export class ShopDetailEntity {
  @PrimaryColumn({ length: 36, nullable: false })
  shop_uuid: string;

  @Column({ type: "text", nullable: false })
  shop_description: string;

  @Column({ length: 20, nullable: false })
  shop_tell: string;

  @Column({ length: 254, nullable: false })
  shop_address: string;

  @Column({ length: 30, nullable: false })
  shop_business_hours: string;

  @Column({ length: 30, nullable: false })
  shop_closed_days: string;

  @CreateDateColumn({ insert: false, update: false, select: false })
  shop_detail_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  shop_detail_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  shop_detail_deleted_at: Date;
}

@Entity("shop_menus")
export class ShopMenuEntity {
  @PrimaryGeneratedColumn("increment")
  menu_id: number;

  @Column({ length: 36, nullable: false })
  shop_uuid: string;

  @Column({ type: "text", nullable: false })
  shop_menu_name: string;

  @Column({ type: "text", nullable: false })
  shop_menu_description: string;

  @Column({ nullable: false })
  shop_menu_price: number;

  @Column({ type: "text" })
  shop_menu_image: string;

  @Column({ default: 0, nullable: false })
  shop_menu_type: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  shop_menu_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  shop_menu_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  shop_menu_deleted_at: Date;
}

@Entity("shop_reviews")
export class ShopReviewEntity {
  @PrimaryGeneratedColumn("increment")
  review_id: number;

  @Column({ length: 36, nullable: false })
  shop_uuid: string;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ type: "text", nullable: false })
  shop_review_title: string;

  @Column({ type: "text", nullable: false })
  shop_review_detail: string;

  @Column("decimal", {
    default: 0,
    nullable: false,
    precision: 38,
    scale: 0,
  })
  shop_review_rating: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  shop_review_created_date: Date;

  @UpdateDateColumn({ insert: false })
  shop_review_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  shop_review_deleted_at: Date;
}

@Entity("shop_likes")
export class ShopLikeEntity {
  @PrimaryGeneratedColumn("increment")
  like_id: number;

  @Column({ length: 36, nullable: false })
  shop_uuid: string;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @CreateDateColumn({ insert: false, update: false, select: false })
  shop_like_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  shop_like_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  shop_like_deleted_at: Date;
}

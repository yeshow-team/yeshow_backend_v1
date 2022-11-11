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

@Entity("restaurants")
export class RestaurantEntity {
  @PrimaryGeneratedColumn("uuid")
  restaurant_uuid: string;

  @Column({ length: 20, nullable: false })
  restaurant_name: string;

  @Column({ type: "text" })
  restaurant_image: string;

  @Column({ length: 32, nullable: false })
  restaurant_category: string;

  @Column({ default: 0, nullable: false })
  restaurant_type: number;

  @Column({ default: 0, nullable: false })
  restaurant_rating: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  restaurant_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  restaurant_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  restaurant_deleted_at: Date;
}

@Entity("restaurant_details")
export class RestaurantDetailEntity {
  @PrimaryColumn({ length: 36, nullable: false })
  restaurant_uuid: string;

  @Column({ type: "text", nullable: false })
  restaurant_description: string;

  @Column({ length: 20, nullable: false })
  restaurant_tell: string;

  @Column({ length: 10, nullable: false })
  restaurant_zip_code: string;

  @Column({ length: 254, nullable: false })
  restaurant_address: string;

  @CreateDateColumn({ insert: false, update: false, select: false })
  restaurant_detail_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  restaurant_detail_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  restaurant_detail_deleted_at: Date;
}

@Entity("restaurant_menus")
export class RestaurantMenuEntity {
  @PrimaryGeneratedColumn("increment")
  menu_id: number;

  @Column({ length: 36, nullable: false })
  restaurant_uuid: string;

  @Column({ type: "text", nullable: false })
  restaurant_menu_name: string;

  @Column({ type: "text", nullable: false })
  restaurant_menu_description: string;

  @Column({ nullable: false })
  restaurant_menu_price: number;

  @Column({ type: "text" })
  restaurant_menu_image: string;

  @Column({ default: 0, nullable: false })
  restaurant_menu_type: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  restaurant_menu_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  restaurant_menu_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  restaurant_menu_deleted_at: Date;
}

@Entity("restaurant_reviews")
export class RestaurantReviewEntity {
  @PrimaryGeneratedColumn("increment")
  review_id: number;

  @Column({ length: 36, nullable: false })
  restaurant_uuid: string;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ type: "text", nullable: false })
  restaurant_review_title: string;

  @Column({ type: "text", nullable: false })
  restaurant_review_detail: string;

  @Column({ default: 0, nullable: false })
  restaurant_review_rating: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  restaurant_review_created_date: Date;

  @UpdateDateColumn({ insert: false })
  restaurant_review_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  restaurant_review_deleted_at: Date;
}

@Entity("restaurant_likes")
export class RestaurantLikeEntity {
  @PrimaryGeneratedColumn("increment")
  like_id: number;

  @Column({ length: 36, nullable: false })
  restaurant_uuid: string;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @CreateDateColumn({ insert: false, update: false, select: false })
  restaurant_like_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  restaurant_like_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  restaurant_like_deleted_at: Date;
}

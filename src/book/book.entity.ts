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

@Entity("books")
export class BookEntity {
  @PrimaryGeneratedColumn("increment")
  book_id: number;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ length: 36, nullable: false })
  restaurant_uuid: string;

  @Column({ nullable: false })
  book_date: Date;

  @Column({ nullable: false })
  book_people: number;

  @CreateDateColumn({ insert: false, update: false })
  book_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  book_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  book_deleted_at: Date;
}

@Entity("book_menus")
export class BookMenuEntity {
  @PrimaryColumn({ nullable: false })
  book_id: number;

  @Column({ nullable: false })
  menu_id: number;

  @Column({ nullable: false })
  book_menu_amount: number;

  @CreateDateColumn({ insert: false, update: false, select: false })
  book_menu_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  book_menu_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  book_menu_deleted_at: Date;
}

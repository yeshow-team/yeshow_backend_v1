import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserEntity } from "src/user/user.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "admin",
  version: "1",
})
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards(AccessGuard)
  getHello(): string {
    return this.adminService.getHello();
  }

  @Get("findall")
  @UseGuards(AdminGuard)
  async findAll(): Promise<UserEntity[]> {
    return this.adminService.findAll();
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Req,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUser } from "src/user/user.interface";
import { UserEntity } from "src/user/user.entity";

@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post("register")
  async createUser(@Body() userData: CreateUser): Promise<UserEntity> {
    return this.authService.createUser(userData);
  }

  @Post("login")
  @HttpCode(200)
  @UseGuards(AuthGuard("local"))
  async login(@Req() req): Promise<object> {
    const { user } = req;
    const refreshToken = await this.authService.getRefreshToken(user.user_id);
    return { refreshToken: refreshToken };
  }

  @Post("login/admin")
  @HttpCode(200)
  @UseGuards(AuthGuard("local"))
  async loginAdmin(@Req() req, @Res({ passthrough: true }) res) {
    const { user } = req;
    const refreshToken = await this.authService.getRefreshToken(user.user_id);
    res.cookie("refreshToken", refreshToken, {
      domain: this.config.get("SERVICE_DOMAIN"),
      httpOnly: this.config.get("NODE_ENV") === "production",
      secure: this.config.get("NODE_ENV") === "production",
      maxAge: 60 * 60 * 24 * 7 * 1000,
      SameSite: "None",
    });
    return { success: true };
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get("refresh")
  @UseGuards(AuthGuard("jwt-refresh-token"))
  async refreshAccessToken(@Req() req) {
    return this.authService.getAccessToken(req.cookies.refreshToken);
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt-refresh-token"))
  async logout(@Req() req) {
    this.authService.deleteRefreshToken(req.cookies.refreshToken);
    return;
  }

  @Post("valid/password")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt-access-token"))
  async validPassword(@Req() req) {
    return this.authService.validPassword(
      req.headers.authorization.split(" ")[1],
      req.body.user_pw,
    );
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  "jwt-access-token",
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("ACCESS_TOKEN_SECRET"),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate() {
    return true;
  }
}

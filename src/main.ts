import { INestApplication, Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("DAT REST API Gateway")
    .setDescription("DAT project REST API description")
    .setVersion("1.0")
    .addTag("REST")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("document/rest", app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>("FRONTEND_URL"),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization, Accept",
  });

  if (config.get<string>("NODE_ENV") === "development") {
    await swagger(app);
  }

  await app.listen(config.get<number>("PORT"));

  Logger.log(
    `Server running on ${config.get<string>("NODE_ENV")} mode`,
    "Bootstrap",
  );
  Logger.log(
    `Server running on http://localhost:${config.get<number>("PORT")}`,
    "Bootstrap",
  );
}
bootstrap();

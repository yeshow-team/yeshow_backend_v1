import { INestApplication, Logger, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { urlencoded, json } from "body-parser";

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
  app.use(json({ limit: "100mb" }));
  app.use(urlencoded({ limit: "100mb", extended: true }));

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
  const configSweger = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, configSweger);
  SwaggerModule.setup('api', app, document);

}
bootstrap();

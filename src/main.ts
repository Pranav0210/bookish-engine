import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session"
import * as passport from "passport"
import { createClient } from "redis"
import { RedisStore } from 'connect-redis';
import { FileValidationMiddleware } from './core/middleware/fileTypeCheck.middleware';
import { LoggingMiddleware } from './core/middleware/logging.middleware';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  // app.enableCors({
  //   origin: '*',
  //   methods: 'OPTIONS,HEAD,GET,PUT,PATCH,POST,DELETE',
  //   // // preflightContinue: false,
  //   credentials: true,
  //   allowedHeaders: '*',
  // });
  app.enableCors({
    origin: '*', // Adjust as needed (e.g., ["https://example.com"])
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, app',
  });

  // Create Redis client with user and password (for Redis ACL)
  const redisClient = createClient({

    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || '',
  })

  redisClient.connect().then(() => {
    console.log('🎉 Redis connected 🎉')
  }).catch((err) => {
    console.error('Failed to connect to Redis', err)
  })

  let redisStore = new RedisStore({
    client: redisClient,
    prefix: "letsTransport",
  })

  // Use Redis session store
  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.IS_LOCAL !== 'true', // or use a more appropriate check for your environment
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );


  // app.use(session({
  //   secret: process.env.SESSION_SECRET,
  //   resave: true,
  //   saveUninitialized: false,
  //   cookie: {
  //     httpOnly: true,
  //     secure: process.env.IS_LOCAL !== 'true',
  //     maxAge: 24 * 60 * 60 * 1000, // 24 hours
  //     // sameSite: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 'none' : 'lax',
  //     // sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
  //   }
  // }))
  app.use(new LoggingMiddleware().use.bind(new LoggingMiddleware()));
  app.use(passport.initialize())
  app.use(passport.session())
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

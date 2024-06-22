import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { envs } from './config/envs';
import { AuthModule } from './auth/auth.module';
import { BackupsModule } from './backups/backups.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductsModule } from './products/products.module';
import { TasksService } from './tasks/tasks.service';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude:['api/*'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      database: envs.dbName,
      username: envs.dbUsername,
      password: envs.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    BackupsModule,
    CategoriesModule,
    ProductsModule, 
    ProductCategoryModule, UploadModule,
  ],
  controllers: [],
  providers: [
    TasksService
  ],
})
export class AppModule {}

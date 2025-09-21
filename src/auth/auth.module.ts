import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST  ,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER  ,
      password: process.env.POSTGRES_PASSWORD  ,
      database: process.env.POSTGRES_DB  ,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    JwtModule.register({ secret: process.env.JWT_SECRET  , signOptions: { expiresIn: '1h' } }),
    TypeOrmModule.forFeature([User])
  ]
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { JwtAuthGuard } from '../url/auth/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthGuard, JwtAuthGuard],
  exports: [AuthGuard, JwtAuthGuard, JwtModule],
})
export class AuthModule {}

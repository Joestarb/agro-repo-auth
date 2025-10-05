import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import {
  LoginDto,
  RegisterDto,
} from '../../../../packages/common/dist/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (user)
      throw new UnauthorizedException('User already exists', {
        cause: new Error(),
        description: 'This email is already registered',
      });

    const hashed = await bcrypt.hash(dto.password, 10);
    const u = this.usersRepo.create({
      email: dto.email,
      password: hashed,
      role: dto.role || 'user',
    });
    await this.usersRepo.save(u);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { password, ...rest } = u as any;
    console.log(password);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rest;
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}

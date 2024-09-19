import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10), ...userData
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return  user;

    } catch (error) {
      if(error.code === 11000) throw new BadRequestException(`${createUserDto.email} Already Exists.`);
      throw new InternalServerErrorException ('Something Terribe Happen.')
    }
  }

  public async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if ( !user || !bcryptjs.compareSync(password, user.password)) throw new UnauthorizedException('Invalid Credentials');

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.generateJwt({ id: user.id })
    }
  }

  public async register( registerUserDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create(registerUserDto);

    return {
      user: user,
      token: this.generateJwt({ id: user._id })
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async findUserById( id: string ) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  public generateJwt( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
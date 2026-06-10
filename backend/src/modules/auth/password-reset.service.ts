import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { User } from './entities/user.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly tokenRepo: Repository<PasswordResetToken>,
    private readonly configService: ConfigService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('Email không tồn tại trong hệ thống');
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expiries in 15 mins

    // Save token to DB
    const resetToken = this.tokenRepo.create({
      email: dto.email,
      token: otp,
      expiresAt,
      isUsed: false,
    });
    await this.tokenRepo.save(resetToken);

    // Setup nodemailer
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT') || 587;
    const userMail = this.configService.get<string>('MAIL_USER');
    const passMail = this.configService.get<string>('MAIL_PASS');
    const fromMail = this.configService.get<string>('MAIL_FROM') || 'no-reply@recipe-ai.com';

    if (!host || !userMail || !passMail) {
      console.log(`\n======================================================`);
      console.log(`[PASSWORD RESET FALLBACK]`);
      console.log(`Email: ${dto.email}`);
      console.log(`OTP Token: ${otp}`);
      console.log(`Expires At: ${expiresAt.toISOString()}`);
      console.log(`======================================================\n`);

      return {
        success: true,
        message: 'Mã OTP đã được tạo (Chế độ Fallback: Vui lòng kiểm tra Console của Server)',
        email: dto.email,
        otp: otp, // Trả về OTP trong response khi chạy offline để tiện test
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: userMail,
          pass: passMail,
        },
      });

      await transporter.sendMail({
        from: `"AI Meal Planner" <${fromMail}>`,
        to: dto.email,
        subject: 'Mã OTP đặt lại mật khẩu - AI Meal Planner',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #10b981; text-align: center;">Đặt Lại Mật Khẩu</h2>
            <p>Chào bạn,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>AI Meal Planner</strong>.</p>
            <p>Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc đặt lại mật khẩu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; background: #f3f4f6; padding: 10px 20px; border-radius: 6px; border: 1px dashed #d1d5db;">
                ${otp}
              </span>
            </div>
            <p style="color: #ef4444; font-size: 14px;">Mã OTP này có hiệu lực trong vòng <strong>15 phút</strong> và chỉ sử dụng được một lần.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280; text-align: center;">Đây là email tự động từ hệ thống AI Meal Planner. Vui lòng không phản hồi lại email này.</p>
          </div>
        `,
      });

      return {
        success: true,
        message: 'Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn',
        email: dto.email,
      };
    } catch (error) {
      console.error('Lỗi khi gửi email đặt lại mật khẩu:', error);
      // Fallback in case of nodemailer failure
      return {
        success: true,
        message: 'Mã OTP đã được tạo (Lỗi gửi Mail: Fallback kiểm tra Console)',
        email: dto.email,
        otp: otp,
      };
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenRecord = await this.tokenRepo.findOne({
      where: {
        email: dto.email,
        token: dto.token,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn');
    }

    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Update isUsed
    tokenRecord.isUsed = true;
    await this.tokenRepo.save(tokenRecord);

    // Hash new password
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công',
    };
  }
}

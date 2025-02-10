import { PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
constructor (
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	async validateUser(email: string, password: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					email:email
				}
			});

			if (!user) {
				Logger.log(`User not found ${email}`, 'AuthService - validateUser');
				return null;
			}

			if (bcrypt.compareSync(password, user.password)) {
				const { password, ...result } = user;
				Logger.log(`Authorized User ${email}`, 'AuthService - validateUser');
				return{
					user: result,
					accessToken: this.jwtService.sign({...result, type: 'access'}, {expiresIn: process.env.JWT_ACCESS_EXPIRATION, secret: process.env.JWT_SECRET}),
					refreshToken: this.jwtService.sign({...result, type: 'refresh'}, {expiresIn: process.env.JWT_REFRESH_EXPIRATION, secret: process.env.JWT_SECRET}),
					status: true
				}
				// return result;
			}

			Logger.log(`Invalid Credentials ${email}`, 'AuthService - validateUser');
			return null;
		} catch (error) {
			Logger.error(error, 'AuthService - validateUser');
			return null;
		}
	}

	async refreshToken (token: string) {
		try {
			const decoded = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
			if (decoded.type === 'refresh') {
				const user = await this.prisma.user.findUnique({
					where: {
						id: decoded.id
					}
				});

				if (user) {
					const { password, ...result } = user;
					Logger.log(`Authorized User ${user.email}`, 'AuthService - refreshToken');
					return{
						user: result,
						accessToken: this.jwtService.sign({...result, type: 'access'}, {expiresIn: process.env.JWT_ACCESS_EXPIRATION, secret: process.env.JWT_SECRET}),
						// refreshToken: this.jwtService.sign({...result, type: 'refresh'}, {expiresIn: process.env.JWT_REFRESH_EXPIRATION, secret: process.env.JWT_SECRET}),
						status: true
					}
				}
			}
			return null;
		} catch (error) {
			Logger.error(error, 'AuthService - refreshToken');
			return null;
		}
	}

	async validateEmail(email: string, token: string) {
		// console.log(email, token)
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					email: email
				}
			});

			if (user) {
				if (user.isEmailVerified) {
					Logger.log(`User email already verified ${email}`, 'AuthService - validateEmail');
					return {
						status: false,
						message: 'Email already verified'
					};
				}
				const verificationToken = await this.prisma.verificationToken.findFirst({
					where: {
						userId: user.id,
						type: 'EmailVerification'
					},
					orderBy: {
						createdAt: 'desc'
					}
				});

				if (!verificationToken || verificationToken.utilized) {
					Logger.log(`Token not found or already utilized for ${email}`, 'AuthService - validateEmail');
					return {
						status: false,
						message: 'Invalid token'
					};
				}

				if (verificationToken?.createdAt <= new Date(Date.now() - 5 * 60 * 1000)) {
					Logger.log(`Token expired for ${email}`, 'AuthService - validateEmail');
					return {
						expired: true,
						status: false,
						message: 'Token expired'
					};
				}

				if (verificationToken?.token == token) {
					console.log('here')
					const updatedUser = await this.prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							isEmailVerified: true
						}
					});
					await this.prisma.verificationToken.update({
						where: {
							id: verificationToken.id
						},
						data: {
							utilized: true
						}
					});

					if (updatedUser) {
						Logger.log(`User email verified ${email}`, 'AuthService - validateEmail');
						return {
							status: true,
							message: 'Email verified successfully'
						}
					}
				}
			}

			return {
				status: false,
				message: 'Invalid token'
			};
		} catch (error) {
			Logger.error(error, 'AuthService - validateEmail');
			return {
				status: false,
				message: 'Invalid token'
			}
		}
	}

	async passwordReset(password: string, token: string) {

		try {
			const verificationToken = await this.prisma.verificationToken.findFirst({
				where: {
					token: token,
					type: 'PasswordReset'
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			if (!verificationToken || verificationToken.utilized) {
				Logger.log(`Token not found or already utilized for password reset`, 'AuthService - passwordReset');
				return {
					status: false,
					message: 'Invalid token'
				};
			}

			if (verificationToken?.createdAt <= new Date(Date.now() - 5 * 60 * 1000)) {
				Logger.log(`Token expired for password reset`, 'AuthService - passwordReset');
				return {
					expired: true,
					status: false,
					message: 'Token expired'
				};
			}

			const user = await this.prisma.user.findUnique({
				where: {
					id: verificationToken.userId
				}
			});

			if (user) {
				const hashedPassword = bcrypt.hashSync(password, 10);
				const updatedUser = await this.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						password: hashedPassword
					}
				});
				await this.prisma.verificationToken.update({
					where: {
						id: verificationToken.id
					},
					data: {
						utilized: true
					}
				});

				if (updatedUser) {
					Logger.log(`User password reset successfully`, 'AuthService - passwordReset');
					return {
						status: true,
						message: 'Password reset successfully'
					}
				}

			} else {
				Logger.log(`User not found for password reset`, 'AuthService - passwordReset');
				return {
					status: false,
					message: 'Invalid token'
				};
			}

		} catch (error) {
			Logger.error(error, 'AuthService - passwordReset');
			return {
				status: false,
				message: 'Invalid token'
			}
		}
	}
		
}

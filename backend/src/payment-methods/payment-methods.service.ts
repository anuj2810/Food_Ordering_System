import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod } from '@prisma/client';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';

@Injectable()
export class PaymentMethodsService {
    constructor(private prisma: PrismaService) { }

    async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
        return this.prisma.paymentMethod.findMany({
            where: { userId, isActive: true },
        });
    }

    async addPaymentMethod(userId: number, input: CreatePaymentMethodInput): Promise<PaymentMethod> {
        return this.prisma.paymentMethod.create({
            data: {
                userId,
                methodName: input.methodName,
                provider: input.provider,
                token: input.token,
            },
        });
    }

    async deletePaymentMethod(userId: number, id: number): Promise<boolean> {
        const method = await this.prisma.paymentMethod.findUnique({
            where: { id },
        });

        if (!method) {
            throw new NotFoundException('Payment method not found');
        }

        if (method.userId !== userId) {
            throw new BadRequestException('You do not own this payment method');
        }

        await this.prisma.paymentMethod.update({
            where: { id },
            data: { isActive: false },
        });

        return true;
    }
}

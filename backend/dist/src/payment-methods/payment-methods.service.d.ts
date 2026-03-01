import { PrismaService } from '../prisma/prisma.service';
import { PaymentMethod } from '@prisma/client';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
export declare class PaymentMethodsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPaymentMethods(userId: number): Promise<PaymentMethod[]>;
    addPaymentMethod(userId: number, input: CreatePaymentMethodInput): Promise<PaymentMethod>;
    deletePaymentMethod(userId: number, id: number): Promise<boolean>;
}

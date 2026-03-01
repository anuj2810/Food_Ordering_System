import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
export declare class PaymentMethodsResolver {
    private readonly paymentMethodsService;
    constructor(paymentMethodsService: PaymentMethodsService);
    getMyPaymentMethods(user: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: number;
        methodName: string;
        provider: string;
        token: string | null;
    }[]>;
    addPaymentMethod(createPaymentMethodInput: CreatePaymentMethodInput, user: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: number;
        methodName: string;
        provider: string;
        token: string | null;
    }>;
    deletePaymentMethod(id: number, user: any): Promise<boolean>;
}

declare class BaseUserResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number;
    countryId: number;
}
export declare class AuthResponse {
    accessToken: string;
    user: BaseUserResponse;
}
export {};

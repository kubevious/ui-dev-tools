import { IUserService } from '@kubevious/ui-middleware';

export class UserService implements IUserService {
    accessToken(): string {
        return `Bearer superSecretToken`;
    }

    userData(): string {
        return '{ userData: data }';
    }

    close() {}
}

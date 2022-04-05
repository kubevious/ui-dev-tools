import { IUserService } from '../../src/RestTool/types';

export class UserService implements IUserService {
    authorizationHeader(): string {
        return `superSecretToken`;
    }

    accessToken(): string {
        return `Bearer ${this.authorizationHeader()}`;
    }

    userData(): string {
        return '{ userData: data }';
    }

    accessTokenData() {
        return {
            foo: 'bar'
        }
    }

    close() {}
}

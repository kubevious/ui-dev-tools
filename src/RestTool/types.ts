import { IHttpClient, HttpMethod } from '@kubevious/ui-framework'
// import { IUserService } from '@kubevious/ui-middleware';

interface IUserService
{
    close() : void;

    accessToken() : string;
    userData() : any;
    accessTokenData() : any;
}

export interface EndpointSample {
    body?: any,
}
export interface EndpointInfo {
    name: string,
    method: HttpMethod
    params?: string[]
    sample?: EndpointSample
}

export interface ExpandedUserService extends IUserService {
    client: IHttpClient
}

export interface HttpParam {
    name: string
    value: string
}
import { IHttpClient, HttpMethod } from '@kubevious/ui-framework'
import { IUserService } from '@kubevious/ui-middleware';

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
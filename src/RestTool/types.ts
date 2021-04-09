import { HttpClient, HttpMethod } from '@kubevious/ui-framework'
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
    client: HttpClient
}

export interface HttpParam {
    name: string
    value: string
}
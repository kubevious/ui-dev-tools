import { HttpMethod } from '@kubevious/ui-framework'
export interface EndpointSample {
    params?: Record<string, any>,
    body?: any,
}
export interface EndpointInfo {
    name: string,
    method: HttpMethod
    params?: string[]
    sample?: EndpointSample
}

export type UserEndpointInfo = EndpointInfo | string;

export interface HttpParam {
    name: string
    value: string
}

import React, { FC, useEffect, useState } from 'react';
import _ from 'the-lodash';

import { EndpointInfo, HttpParam, UserEndpointInfo } from '../types';
import { HttpMethod } from '@kubevious/ui-framework';

import styles from './styles.module.css';

import { useService, app } from '@kubevious/ui-framework';
import { SectionedContent, Select } from '@kubevious/ui-components';
import { IDeveloperService } from '@kubevious/ui-middleware';

import { RequestComponent } from './RequestComponent'
import { ResponseComponent } from './ResponseComponent'

export const RestRequestTool : FC = () => {
    const service = useService<IDeveloperService>({ kind: 'developer' });

    const [endpoints, setEndpoints] = useState<Record<string, EndpointInfo>>({});

    const [editedRequestData, setEditedRequestData] = useState('{}');
    const [requestMethod, setRequestMethod] = useState(HttpMethod.GET.toString());
    const [requestPath, setRequestPath] = useState('');
    const [requestParams, setRequestParams] = useState<HttpParam[]>([]);
    const [paramsHistory, setParamsHistory] = useState<Record<string, string>>({});

    const [responseData, setResponseData] = useState('Response');
    const [responseCode, setResponseCode] = useState('');

    useEffect(() => {
        const endpointsFromState = app.sharedState.get<UserEndpointInfo[]>('endpoints', []);

        const generatedEndpoints = _.map(endpointsFromState, (x) => {
            if (_.isString(x)) {
                return {
                    name: x,
                    method: HttpMethod.GET,
                };
            } else {
                return x as EndpointInfo;
            }
        });


        const endpointsData: Record<string, EndpointInfo> = _.makeDict(
            generatedEndpoints,
            (x) => {
                return `${x.method} :: ${x.name}`;
            },
            (x) => x,
        );

        setEndpoints(endpointsData);
    }, []);


    const handleSendRequest = async (): Promise<void> => {
        let params: Record<string, string> | undefined = undefined;
        let data: Record<string, any> | undefined = undefined;

        params = _.makeDict(
            requestParams,
            (x) => x.name,
            (x) => x.value,
        );

        if (requestMethod !== HttpMethod.GET) {
            if (editedRequestData) {
                data = JSON.parse(editedRequestData);
            } else {
                data = {};
            }
        }

        const response = await service?.client?.execute(requestMethod as HttpMethod, requestPath, params, data);
        if (response) {
            setResponseData(JSON.stringify(response.data, null, 2));
            if (response.status) {
                setResponseCode(response.status.toString());
            }
        } else {
            setResponseData('Some mocked response...');
        }
    };

    const activateTemplate = (name: string) =>
    {
        const selectedTemplate = endpoints[name];
        if (!selectedTemplate) {
            setRequestPath('');
            setRequestMethod(HttpMethod.GET.toString());
            setRequestParams([]);
            setEditedRequestData('');
            return;
        }

        setRequestPath(selectedTemplate.name);
        setRequestMethod(selectedTemplate.method.toString());
        if (selectedTemplate.params) {
            setRequestParams(
                selectedTemplate.params.map((x) => {
                    return {
                        name: x,
                        value: paramsHistory[x] || '',
                    };
                }),
            );
        } else {
            setRequestParams([]);
        }
        if (selectedTemplate.sample) {
            if (selectedTemplate.sample.body) {
                setEditedRequestData(JSON.stringify(selectedTemplate.sample.body, null, 4));
            }
        }
    }

    const renderEndpointsTemplateSelector = () => {

        const options : any[] = [{ label: '', value: ''}];
        for(const endpoint of _.keys(endpoints))
        {
            options.push({ label: endpoint, value: endpoint})
        }

        return <Select options={options}
                       placeholder='Choose endpoint template'
                       onChange={(props: any) => activateTemplate(props?.value)}
                       />;
    };

    const updateRequestParams = (value: HttpParam[]) => {
        setRequestParams(value);

        let dict = _.makeDict(value, x => x.name, x => x.value);
        dict = _.defaults(dict, paramsHistory);

        setParamsHistory(dict);
    }


    return (
        <div data-testid='rest-request-tool'
             className={styles.restTool}>
            <h2>REST Tool</h2>

            <SectionedContent
                sections={[
                    {
                        title: 'Template',
                        content: renderEndpointsTemplateSelector()
                    },
                    {
                        title: 'Request',
                        content: 
                        <>
                            <RequestComponent   
                                requestMethod={requestMethod}
                                setRequestMethod={setRequestMethod}
                                requestPath={requestPath}
                                setRequestPath={setRequestPath}
                                requestParams={requestParams}
                                setRequestParams={updateRequestParams}
                                editedRequestData={editedRequestData}
                                setEditedRequestData={setEditedRequestData}
                                handleSendRequest={handleSendRequest}
                                />
                        </>
                    },
                    {
                        title: 'Response',
                        content: 
                        <>
                            <ResponseComponent
                                responseCode={responseCode}
                                responseData={responseData}
                                setResponseData={setResponseData}
                                />
                        </>
                    }
                ]}
            />

        </div>
    );
};

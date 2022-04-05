import React, { useEffect, useState } from 'react';
import _ from 'the-lodash';

import { EndpointInfo, ExpandedUserService, HttpParam } from './types';
import { HttpMethod } from '@kubevious/ui-framework';

import styles from './styles.module.css';

import { useService } from '@kubevious/ui-framework';
import { sharedState } from '@kubevious/ui-framework/dist/global';
import { CodeControl, CopyClipboard } from '@kubevious/ui-components';

import cx from 'classnames';

export const RestTool = () => {
    const service = useService<ExpandedUserService>({ kind: 'user' });

    const [editedRequestData, setEditedRequestData] = useState('{}');
    const [requestMethod, setRequestMethod] = useState(HttpMethod.GET.toString());
    const [requestPath, setRequestPath] = useState('');
    const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
    const [requestParams, setRequestParams] = useState<HttpParam[]>([]);
    const [paramsHistory, setParamsHistory] = useState<Record<string, string>>({});

    const [responseData, setResponseData] = useState('Response');
    const [responseCode, setResponseCode] = useState('');

    const [userData, setUserData] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [accessTokenData, setAccessTokenData] = useState('');

    useEffect(() => {
        setTimeout(() => {
            const endpointsFromState = sharedState.get<string[] | EndpointInfo[]>('endpoints', []);

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

            setEndpoints(generatedEndpoints);
        }, 100);
    }, []);

    const endpointsData: Record<string, EndpointInfo> = _.makeDict(
        endpoints,
        (x) => {
            return `${x.method} :: ${x.name}`;
        },
        (x) => x,
    );

    useEffect(() => {
        setAccessToken(service?.accessToken() || '');
        setUserData(service?.userData() || '');

        {
            const data = service?.accessTokenData();
            if (!data) {
                setAccessTokenData('');
            } else {
                setAccessTokenData(JSON.stringify(data, null, 4));
            }
        }

    }, [service]);

    const handleChangeRequest = (value: string): void => {
        setEditedRequestData(value);
    };

    const handleChangeAccessToken = (value: string): void => {
        setUserData(value);
    };

    const handleChangeAccessTokenData = (value: string): void => {
        setAccessTokenData(value);
    };

    const handleChangeResponse = (value: string) : void => {
        setResponseData(value);
    };

    const handleChangePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRequestPath(e.target.value);
    };

    const handleChangeRequestType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setRequestMethod(e.target.value);
    };

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

    const renderEndpointsTemplateSelector = () => {
        return (
            <select
                className={styles.select}
                onChange={(e) => {
                    const selectedTemplate = endpointsData[e.target.value];
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
                }}
            >
                <option value=''></option>
                {_.keys(endpointsData).map((endpoint, index) => (
                    <option key={index} value={endpoint}>
                        {endpoint}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div data-testid='rest-tool' className={`${styles.restTool} text-white`}>
            <h2>REST Tool</h2>
            <div className={styles.section}>
                <h3>Template</h3>
                {renderEndpointsTemplateSelector()}
            </div>

            <div className={styles.section}>
                <h3>Request</h3>

                <div>
                    <label className={styles.label}>Method: </label>
                    <select
                        className={styles.select}
                        onChange={(e) => handleChangeRequestType(e)}
                        value={requestMethod}
                    >
                        {_.keys(HttpMethod).map((method, index) => (
                            <option key={index} value={method.toString()}>
                                {method}
                            </option>
                        ))}
                    </select>
                    <label className={styles.label}>Path: </label>
                    <input
                        type='text'
                        value={requestPath}
                        className={cx(styles.input, styles.pathInput)}
                        onChange={(e) => handleChangePath(e)}
                    />
                </div>

                {requestPath && (
                    <>
                        <div className={styles.label}>Params:</div>
                        {requestParams.map((param, index) => (
                            <div key={index}>
                                <input
                                    type='text'
                                    value={param.name}
                                    className={cx(styles.input, styles.pathInput)}
                                    onChange={(e) => {
                                        param.name = e.target.value;
                                        setRequestParams(_.clone(requestParams));

                                        paramsHistory[param.name] = param.value;
                                        setParamsHistory(_.clone(paramsHistory));
                                    }}
                                />
                                <input
                                    type='text'
                                    value={param.value}
                                    className={cx(styles.input, styles.pathInput)}
                                    onChange={(e) => {
                                        param.value = e.target.value;
                                        setRequestParams(_.clone(requestParams));

                                        paramsHistory[param.name] = param.value;
                                        setParamsHistory(_.clone(paramsHistory));
                                    }}
                                />
                                <button
                                    className='btn btn-outline-danger'
                                    onClick={() => {
                                        requestParams.splice(index, 1);
                                        setRequestParams(_.clone(requestParams));

                                        delete paramsHistory[param.name];
                                        setParamsHistory(_.clone(paramsHistory));
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        <button
                            className='btn btn-outline-success'
                            onClick={() => {
                                requestParams.push({
                                    name: '',
                                    value: '',
                                });
                                setRequestParams(_.clone(requestParams));
                            }}
                        >
                            Add
                        </button>
                    </>
                )}
                <div className={styles.textAreaContainer}>
                    {requestMethod !== HttpMethod.GET && (
                        <>
                            <div className={styles.textAreaLabel}>Request Data:</div>

                            <CodeControl syntax="json"
                                 value={editedRequestData}
                                 handleChange={handleChangeRequest}
                                 showDownloadButton
                                 showCopyButton />
                        </>
                    )}
                    <div className={styles.btnWrapper}>
                        <button className='btn btn-outline-success' onClick={handleSendRequest}>
                            SEND
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <h3>Response</h3>
                <div className={styles.textAreaContainer}>
                    <div className={styles.textAreaLabel}>Status Code: {responseCode}</div>

                    <CodeControl syntax="json"
                                 value={responseData}
                                 handleChange={handleChangeResponse}
                                 showDownloadButton
                                 showCopyButton />
                </div>
            </div>
            <div className={styles.section}>
                <h3>Auth Info</h3>
                <div className={styles.textAreaContainer}>
                    <div className={styles.textAreaLabel}>User Data:</div>
                    <CodeControl syntax="json"
                                 value={userData}
                                 handleChange={handleChangeAccessToken}
                                 showDownloadButton
                                 showCopyButton />

                    <div className={styles.textAreaLabel}>JWT Data:</div>
                    <CodeControl syntax="json"
                                 value={accessTokenData}
                                 handleChange={handleChangeAccessTokenData}
                                 showDownloadButton
                                 showCopyButton />

                    <div className={styles.btnWrapper}>
                        <CopyClipboard text={accessToken} />
                    </div>
                </div>
            </div>
        </div>
    );
};

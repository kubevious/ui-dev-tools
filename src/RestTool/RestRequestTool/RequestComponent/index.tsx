import React, { FC } from 'react';
import _ from 'the-lodash';

import { HttpParam } from '../../types';

import { RequestPath } from './RequestPath'
import { RequestParams } from './RequestParams'
import { RequestBody } from './RequestBody'

import { Button } from '@kubevious/ui-components';

import styles from './styles.module.css';

export interface RequestComponentProps
{
    requestMethod: string;
    setRequestMethod: (value: string) => void;
    requestPath: string;
    setRequestPath: (value: string) => void;

    requestParams: HttpParam[];
    setRequestParams: (value: HttpParam[]) => void;

    editedRequestData: any;
    setEditedRequestData: (value: any) => void;

    handleSendRequest: () => void;
}

export const RequestComponent : FC<RequestComponentProps> = ({ 
    
    requestMethod, setRequestMethod,
    requestPath, setRequestPath,

    requestParams, setRequestParams,

    editedRequestData, setEditedRequestData,

    handleSendRequest

}) => {

    return <div className={styles.requestContainer}>
        <RequestPath requestMethod={requestMethod}
                        setRequestMethod={setRequestMethod}
                        requestPath={requestPath}
                        setRequestPath={setRequestPath}
                        />
            
        {requestPath && 
            <RequestParams requestParams={requestParams}
                            setRequestParams={setRequestParams}  />
            }

            <RequestBody requestMethod={requestMethod}
                            editedRequestData={editedRequestData}
                            setEditedRequestData={setEditedRequestData}
                            />

            <div className={styles.btnWrapper}>
                <Button type="success" onClick={handleSendRequest}>
                    SEND
                </Button>
            </div>
    </div>;
}
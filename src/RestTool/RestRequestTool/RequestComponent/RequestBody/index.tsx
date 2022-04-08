import React, { FC } from 'react';
import _ from 'the-lodash';

import { HttpMethod } from '@kubevious/ui-framework';

import styles from './styles.module.css';

import { CodeControl, Label } from '@kubevious/ui-components';

export interface RequestBodyProps
{
    requestMethod: string;
    editedRequestData: any;
    setEditedRequestData: (value: any) => void;
}

export const RequestBody : FC<RequestBodyProps> = ({ 
    requestMethod,
    editedRequestData,
    setEditedRequestData
}) => {

    return <div className={styles.requestBodyWrapper}>
        
        {requestMethod !== HttpMethod.GET && (
            <>
                <Label text="Request Data:" />

                <CodeControl syntax="json"
                        value={editedRequestData}
                        handleChange={setEditedRequestData}
                        showDownloadButton
                        showCopyButton />
            </>
        )}
          
    </div>;
};

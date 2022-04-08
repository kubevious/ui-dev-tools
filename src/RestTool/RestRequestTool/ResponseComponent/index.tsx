import React, { FC } from 'react';
import _ from 'the-lodash';

import styles from './styles.module.css';

import { CodeControl, Input, Label } from '@kubevious/ui-components';

export interface ResponseComponentProps
{
    responseCode: any;
    responseData: any;
    setResponseData: (value: any) => void;
}

export const ResponseComponent : FC<ResponseComponentProps> = ({ 
    responseCode,
    responseData,
    setResponseData
}) => {

    return <div className={styles.requestBodyWrapper}>

        <div className={styles.statusCodeWrapper}>
            <Label text="Status Code:" />
            <Input containerClassName={styles.statusCode}
                   value={responseCode}
                   readOnly />
        </div>        

        <div className={styles.codeControl}>
            <CodeControl syntax="json"
                     
                     value={responseData}
                     handleChange={setResponseData}
                     showDownloadButton
                     showCopyButton
                      />
        </div>

    </div>;
};

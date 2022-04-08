import React, { FC } from 'react';
import _ from 'the-lodash';

import { HttpMethod } from '@kubevious/ui-framework';

import styles from './styles.module.css';

import { Input, Label, Select } from '@kubevious/ui-components';

export interface RequestPathProps
{
    requestMethod: string;
    setRequestMethod: (value: string) => void;
    requestPath: string;
    setRequestPath: (value: string) => void;
}

export const RequestPath : FC<RequestPathProps> = ({ 
    requestMethod, setRequestMethod,
    requestPath, setRequestPath
}) => {
    const methodOptions = _.keys(HttpMethod).map(x => ({ label: x.toString(), value: x.toString() }));
    const selectedMethod = _.find(methodOptions, x => x.value == requestMethod);
   
    return <div className={styles.requestPath}>

        <Label text="Method:" />
        <Select className={styles.methodSelect}
                options={methodOptions}
                onChange={(props: any) => setRequestMethod(props.value)}
                value={selectedMethod}
                placeholder="Select Method"
                />

        <Label text="Path:" />
        <Input
            value={requestPath}
            containerClassName={styles.pathInput}
            onChange={(e) => setRequestPath(e.target.value)}
        />
    </div>
};

import React, { FC } from 'react';
import _ from 'the-lodash';

import styles from './styles.module.css';

import { Button, Input, Label } from '@kubevious/ui-components';
import { HttpParam } from '../../../types';

export interface RequestParamsProps
{
    requestParams: HttpParam[];
    setRequestParams: (value: HttpParam[]) => void;
}

export const RequestParams : FC<RequestParamsProps> = ({ 
    requestParams,
    setRequestParams
}) => {

    const makeParams = () => {
        return _.clone(requestParams);
    }
   
    return <div className={styles.requestParamsWrapper}>

        <Label text="Params:" />

        {requestParams.map((param, index) => (
            <div className={styles.requestParam}
                 key={index}>

                <Input  value={param.name}
                        containerClassName={styles.paramName}
                        onChange={(e) => {
                            param.name = e.target.value;
                            const newParams = makeParams();
                            setRequestParams(newParams);
                        }}
                        />

                <Input  value={param.value}
                        containerClassName={styles.paramValue}
                        onChange={(e) => {
                            param.value = e.target.value;
                            const newParams = makeParams();
                            setRequestParams(newParams);
                        }}
                        />

                <Button
                    type="danger"
                    onClick={() => {
                        const newParams = makeParams();
                        newParams.splice(index, 1);
                        setRequestParams(newParams);
                    }}
                >
                    Delete
                </Button>
            </div>
        ))}

        <div>
            <Button
                type="success"
                onClick={() => {
                    const newParams = makeParams();
                    newParams.push({
                        name: '',
                        value: '',
                    });
                    setRequestParams(newParams);
                }}
            >
                Add New Param
            </Button>
        </div>

    </div>;
};

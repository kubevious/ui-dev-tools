import React, { FC,  useState } from 'react';
import _ from 'the-lodash';
import { Promise } from 'the-promise';

import { useService } from '@kubevious/ui-framework';
import { CodeControl, SectionedContent, SectionItem } from '@kubevious/ui-components';
import { IDeveloperService } from '@kubevious/ui-middleware';

import styles from './styles.module.css';

export const DeveloperExtras : FC = () => {

    const [extras, setExtras] = useState<Record<string, any>>({});

    useService<IDeveloperService>({ kind: 'developer' }, 
        (svc) => {

            Promise.resolve(svc.extractExtras())
                .then(result => {
                    setExtras(result);
                })

        });

    if (!extras) {
        return <></>
    }
    if (_.keys(extras).length === 0) {
        return <></>
    }

    const renderValue = (value: any) => {

        if (_.isNullOrUndefined(value)) {
            return <></>;
        }

        if (_.isString(value)) {
            return <CodeControl syntax="javascript"
                value={value}
                showDownloadButton
                showCopyButton />
        }

        return <CodeControl syntax="json"
                    value={value}
                    showDownloadButton
                    showCopyButton />
    }
    
    const sections : SectionItem[] = 
        _.keys(extras).map(x => ({
            title: x,
            content: renderValue(extras[x])
        }));

    return (
        <div data-testid='dev-extras-tool'
             className={styles.devExtras}>
            <h2>Dev Extras</h2>

            <SectionedContent
                sections={sections}
            />

        </div>
    );
};

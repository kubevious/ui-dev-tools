import React, { FC } from 'react';
import _ from 'the-lodash';

import styles from './styles.module.css';

import { RestRequestTool } from './RestRequestTool';
import { DeveloperExtras } from './DeveloperExtras';

export const RestTool : FC = () => {

    return (
        <div data-testid='rest-tool'
             className={styles.restTool}>

            <RestRequestTool />
            
            <DeveloperExtras />
        </div>
    );
};

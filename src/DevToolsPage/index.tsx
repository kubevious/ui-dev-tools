import React, { ReactNode, useState } from 'react';
import { FontAwesomeIcon, FABrandsIcons, FASolidIcons } from '@kubevious/ui-components';
import { RestTool } from '../RestTool';
import { SharedStateDebugger } from '../SharedStateDebugger';
import { WebsocketTool } from '../WebsocketTool';
import cx from 'classnames';

export enum DevToolTabs {
    restTool = 'restTool',
    sharedStateDebugger = 'sharedStateDebugger',
    websocketTool = 'websocketTool',
}

export const DevToolsPage = () => {
    const [tab, setTab] = useState(DevToolTabs.sharedStateDebugger);

    const tabMapping: Record<DevToolTabs, ReactNode> = {
        [DevToolTabs.restTool]: <RestTool />,
        [DevToolTabs.sharedStateDebugger]: <SharedStateDebugger />,
        [DevToolTabs.websocketTool]: <WebsocketTool />,
    };

    return (
        <div className="p-3 overflow-auto">
            <div className="mb-2">
                <button
                    onClick={() => setTab(DevToolTabs.sharedStateDebugger)}
                    className={cx('btn', {
                        'btn-success': tab === DevToolTabs.sharedStateDebugger,
                        'btn-outline-success': tab !== DevToolTabs.sharedStateDebugger,
                    })}
                >
                    <FontAwesomeIcon icon={FASolidIcons.faBug} color="white" size="lg" className="me-2" />
                    Shared State Debugger
                </button>
                <button
                    onClick={() => setTab(DevToolTabs.restTool)}
                    className={cx('btn mx-2', {
                        'btn-success': tab === DevToolTabs.restTool,
                        'btn-outline-success': tab !== DevToolTabs.restTool,
                    })}
                >
                    <FontAwesomeIcon icon={FASolidIcons.faVials} color="white" size="lg" className="me-2" />
                    REST tool
                </button>

                <button
                    onClick={() => setTab(DevToolTabs.websocketTool)}
                    className={cx('btn', {
                        'btn-success': tab === DevToolTabs.websocketTool,
                        'btn-outline-success': tab !== DevToolTabs.websocketTool,
                    })}
                >
                    <FontAwesomeIcon icon={FABrandsIcons.faRocketchat} color="white" size="lg" className="me-2" />
                    Websocket Tool
                </button>
            </div>

            <div>{tabMapping[tab]}</div>
        </div>
    );
};

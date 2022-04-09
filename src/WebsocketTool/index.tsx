import React, { FC, useEffect, useState } from 'react';
import { app } from '@kubevious/ui-framework';

import _ from 'the-lodash';

import { Button, CodeControl, SectionedContent, Select } from '@kubevious/ui-components';
import { IWebSocketService } from '@kubevious/ui-middleware';

import styles from './styles.module.css';
import { WebSocketEndpointInfo } from './types';

export const WebsocketTool : FC = () => {
    const [currentService, setCurrentService] = useState<IWebSocketService | null>(null);

    const [endpoints, setEndpoints] = useState<Record<string, WebSocketEndpointInfo>>({});

    const [socketServiceQuery, setSocketServiceQuery] = useState<any>({
        kind: 'socket',
    });
    const [subscriptionContext, setSubscriptionContext] = useState<any>({
    });
    const [subscriptionTarget, setSubscriptionTarget] = useState<any>({
        kind: 'node',
        dn: 'root',
    });

    const [subscriptionResults, setSubscriptionResults] = useState<any[]>([]);

    useEffect(() => {
        const endpointsFromState = app.sharedState.get<WebSocketEndpointInfo[]>('websocket_endpoints', []);

        const endpointsData: Record<string, WebSocketEndpointInfo> = _.makeDict(
            endpointsFromState,
            (x) => x.name,
            (x) => x,
        );

        setEndpoints(endpointsData);
    }, []);

    const handleSubscribe = () => {

        {
            setSubscriptionResults([]);
            if (currentService) {
                currentService.close();
                setCurrentService(null);
            }
        }

        try {

            const service = app.serviceRegistry.resolveService<IWebSocketService>(socketServiceQuery);
            service.updateContext(subscriptionContext as Record<string, any>);
            service.subscribe(subscriptionTarget as Record<string, any>, (value) => {
                setSubscriptionResults(_.concat(subscriptionResults, value));
            });
            setCurrentService(service);

        } catch (error) {
            console.log(error);
            app.sharedState.set('is_error', true);
            app.sharedState.set('error', error);
        }

    };

    const handleDisconnect = () => {
        if (currentService) {
            currentService.close();
            setCurrentService(null);
        }
        setSubscriptionResults([]);
    }

    const handleClear = () => {
        setSubscriptionResults([]);
    }

    const activateTemplate = (name: string) =>
    {
        const selectedTemplate = endpoints[name];
        if (!selectedTemplate) {
            setSocketServiceQuery({ kind: 'socket' })
            setSubscriptionContext({ })
            setSubscriptionTarget({ kind: 'node', dn: 'root' })
            return;
        }
    
        setSocketServiceQuery(selectedTemplate.query);
        setSubscriptionContext(selectedTemplate.context ?? {});
        setSubscriptionTarget(selectedTemplate.target);
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

    return (
        <div data-testid="websocket-tool"
             className={styles.websocketTool}>
            <h2>Websocket Tool</h2>

            <SectionedContent
                sections={[
                    {
                        title: 'Template',
                        content: renderEndpointsTemplateSelector()
                    },
                    {
                        title: 'Socket Service Query',
                        content: <CodeControl syntax="json"
                                                value={socketServiceQuery}
                                                handleChange={(x) => setSocketServiceQuery(JSON.parse(x))}
                                                />
                    },
                    {
                        title: 'Subscription Context',
                        content: <CodeControl syntax="json"
                                                value={subscriptionContext}
                                                handleChange={(x) => setSubscriptionContext(JSON.parse(x))}
                                                />
                    },
                    {
                        title: 'Subscription Target',
                        content: <CodeControl syntax="json"
                                                value={subscriptionTarget}
                                                handleChange={(x) => setSubscriptionTarget(JSON.parse(x))}
                                                />
                    },
                    {
                        title: '',
                        content: 
                            <div className={styles.buttonsContainer}>
                                <Button type="success"
                                        onClick={handleSubscribe}>
                                    {currentService &&
                                        <>Resubscribe</>
                                    }
                                    {!currentService &&
                                        <>Subscribe</>
                                    }
                                </Button>
                                {currentService &&
                                    <Button type="danger"
                                            onClick={handleDisconnect}>
                                        Disconnect
                                    </Button> }
                                <Button type="ghost"
                                        onClick={handleClear}>
                                    Clear
                                </Button>

                            </div>
                    },
                    {
                        title: 'Socket Data',
                        content: 
                            <CodeControl syntax="json"
                                        value={subscriptionResults}
                                        />
                    },
                ]}
                />

        </div>
    );
}
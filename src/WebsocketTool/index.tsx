import React, { FC, useEffect } from 'react';
import useState from 'react-usestateref'
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
    const [subscriptionContext, setSubscriptionContext] = useState<any>({ });
    const [subscriptionTarget, setSubscriptionTarget] = useState<any>({ });

    const [contextHistory, setContextHistory] = useState<Record<string, any>>({ });
    const [targetHistory, setTargetHistory] = useState<Record<string, any>>({ });

    const [subscriptionResults, setSubscriptionResults, subscriptionResultsRef] = useState<any[]>([]);

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

            const context = subscriptionContext as Record<string, any>;
            {
                const newContextHistory = _.clone(contextHistory);
                for(const x of _.keys(context)) {
                    newContextHistory[x] = context[x];
                }
                setContextHistory(newContextHistory);
            }
            const target = subscriptionTarget as Record<string, any>;
            {
                const newTargetHistory = _.clone(targetHistory);
                for(const x of _.keys(target)) {
                    newTargetHistory[x] = target[x];
                }
                setTargetHistory(newTargetHistory);
            }

            const service = app.serviceRegistry.resolveService<IWebSocketService>(socketServiceQuery);
            service.updateContext(context);
            service.subscribe(target, (value: any) => {
                setSubscriptionResults(_.concat(_.clone(subscriptionResultsRef.current), value));
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
            setSubscriptionTarget({ })
            return;
        }
    
        setSocketServiceQuery(selectedTemplate.query);
        {
            const newContext = _.clone(selectedTemplate.context ?? {});
            for(const x of _.keys(newContext)) {
                const value = contextHistory[x];
                if (isValuePresent(value) && !isValuePresent(newContext[x])) {
                    newContext[x] = value;
                }
            }
            setSubscriptionContext(newContext);
        }
        {
            const newTarget = _.clone(selectedTemplate.target ?? {});
            for(const x of _.keys(newTarget)) {
                const value = targetHistory[x];
                if (isValuePresent(value) && !isValuePresent(newTarget[x])) {
                    newTarget[x] = value;
                }
            }
            setSubscriptionTarget(newTarget);
        }
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

function isValuePresent(value: any)
{
    if (_.isNullOrUndefined(value)) {
        return false;
    }
    if (_.isString(value)) {
        if (value.length === 0) {
            return false;
        }
    }
    return true;
}
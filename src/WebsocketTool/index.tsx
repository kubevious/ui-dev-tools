import React, { useEffect, useState } from "react"
import { app } from "@kubevious/ui-framework"

import _ from "the-lodash"

import "./styles.scss"

import { YamlControlBar } from "@kubevious/ui-components"
import { IWebSocketService } from "@kubevious/ui-middleware"

export const WebsocketTool = () => {
    const [serviceKind, setServiceKind] = useState<string>("socket")
    const [subscriptionResults, setSubscriptionResults] = useState<any>(null)

    const [subscriptionQuery, setSubscriptionQuery] = useState<Record<string, any> | string>({
        projectId: ""
    })
    const [subscriptionContext, setSubscriptionContext] = useState<Record<string, any> | string>({
        clusterId: "",
        snapshotId: "",
    })
    const [subscriptionTarget, setSubscriptionTarget] = useState<Record<string, any> | string>({
        kind: "node",
        dn: "root",
    })

    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)

    const strSubscriptionResults = JSON.stringify(subscriptionResults, null, 4)

    const parsingData = (data: string | {}): {} =>
        typeof data !== "string" ? data : JSON.parse(data)

    useEffect(() => {

        console.log("[WebSocketTool] subscriptionData: ", subscriptionData)

        if (!subscriptionData) {
            return;
        }

        if (!subscriptionData.kind) {
            return;
        }

        const svcInfo = _.clone(subscriptionData.query);
        svcInfo.kind = subscriptionData.kind;

        let service: IWebSocketService;

        try {
            service = app.serviceRegistry.resolveService<IWebSocketService>(svcInfo);

            service.updateContext(subscriptionData.context);

            service.subscribe(subscriptionData.target, (value) => {
                setSubscriptionResults(_.concat(subscriptionResults, value))
            })

        }
        catch (error) {
            app.sharedState.set("is_error", true)
            app.sharedState.set("error", error);
        }

        return () => {
            if (service) {
                service.close();
            }
        }

    }, [subscriptionData])

    const strSubscriptionQuery = formatDataToString(subscriptionQuery)
    const strSubscriptionTarget = formatDataToString(subscriptionTarget)
    const strSubscriptionContext = formatDataToString(subscriptionContext)

    const handleSubscribe = () => {
        setSubscriptionResults([])
        try {
            const data: SubscriptionData = {
                kind: serviceKind,
                query: parsingData(strSubscriptionQuery),
                context: parsingData(strSubscriptionContext),
                target: parsingData(strSubscriptionTarget)
            }

            setSubscriptionData(data);
        } catch (error) {
            app.sharedState.set("is_error", true)
            app.sharedState.set("error", error); // { message: _.toString(error), })
        }
    }

    return (
        <div data-testid="websocket-tool" className="websocket-tool">
            <h2>Websocket Tool</h2>
            <div className="ext-area-container">
                <div className="label-wrap">
                    <label className="field-label">Service Kind: </label>
                </div>
                <input
                    type="text"
                    className="field-input"
                    value={serviceKind}
                    onChange={(e) => setServiceKind(e.target.value)}
                />
            </div>
            <div className="text-area-container">
                <>
                    <div className="text-area-label">
                        Subscription Query:
                        </div>
                    <YamlControlBar
                        className={"subscription-text-area"}
                        value={strSubscriptionQuery}
                        text={strSubscriptionQuery}
                        beforeChange={({ value }) => setSubscriptionQuery(value)}
                        downloadButton
                    />
                </>
            </div>
            <div className="text-area-container">
                <>
                    <div className="text-area-label">
                        Subscription Context:
                        </div>
                    <YamlControlBar
                        className={"subscription-text-area"}
                        value={strSubscriptionContext}
                        text={strSubscriptionContext}
                        beforeChange={({ value }) => setSubscriptionContext(value)}
                        downloadButton
                    />
                </>
            </div>
            <div className="text-area-container">
                <>
                    <div className="text-area-label">
                        Subscription Target:
                        </div>
                    <YamlControlBar
                        className={"subscription-text-area"}
                        value={strSubscriptionTarget}
                        text={strSubscriptionTarget}
                        beforeChange={({ value }) => setSubscriptionTarget(value)}
                        downloadButton
                    />
                </>
            </div>
            <div className="subscription-button-container">
                <button onClick={() => handleSubscribe()} className="main-btn">Subscribe</button>
            </div>
            <div className="text-area-container">
                <>
                    <div className="text-area-label">Yaml Data:</div>
                    <YamlControlBar
                        value={strSubscriptionResults}
                        text={strSubscriptionResults}
                        downloadButton
                    />
                </>
            </div>
        </div>
    )
}

function formatDataToString(data: string | {}): string {
    return typeof data !== "string" ? JSON.stringify(data, null, 2) : data
}


interface SubscriptionData {
    kind: string,
    query: any,
    context: any,
    target: any
}
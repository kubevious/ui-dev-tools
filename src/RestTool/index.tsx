import React, { useEffect, useState } from "react"
import _ from "the-lodash"

import { EndpointInfo, ExpandedUserService, HttpParam } from "./types"
import { HttpMethod } from "@kubevious/ui-framework"

import "./styles.scss"

import { useService } from "@kubevious/ui-framework"
import { sharedState } from "@kubevious/ui-framework/dist/global"
import { YamlControlBar, CopyButton } from "@kubevious/ui-components/dist"

const isTesting = process.env.IS_TESTING;


export const RestTool = () => {
    const service = useService<ExpandedUserService>({ kind: "user" })

    const [editedRequestData, setEditedRequestData] = useState("{}")
    const [requestMethod, setRequestMethod] = useState(
        HttpMethod.GET.toString()
    )
    const [requestPath, setRequestPath] = useState("")
    const [endpoints, setEndpoints] = useState<EndpointInfo[]>([])
    const [requestParams, setRequestParams] = useState<HttpParam[]>([])
    const [paramsHistory, setParamsHistory] = useState<Record<string, string>>(
        {}
    )

    const [responseData, setResponseData] = useState("Response")
    const [responseCode, setResponseCode] = useState("")

    const [userData, setUserData] = useState("")
    const [accessToken, setAccessToken] = useState("")

    useEffect(() => {
        const endpointsFromState = sharedState.get('endpoints')

        const generatedEndpoints: (string | EndpointInfo[]) = _.map(endpointsFromState, (x) => {
            if (_.isString(x)) {
                return {
                    name: x,
                    method: HttpMethod.GET,
                }
            } else {
                return x
            }
        })

        setEndpoints(generatedEndpoints)
    }, [])


    const endpointsData: Record<string, EndpointInfo> = _.makeDict(
        endpoints,
        (x) => {
            return `${x.method} :: ${x.name}`
        },
        (x) => x
    )

    useEffect(() => {
        setAccessToken(service?.accessToken() || '')
        setUserData(service?.userData() || '')
    }, [service])

    const handleChangeRequest = ({ value }: { value: string }): void => {
        setEditedRequestData(value)
    }

    const handleChangeAccessToken = ({ value }: { value: string }): void => {
        setUserData(value)
    }

    const handleChangeResponse = ({ value }: { value: string }): void => {
        setResponseData(value)
    }

    const handleChangePath = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRequestPath(e.target.value)
    }

    const handleChangeRequestType = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setRequestMethod(e.target.value)
    }

    const handleSendRequest = async (): Promise<void> => {
        let params: Record<string, string> | undefined = undefined
        let data: Record<string, any> | undefined = undefined

        params = _.makeDict(
            requestParams,
            (x) => x.name,
            (x) => x.value
        )

        if (requestMethod !== HttpMethod.GET) {
            if (editedRequestData) {
                data = JSON.parse(editedRequestData)
            } else {
                data = {}
            }
        }

        const response = await service?.client.execute(
            requestMethod as HttpMethod,
            requestPath,
            params,
            data
        )
        if (response) {
            setResponseData(JSON.stringify(response.data, null, 2))
            if (response.status) {
                setResponseCode(response.status.toString())
            }
        }
    }

    const renderEndpointsTemplateSelector = () => {
        return (
            <select
                className="select"
                onChange={(e) => {
                    const selectedTemplate = endpointsData[e.target.value]
                    setRequestPath(selectedTemplate.name)
                    setRequestMethod(selectedTemplate.method.toString())
                    if (selectedTemplate.params) {
                        setRequestParams(
                            selectedTemplate.params.map((x) => {
                                return {
                                    name: x,
                                    value: paramsHistory[x] || "",
                                }
                            })
                        )
                    } else {
                        setRequestParams([])
                    }
                    if (selectedTemplate.sample) {
                        if (selectedTemplate.sample.body) {
                            setEditedRequestData(JSON.stringify(selectedTemplate.sample.body, null, 4))
                        }
                    }
                }}
            >
                <option value=""></option>
                {_.keys(endpointsData).map((endpoint, index) => (
                    <option key={index} value={endpoint}>
                        {endpoint}
                    </option>
                ))}
            </select>
        )
    }

    return (
        <>
            <div data-testid="rest-tool">
                <h2>REST Tool</h2>
                <div className="section">
                    <h3>Template</h3>
                    {renderEndpointsTemplateSelector()}
                </div>
                <div className="section">
                    <h3>Request</h3>

                    <div>
                        <label className="label">Method: </label>
                        <select
                            className="select"
                            onChange={(e) => handleChangeRequestType(e)}
                            value={requestMethod}
                        >
                            {_.keys(HttpMethod).map((method, index) => (
                                <option key={index} value={method.toString()}>
                                    {method}
                                </option>
                            ))}
                        </select>
                        <label className="label">Path: </label>
                        <input
                            type="text"
                            value={requestPath}
                            className="input path-input"
                            onChange={(e) => handleChangePath(e)}
                        />
                    </div>

                    {requestPath && (
                        <>
                            <div className="label">Params: </div>
                            {requestParams.map((param, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        value={param.name}
                                        className="path-input input"
                                        onChange={(e) => {
                                            param.name = e.target.value
                                            setRequestParams(
                                                _.clone(requestParams)
                                            )

                                            paramsHistory[param.name] =
                                                param.value
                                            setParamsHistory(
                                                _.clone(paramsHistory)
                                            )
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={param.value}
                                        className="path-input input"
                                        onChange={(e) => {
                                            param.value = e.target.value
                                            setRequestParams(
                                                _.clone(requestParams)
                                            )

                                            paramsHistory[param.name] =
                                                param.value
                                            setParamsHistory(
                                                _.clone(paramsHistory)
                                            )
                                        }}
                                    />
                                    <button
                                        className="main-btn"
                                        onClick={() => {
                                            requestParams.splice(index, 1)
                                            setRequestParams(
                                                _.clone(requestParams)
                                            )

                                            delete paramsHistory[param.name]
                                            setParamsHistory(
                                                _.clone(paramsHistory)
                                            )
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                            <button
                                className="main-btn"
                                onClick={() => {
                                    requestParams.push({
                                        name: "",
                                        value: "",
                                    })
                                    setRequestParams(_.clone(requestParams))
                                }}
                            >
                                Add
                            </button>
                        </>
                    )}
                    {!isTesting && <div className="text-area-container">
                        {requestMethod !== HttpMethod.GET && (
                            <>
                                <div className="text-area-label">
                                    Request Data:{" "}
                                </div>
                                <YamlControlBar
                                    value={editedRequestData}
                                    beforeChange={handleChangeRequest}
                                    text={editedRequestData}
                                    downloadButton
                                />
                            </>
                        )}
                        <div className="btn-wrapper">
                            <button
                                className="main-btn send"
                                onClick={() => handleSendRequest()}
                            >
                                SEND
                            </button>
                        </div>
                    </div>}
                </div>
                <div className="section">
                    <h3>Response</h3>
                    {!isTesting && <div className="text-area-container">
                        <div className="text-area-label">
                            Status Code: {responseCode}
                        </div>
                        <YamlControlBar
                            value={responseData}
                            beforeChange={handleChangeResponse}
                            text={responseData}
                            downloadButton
                        />
                    </div>}
                </div>
                <div className="section">
                    <h3>Auth Info</h3>
                    {!isTesting && <div className="text-area-container">
                        <div className="text-area-label">Info about user:</div>
                        <YamlControlBar
                            value={userData}
                            beforeChange={handleChangeAccessToken}
                            text={userData}
                            downloadButton
                        />
                        <div className="btn-wrapper">
                            <CopyButton
                                text={accessToken}
                                buttonText="COPY ACCESS TOKEN"
                            />
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

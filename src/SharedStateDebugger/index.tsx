import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework/dist';
import { YamlControlBar } from '@kubevious/ui-components/dist';

import './styles.scss';
import { SharedStateDebuggerState } from './types';

export class SharedStateDebugger extends ClassComponent<{}, SharedStateDebuggerState> {
    constructor(props: any) {
        super(props);

        this.state = {
            activeOption: '',
            sharedKeys: [],
        };
        this.handleSelectOption = this.handleSelectOption.bind(this);
        this.handleUpdateSharedStateField = this.handleUpdateSharedStateField.bind(this);
        this.handleDeleteSharedStateField = this.handleDeleteSharedStateField.bind(this);
        this.handleChangeSelectedSharedStateElement = this.handleChangeSelectedSharedStateElement.bind(this);
        this.getYamlValue = this.getYamlValue.bind(this);
    }

    componentDidMount() {
        this.setState({ sharedKeys: this.sharedState.keys });

        if (!this.state.activeOption) {
            this.setState({ selectedSharedStateElement: undefined });
            return;
        }
    }

    handleSelectOption(option: string): void {
        this.setState({ activeOption: option });
        const newValue = this.sharedState.get(option);
        this.setState({ selectedSharedStateElement: newValue });
    }

    handleUpdateSharedStateField(): void {
        try {
            if (this.state.activeOption) {
                this.sharedState.set(this.state.activeOption, this.state.selectedSharedStateElement);
            }
        } catch (error) {
            this.sharedState.set('is_error', true);
            this.sharedState.set('error', error);
        }
        this.setState({ sharedKeys: this.sharedState.keys });
    }

    handleDeleteSharedStateField(): void {
        if (this.state.activeOption) {
            this.sharedState.set(this.state.activeOption, null);
        }
        this.setState({ activeOption: '' });
        this.setState({ sharedKeys: this.sharedState.keys });
    }

    handleChangeSelectedSharedStateElement({ value }: { value: string }): void {
        this.setState({ selectedSharedStateElement: value });
    }

    getYamlValue(): string {
        const { selectedSharedStateElement } = this.state;
        switch (typeof selectedSharedStateElement) {
            case 'boolean':
                return selectedSharedStateElement.toString();
            case 'object':
                return JSON.stringify(selectedSharedStateElement, null, 2);
            case 'number':
                return selectedSharedStateElement.toString();
            default:
                return selectedSharedStateElement;
        }
    }

    render() {
        const yamlValue = this.getYamlValue();
        const { sharedKeys, activeOption } = this.state;
        return (
            <div data-testid="shared-state-debugger" className="shared-state-debugger">
                <h2 className="header">Shared State Debugger</h2>
                <div className="debugger-container">
                    <div className="multi-select-wrapper">
                        <select className="multi-select" multiple>
                            {sharedKeys.map((field, index) => {
                                return (
                                    <option
                                        key={index}
                                        onClick={() => this.handleSelectOption(field)}
                                        className={`option ${activeOption === field ? 'active' : ''}`}
                                    >
                                        {field}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="debugger-wrapper">
                        <input value={activeOption} className="shared-state-input" disabled={true} />
                        <div className="text-area-container">
                            <>
                                <div className="text-area-label">Field value: </div>
                                <YamlControlBar
                                    beforeChange={this.handleChangeSelectedSharedStateElement}
                                    text={yamlValue}
                                    downloadButton
                                    value={yamlValue}
                                />
                            </>
                            <div className="button-container">
                                <button className="main-btn" onClick={this.handleUpdateSharedStateField}>
                                    Update
                                </button>
                                <button className="main-btn" onClick={this.handleDeleteSharedStateField}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
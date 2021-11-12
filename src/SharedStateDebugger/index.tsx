import _ from 'the-lodash';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { CodeControl } from '@kubevious/ui-components';

import styles from './styles.module.css';
import { SharedStateDebuggerState } from './types';

import cx from 'classnames';

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
        this.setState({ sharedKeys: _.orderBy(this.sharedState.keys, x => x) });

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

    handleChangeSelectedSharedStateElement(value: string): void {
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
            <div data-testid="shared-state-debugger" className={`${styles.sharedStateDebugger} text-white`}>
                <h2>Shared State Debugger</h2>
                <div className={styles.debuggerContainer}>
                    <div className={styles.multiSelectWrapper}>
                        <select className={styles.multiSelect} multiple>
                            {sharedKeys.map((field, index) => (
                                <option
                                    key={index}
                                    onClick={() => this.handleSelectOption(field)}
                                    className={cx(styles.option, { [styles.active]: activeOption === field })}
                                >
                                    {field}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.debuggerWrapper}>
                        <input value={activeOption} className={styles.sharedStateInput} disabled={true} />
                        <div className={styles.textAreaContainer}>
                            <div className="mt-2">Field value: </div>
                            <CodeControl syntax="yaml"
                                         value={yamlValue}
                                         handleChange={this.handleChangeSelectedSharedStateElement}
                                         showDownloadButton
                                         showCopyButton />

                            <div className={styles.buttonContainer}>
                                <button className="btn btn-outline-success" onClick={this.handleUpdateSharedStateField}>
                                    Update
                                </button>
                                <button className="btn btn-outline-success" onClick={this.handleDeleteSharedStateField}>
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

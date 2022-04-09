import _ from 'the-lodash';
import React, { FC, useState } from 'react';
import { Button, CodeControl, Input, ItemList, ScrollbarComponent, Select } from '@kubevious/ui-components';

import styles from './styles.module.css';

import { useSharedState } from '@kubevious/ui-framework';

export const SharedStateDebugger : FC = () => {

    const [keys, setKeys] = useState<string[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const [keyName, setKeyName] = useState<string>('');
    const [keyType, setKeyType] = useState<SelectOption>(KEY_TYPE_STRING);
    const [keyValue, setKeyValue] = useState<any>('');

    const sharedState = useSharedState((ss) => {

        ss.onChange(() => {
            setKeys(ss.keys);
        });

    });

    const activateKey = (key: string) => {
        setSelectedKey(key);
        setKeyName(key);

        let value = sharedState?.tryGet(key);

        if (_.isBoolean(value)) {
            setKeyType(KEY_TYPE_BOOLEAN);
        } else if (_.isString(value)) {
            setKeyType(KEY_TYPE_STRING);
        } else if (_.isNumber(value)) {
            setKeyType(KEY_TYPE_NUMBER);
        } else if (_.isDate(value)) {
            value = value.toISOString();
            setKeyType(KEY_TYPE_DATE);
        } else if (_.isObject(value)) {
            setKeyType(KEY_TYPE_JSON);
        } else {
            setKeyType(KEY_TYPE_STRING);
        }

        setKeyValue(value);
    }

    const updateValue = () => {

        let newValue : any = null;

        if (keyType === KEY_TYPE_STRING)
        {
            newValue = keyValue as string;
        }
        else if (keyType === KEY_TYPE_DATE)
        {
            newValue = new Date(keyValue as string);
        }
        else if (keyType === KEY_TYPE_NUMBER)
        {
            newValue = parseInt(keyValue as string);
        }
        else if (keyType === KEY_TYPE_BOOLEAN)
        {
            newValue = (keyValue == 'true');
        }
        else if (keyType === KEY_TYPE_JSON)
        {
            newValue = JSON.parse(keyValue);
        }

        sharedState!.set(keyName, newValue);

        activateKey(keyName);
    }

    const deleteValue = () => {
        if (keyName) {
            sharedState!.set(keyName, null);
        }

        reset();
    }

    const reset = () => {
        setSelectedKey(null);
        setKeyName('');
        setKeyType(KEY_TYPE_STRING);
        setKeyValue('');
    }

    return (
        <div data-testid="shared-state-debugger"
              className={styles.sharedStateDebugger}>

            <h2>Shared State Debugger</h2>
            <div className={styles.debuggerContainer}>

                <div className={styles.keysListContainer}>
                    <ItemList items={keys.map(x => ({ key: x, text: x }))} 
                              selectedItem={selectedKey ? { key : selectedKey} : null}
                              onSelectItemChange={(x) => {
                                  activateKey(x!.key);
                              }}
                              />
                </div>

                <div className={styles.keysEditorContainer}>

                    <div className={styles.editorNameWrapper}>
                        <Input  value={keyName}
                                containerClassName={styles.pathInput}
                                onChange={(e) => setKeyName(e.target.value)}
                            />
                    </div>

                    <div className={styles.editorNameWrapper}>
                        <Select options={KEY_TYPE_LIST}
                                onChange={(props: any) => {
                                    setKeyType(_.find(KEY_TYPE_LIST, x => x.value === props.value)!)
                                }}
                                value={keyType}
                                placeholder="Value Type"
                                />
                    </div>

                    <div className={styles.editorValueWrapper}>
                        <ScrollbarComponent>
                            <CodeControl syntax="json"
                                         value={keyValue}
                                         handleChange={setKeyValue}
                                         showDownloadButton
                                         showCopyButton />
                        </ScrollbarComponent>                                
                    </div>

                    <div className={styles.editorButtonsWrapper}>
                        <Button type="success"
                                onClick={updateValue}
                            >
                            Update
                        </Button>

                        <Button type="danger"
                                onClick={deleteValue}
                            >
                            Delete
                        </Button>
                    </div>

                </div>

            </div>
        </div>
    );

// export class SharedStateDebugger : FC = () => {
//     constructor(props: any) {
//         super(props);

//         this.state = {
//             activeOption: '',
//             sharedKeys: [],
//         };
//         this.handleSelectOption = this.handleSelectOption.bind(this);
//         this.handleUpdateSharedStateField = this.handleUpdateSharedStateField.bind(this);
//         this.handleDeleteSharedStateField = this.handleDeleteSharedStateField.bind(this);
//         this.handleChangeSelectedSharedStateElement = this.handleChangeSelectedSharedStateElement.bind(this);
//         this.getYamlValue = this.getYamlValue.bind(this);
//     }

//     componentDidMount() {
//         this.setState({ sharedKeys: _.orderBy(this.sharedState.keys, x => x) });

//         if (!this.state.activeOption) {
//             this.setState({ selectedSharedStateElement: undefined });
//             return;
//         }
//     }

//     handleSelectOption(option: string): void {
//         this.setState({ activeOption: option });
//         const newValue = this.sharedState.tryGet(option);
//         this.setState({ selectedSharedStateElement: newValue });
//     }

//     handleUpdateSharedStateField(): void {
//         try {
//             if (this.state.activeOption) {
//                 this.sharedState.set(this.state.activeOption, this.state.selectedSharedStateElement);
//             }
//         } catch (error) {
//             this.sharedState.set('is_error', true);
//             this.sharedState.set('error', error);
//         }
//         this.setState({ sharedKeys: this.sharedState.keys });
//     }

//     handleDeleteSharedStateField(): void {
//         if (this.state.activeOption) {
//             this.sharedState.set(this.state.activeOption, null);
//         }
//         this.setState({ activeOption: '' });
//         this.setState({ sharedKeys: this.sharedState.keys });
//     }

//     handleChangeSelectedSharedStateElement(value: string): void {
//         this.setState({ selectedSharedStateElement: value });
//     }

//     getYamlValue(): string {
//         const { selectedSharedStateElement } = this.state;

//         switch (typeof selectedSharedStateElement) {
//             case 'boolean':
//                 return selectedSharedStateElement.toString();
//             case 'object':
//                 return JSON.stringify(selectedSharedStateElement, null, 2);
//             case 'number':
//                 return selectedSharedStateElement.toString();
//             default:
//                 return selectedSharedStateElement;
//         }
//     }

//     render() {
//         const yamlValue = this.getYamlValue();
//         const { sharedKeys, activeOption } = this.state;

//         return (
//             <div data-testid="shared-state-debugger" className={`${styles.sharedStateDebugger} text-white`}>
//                 <h2>Shared State Debugger</h2>
//                 <div className={styles.debuggerContainer}>
//                     <div className={styles.multiSelectWrapper}>
//                         <select className={styles.multiSelect} multiple>
//                             {sharedKeys.map((field, index) => (
//                                 <option
//                                     key={index}
//                                     onClick={() => this.handleSelectOption(field)}
//                                     className={cx(styles.option, { [styles.active]: activeOption === field })}
//                                 >
//                                     {field}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className={styles.debuggerWrapper}>
//                         <input value={activeOption} className={styles.sharedStateInput} disabled={true} />
//                         <div className={styles.textAreaContainer}>
//                             <div className="mt-2">Field value: </div>
//                             <CodeControl syntax="yaml"
//                                          value={yamlValue}
//                                          handleChange={this.handleChangeSelectedSharedStateElement}
//                                          showDownloadButton
//                                          showCopyButton />

//                             <div className={styles.buttonContainer}>
//                                 <button className="btn btn-outline-success" onClick={this.handleUpdateSharedStateField}>
//                                     Update
//                                 </button>
//                                 <button className="btn btn-outline-success" onClick={this.handleDeleteSharedStateField}>
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
}


interface SelectOption
{
    label: string;
    value: string;
}
const KEY_TYPE_STRING : SelectOption = { label: 'STRING', value: 'STRING' };
const KEY_TYPE_BOOLEAN : SelectOption = { label: 'BOOLEAN', value: 'BOOLEAN' };
const KEY_TYPE_NUMBER : SelectOption = { label: 'NUMBER', value: 'NUMBER' };
const KEY_TYPE_DATE : SelectOption = { label: 'DATE', value: 'DATE' };
const KEY_TYPE_JSON : SelectOption = { label: 'JSON', value: 'JSON' };


const KEY_TYPE_LIST = [
    KEY_TYPE_STRING,
    KEY_TYPE_BOOLEAN,
    KEY_TYPE_NUMBER,
    KEY_TYPE_JSON,
    KEY_TYPE_DATE
]
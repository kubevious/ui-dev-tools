import { HttpClient } from "@kubevious/http-client"
import { IDeveloperService } from '@kubevious/ui-middleware';

export class DeveloperService implements IDeveloperService {

    private _client : HttpClient;
    
    constructor()
    {
        this._client = new HttpClient();
    }

    get client() 
    {
        return this._client;
    }

    extractExtras() 
    {
        const data : Record<string, any> = {
            'string-field': 'foo-bar',
            'json-field': {
                'foo': 'bar'
            }
        };

        return Promise.resolve(data);
    }


    close() {

    }
}
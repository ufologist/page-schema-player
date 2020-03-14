import * as React from 'react';
import {
    render
} from 'react-dom';

import App from './app/App';

(self as any).MonacoEnvironment = {
    getWorkerUrl: function (moduleId:any, label:string) {
        if (label === 'json') {
            return '/json.worker.bundle.js';
        }
        if (label === 'css') {
            return '/css.worker.bundle.js';
        }
        if (label === 'html') {
            return '/html.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return '/ts.worker.bundle.js';
        }
        return '/editor.worker.bundle.js';
    }
}

export function bootstrap(mountTo:Element) {
    render(<App />, mountTo);
}

bootstrap(document.querySelector('.js-app')!);
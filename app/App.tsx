import * as React from 'react';
import {
    ToastComponent,
    AlertComponent
} from 'amis';
import QsMan from 'qsman';

import '../utils/polyfill';

// css
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'amis/lib/themes/default.css';
import 'react-datetime/css/react-datetime.css';
import 'cropperjs/dist/cropper.css';

import './theme.less';
import AMisRenderer from './AMisRenderer';
import InfoPageSchema from './info-page-schema';
import loadSchema from './load-schema';

// AMIS 自定义组件
import '../amis-components/Demo';

interface AppState {
    schema: any
}

var qsParams = new QsMan(window.location.search).getObject();

export default class App extends React.Component {
    state:AppState = {
        schema: new InfoPageSchema('正在加载页面配置')
    };

    constructor(props:any) {
        super(props);
    }

    componentWillMount() {
        this.loadSchema();
    }

    loadSchema() {
        if (qsParams.schema) {
            loadSchema(qsParams.schema).then((schema) => {
                this.setState({
                    schema: schema
                });
            });
        } else {
            this.setState({
                schema: new InfoPageSchema('URL 中必须传入 schema 参数')
            });
        }
    }

    render() {
        return (
            <div>
                <ToastComponent key="toast" position="top-center" />
                <AlertComponent key="alert" />
                <AMisRenderer schema={this.state.schema} />
            </div>
        );
    }
}
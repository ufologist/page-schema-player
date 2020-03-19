import * as React from 'react';
import {
    Route,
    Switch,
    BrowserRouter as Router
} from "react-router-dom";
import {
    ToastComponent,
    AlertComponent
} from 'amis';
import QsMan from 'qsman';

// css
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'amis/lib/themes/default.css';
import 'react-datetime/css/react-datetime.css';
import 'cropperjs/dist/cropper.css';
import 'video-react/dist/video-react.css';

import './polyfill';
import AMisRenderer from './AMisRenderer';
import InfoPageSchema from './info-page-schema';
import loadSchema from './load-schema';

// 扩展
// 主题
import '../ext/theme.less';
// 验证规则
import '../ext/validations';
// 覆盖渲染器的默认值
import '../ext/renderer-defaults';
// AMIS 自定义组件
import '../ext/amis-components/Demo';
// 获取默认的环境模式
import getDefaultMode from '../ext/get-default-mode';

interface AppState {
    schema: any
}

var qsParam = new QsMan(window.location.search).getObject();
// 自动识别环境模式
if (!qsParam._mode) {
    qsParam._mode = getDefaultMode();
}

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
        if (qsParam._schema) {
            loadSchema(qsParam._schema).then((schema) => {
                // @ts-ignore
                if (schema.title) {
                    // @ts-ignore
                    document.title = schema.title;
                }

                this.setState({
                    schema: schema
                });
            });
        } else {
            this.setState({
                schema: new InfoPageSchema('没有提供页面的配置', 'URL 中必须传入<code>_schema</code>参数, 以指定页面的配置')
            });
        }
    }

    render() {
        var schema = this.state.schema;
        var env = schema.definitions?.env?.[qsParam._mode] || {};

        return (
            <Router>
                <div>
                    <ToastComponent key="toast" position="top-center" />
                    <AlertComponent key="alert" />
                    <Switch>
                        <Route path="/" render={(props) => {
                            return (
                                <AMisRenderer {...props} 
                                              schema={schema}
                                              data={{
                                                  _qsParam: qsParam,
                                                  _definitions: schema.definitions,
                                                  _env: env
                                              }} />
                            );
                        }} />
                    </Switch>
                </div>
            </Router>
        );
    }
}
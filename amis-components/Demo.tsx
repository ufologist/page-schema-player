import * as React from 'react';
import {
    FormItem
} from 'amis';

interface DemoProps {
    value: any;
    onChange: Function
}

/**
 * 自定义组件示例
 * 
 * @see https://baidu.github.io/amis/docs/dev
 */
@FormItem({
    type: 'demo'
})
export default class Demo extends React.Component<DemoProps> {
    toggle = () => {
        const {value, onChange} = this.props;

        onChange(!value);
    };

    render() {
        const {value} = this.props;
        const checked = !!value;

        return (
            <div>
                <a className="btn btn-default" onClick={this.toggle}>
                    {checked ? '已勾选' : '请勾选'}
                </a>
                <div className="inline m-l-xs">{checked ? '已勾选' : '请勾选'}</div>
            </div>
        );
    }
}
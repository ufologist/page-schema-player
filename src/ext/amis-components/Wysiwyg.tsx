import * as React from 'react';
import ReactUeditor from 'ifanrx-react-ueditor';

import {
    FormItem
} from 'amis';

interface WysiwygProps {
    value: any;
    disabled: boolean;
    onChange: Function;

    ueditorOptions: any;
}

/**
 * 富文本编辑器
 * 
 * @see https://github.com/baidu/amis/blob/d5ef332151e4ec44e7ffbfdb172d12ff93049248/src/renderers/Form/RichText.tsx
 */
@FormItem({
    type: 'ext-wysiwyg',
})
export default class Wysiwyg extends React.Component<WysiwygProps> {
    static defaultUeditorConfig = {
        initialFrameWidth: '100%',
        initialFrameHeight: 320,
        autoHeightEnabled: false,

        // 防止默认会加载一个 config 接口
        serverUrl: '/page-schema-player/ueditor/1.4.3.3/themes/default/images/spacer.gif',

        // http://fex.baidu.com/ueditor/#server-config
        // 不使用 imageActionName 通过 getActionUrl 方法来拼出最终的上传图片接口
        // 需要修改 ueditor/dialogs/image/image.js
        // 还需要调整 dialog.onok 中 uploadImage.getInsertList 的逻辑
        _imageUploadUrl: '/api/upload',
        imageActionName: ' ',
        imageFieldName: 'file',
        imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
        imageUrlPrefix: '',

        // 调整 ueditor/dialogs/scrawl/scrawl.js 的逻辑
        _scrawlUploadUrl: '/api/upload',
        scrawlFieldName: 'file',
        scrawlUrlPrefix: '',

        // 上传视频的处理方式同上传图片
        // 修改 ueditor/dialogs/video/video.js
        _videoUploadUrl: '/api/upload',
        videoActionName: ' ',
        videoUrlPrefix: '',
        videoFieldName: 'file',
        videoAllowFiles: [
            '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg', '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid'
        ],

        // 上传附件的处理方式同上传图片
        // 修改 ueditor/dialogs/attachment/attachment.js
        _fileUploadUrl: '/api/upload',
        fileActionName: ' ',
        fileUrlPrefix: '',
        fileFieldName: 'file',
        fileAllowFiles: [
            '.png', '.jpg', '.jpeg', '.gif', '.bmp',
            '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
            '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid',
            '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso',
            '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml'
        ]
    };

    editor = null;

    getEditor = (ref) => {
        this.editor = ref;
    }

    handleReady = () => {
        // @ts-ignore
        // 不直接使用 ReactUeditor 的 onChange
        // 因为只要执行 onChange 来改变 form 表单项的值, 就会让编辑器的焦点回到初始位置(0,0)
        // https://github.com/fex-team/ueditor/blob/089c7dee81cf06bf68a4ff6a362a7dcf4511d78b/_src/core/Editor.js#L541
        this.editor.window.addEventListener('blur', () => {
            // @ts-ignore
            // https://github.com/ifanrx/react-ueditor/blob/4cac4294c8b1f193b8b3c90b58c080f28a68cd29/src/ReactUeditor.js#L354
            this.updateEditorContent(this.editor.getContent());
        });
    }

    updateEditorContent = (content) => {
        const {
            onChange
        } = this.props;
        onChange(content);
    }

    render() {
        const {
            value,
            disabled
        } = this.props;

        // https://github.com/ifanrx/react-ueditor/blob/4cac4294c8b1f193b8b3c90b58c080f28a68cd29/src/ReactUeditor.js#L56
        var ueditorOptions = this.props.ueditorOptions || {};
        ueditorOptions = {
            // 由于 ueditor 的一些弹窗(例如上传图片)是通过 iframe 载入的, 需要设置为同域以跨域调用
            // 可以通过修改 dialogs/internal.js 设置 window.document.domain 为主页面同根域名
            // 例如当前页面设置为
            // window.document.domain = 'test.com';
            // 那么 dialogs/internal.js 中也设置为
            // window.document.domain = 'test.com';
            ueditorPath: '/page-schema-player/ueditor/1.4.3.3',
            config: {},
            ...ueditorOptions,

            getRef: this.getEditor,
            onReady: this.handleReady
        };

        // ueditor完整配置项
        // https://github.com/fex-team/ueditor/blob/089c7dee81cf06bf68a4ff6a362a7dcf4511d78b/ueditor.config.js
        ueditorOptions.config = {
            ...Wysiwyg.defaultUeditorConfig,
            ...ueditorOptions.config,
            readonly: disabled
        };

        if (this.editor) {
            if (disabled) {
                // @ts-ignore
                this.editor.setDisabled();
            } else {
                // @ts-ignore
                this.editor.setEnabled();
            }
        }

        return (
            <ReactUeditor value={value} {...ueditorOptions} />
        );
    }
}
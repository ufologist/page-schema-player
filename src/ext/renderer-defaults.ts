// 覆盖 AMIS 的默认值
import {
    SelectControlRenderer
} from 'amis/lib/renderers/Form/Select';
import {
    TextControlRenderer
} from 'amis/lib/renderers/Form/Text';

SelectControlRenderer.defaultProps.clearable = true;
SelectControlRenderer.defaultProps.searchable = true;
TextControlRenderer.defaultProps.clearable = true;
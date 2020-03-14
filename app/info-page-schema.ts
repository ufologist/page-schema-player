/**
 * 构造提示页的 schema
 */
export default class InfoPageSchema {
    type:string = 'page';
    title:string = '';
    subTitle:string = '';
    remark:string = '';
    body:string = '';

    constructor(message:string, tip:string = '', detail:string = '', body:string = '') {
        this.title = message;
        this.subTitle = tip;
        this.remark = detail;
        this.body = body;
    }
}
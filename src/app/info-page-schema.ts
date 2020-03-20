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

        if (body) {
            this.body = body;
        } else {
            this.body = `
                <div class="text-center" style="margin-top: 100px;">
                    <i class="text-danger fa fa-exclamation-circle" style="font-size: 10em;"></i>
                    <p style="margin-top: 16px;font-weight: 700;font-size: 22px;">${message}</p>
                </div>
            `;
        }
    }
}
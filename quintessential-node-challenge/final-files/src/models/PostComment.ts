export class PostComment {

    // define required fields
    public static required_fields: string[] = [
        'post_id',
        'user_id',
        'comment',
    ];


    // define the fields that will be used to create the sql query string
    public static database_query_fields: string[] = [
        'comment_id',
        'post_id',
        'user_id',
        'comment',
    ];


    comment_id?: string;
    post_id: string;
    user_id: string;
    comment: string;
    created_at?: string | Date;
    updated_at?: string | Date;

    constructor(props?: PostComment) {
        this.comment_id = props?.comment_id || null;
        this.post_id = props?.post_id || null;
        this.user_id = props?.user_id || null;
        this.comment = props?.comment || null;
        this.created_at = props?.created_at || null;
        this.updated_at = props?.updated_at || null;
    }

}

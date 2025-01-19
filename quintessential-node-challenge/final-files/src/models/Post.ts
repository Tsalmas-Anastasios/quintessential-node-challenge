import { PostComment } from './PostComment';

export class Post {

    // define required fields
    public static required_fields: string[] = [
        'title',
        'graphic_url',
        'description',
        'likes'
    ];


    // define the fields that will be used to create the sql query string
    public static database_query_fields: string[] = [
        'post_id',
        'user_id',
        'title',
        'graphic_url',
        'description',
        'likes',
    ];


    post_id?: string;
    user_id: string;
    title: string;
    graphic_url: string;
    description: string;
    likes: number;
    created_at?: string | Date;
    updated_at?: string | Date;


    comments?: PostComment[];

    constructor(props?: Post) {
        this.post_id = props?.post_id || null;
        this.user_id = props?.user_id || null;
        this.title = props?.title || null;
        this.graphic_url = props?.graphic_url || null;
        this.description = props?.description || null;
        this.likes = props?.likes || null;
        this.created_at = props?.created_at || null;
        this.updated_at = props?.updated_at || null;


        this.comments = props?.comments || [];
    }

}

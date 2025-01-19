export class User {

    // define required fields
    public static required_fields: string[] = [
        'first_name',
        'last_name',
        'username',
        'email',
        'phone'
    ];


    // define the fields that will be used to create the sql query string
    public static database_query_fields: string[] = [
        'user_id',
        'first_name',
        'last_name',
        'username',
        'email',
        'phone',
        'password',
        'profile_pic_url',
        'activated',
        'request_password_change'
    ];

    user_id?: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    password?: string;
    profile_pic_url?: string;
    activated?: boolean;
    request_password_change?: boolean;

    created_at?: string | Date;
    updated_at?: string | Date;


    constructor(props?: User) {

        this.user_id = props?.user_id || null;
        this.first_name = props?.first_name || null;
        this.last_name = props?.last_name || null;
        this.username = props?.username || null;
        this.email = props?.email || null;
        this.phone = props?.phone || null;
        this.password = props?.password || null;
        this.profile_pic_url = props?.profile_pic_url || null;
        this.activated = props?.activated ? true : false;
        this.request_password_change = props?.request_password_change ? true : false;

        this.created_at = props?.created_at || null;
        this.updated_at = props?.updated_at || null;

    }

}

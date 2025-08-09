import base_model from '#models/base_model';

export default class users extends base_model {

    constructor(app) {
        super(app);
    }

    table = "users";

    primary_key = "id";

    allowed_fields = [
        'referral_user_id','name','username','email','group','phone','photo','password','api_key','status','created_by','updated_by','deleted_by',
    ];

    use_soft_delete = true;

    use_timestamp = true;
    createdField = "created_at";
    updatedField = "updated_at";
    deletedField = "deleted_at";

}
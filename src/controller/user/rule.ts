export const rule_enter = {
    room_info: {
        type: 'object',
        required: true, //经过测试,只要开启required,该字段必须存在且有值,不能是空字符串或者null
        fields: {
            room_No: { type: 'string', required: true },
            room_password: {
                type: 'string',
            },
        },
    },
    user_info: {
        type: 'object',
        required: true,
        fields: {
            user_id: { type: 'string', required: true },
            user_name: {
                type: 'string',
                required: true,
            },
        },
    },
}

export const rule_create = {
    room_info: {
        type: 'object',
        required: true, //经过测试,只要开启required,该字段必须存在且有值,不能是空字符串或者null
        fields: {
            room_No: { type: 'string' },
            room_password: {
                type: 'string',
            },
        },
    },
    user_info: {
        type: 'object',
        required: true,
        fields: {
            user_id: { type: 'string', required: true },
            user_name: {
                type: 'string',
                required: true,
            },
        },
    },
}
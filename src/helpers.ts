export function validate(fields: string[], form: object) {
    if (!form || Object.keys(form).length < 1) {
        return false;
    }

    for (const key of fields) {
        if (!form[key as keyof typeof form]) return false;
    }

    for (const key in form) {
        if (!fields.includes(key)) return false;
    }

    return true;
}

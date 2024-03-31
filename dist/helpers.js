export function validate(fields, form) {
    if (!form || Object.keys(form).length < 1) {
        return false;
    }
    for (const key of fields) {
        if (!form[key])
            return false;
    }
    for (const key in form) {
        if (!fields.includes(key))
            return false;
    }
    return true;
}
//# sourceMappingURL=helpers.js.map
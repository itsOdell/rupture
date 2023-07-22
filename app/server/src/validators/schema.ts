/* eslint-disable no-useless-escape */
export function emailValidator(email: string): boolean {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

export function websiteValidator(website: string): boolean {
    if (website !== "") {
        const websiteRegex =
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        return websiteRegex.test(website);
    }

    // Allows emty values
    return true;
}

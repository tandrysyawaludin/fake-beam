export function titleCase(string: string) {
    const str = string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
    return str;
}
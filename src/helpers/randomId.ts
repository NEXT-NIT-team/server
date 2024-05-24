const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default (length: number = 5): string => {
    let result = '';
    let counter = 0;

    while (counter < length) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      counter += 1;
    }

    return result;
}

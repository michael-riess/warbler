export function className(...args: (string | boolean)[]) {
    return args.filter(Boolean).join(' ');
}

export declare type InternalSignFunctionDoNotUseMe = (value: string, secret: string) => Promise<string>;
export declare type InternalUnsignFunctionDoNotUseMe = (cookie: string, secret: string) => Promise<string | false>;
declare global {
    var sign: InternalSignFunctionDoNotUseMe;
    var unsign: InternalUnsignFunctionDoNotUseMe;
}

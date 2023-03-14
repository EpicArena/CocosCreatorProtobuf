// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.

export = pb;

declare namespace pb {


    interface IPlayerInfo {
        id?: (number|null);
        name?: (string|null);
        money?: (Long|null);
    }

    class PlayerInfo implements IPlayerInfo {
        constructor(p?: IPlayerInfo);
        public id: number;
        public name: string;
        public money: Long;
        public static create(properties?: IPlayerInfo): PlayerInfo;
        public static encode(m: PlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
        public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PlayerInfo;
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

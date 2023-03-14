/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal.js";
import Long from 'long';
$protobuf.default.util.Long = Long;
$protobuf.default.configure();

const $Reader = $protobuf.default.Reader, $Writer = $protobuf.default.Writer, $util = $protobuf.default.util;

const $root = {};

export const PlayerInfo = $root.PlayerInfo = (() => {

    function PlayerInfo(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    PlayerInfo.prototype.id = 0;
    PlayerInfo.prototype.name = "";
    PlayerInfo.prototype.money = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    PlayerInfo.create = function create(properties) {
        return new PlayerInfo(properties);
    };

    PlayerInfo.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        if (m.id != null && Object.hasOwnProperty.call(m, "id"))
            w.uint32(8).uint32(m.id);
        if (m.name != null && Object.hasOwnProperty.call(m, "name"))
            w.uint32(18).string(m.name);
        if (m.money != null && Object.hasOwnProperty.call(m, "money"))
            w.uint32(24).uint64(m.money);
        return w;
    };

    PlayerInfo.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PlayerInfo();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1: {
                    m.id = r.uint32();
                    break;
                }
            case 2: {
                    m.name = r.string();
                    break;
                }
            case 3: {
                    m.money = r.uint64();
                    break;
                }
            default:
                r.skipType(t & 7);
                break;
            }
        }
        return m;
    };

    PlayerInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PlayerInfo";
    };

    return PlayerInfo;
})();

export { $root as default };

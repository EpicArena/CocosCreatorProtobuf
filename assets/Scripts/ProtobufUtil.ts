import { Writer } from 'protobufjs/minimal';
import { Message } from 'protobufjs';
import pb from 'pb';

export namespace ProtobufUtil {
    let pbToName: Map<Function, string> = new Map<Function, string>();
    export function InitAllPb(): void {
        // 初始化一次即可
        pbToName.clear();
        for (let messageName in pb) {
            // 排除enum
            if (typeof pb[messageName] == "function") {
                // if (pbToName.has(pb[messageName])) {
                //     console.error(`repeated pb: ${messageName}, ${pbToName.get(pb[messageName])}`);
                // }
                pbToName.set(pb[messageName], messageName);
            }
        }
    }

    export function GetPbNameByPb(pb: Function | Object): string {
        let messageName: string = pbToName.get(typeof pb == "object" ? pb.constructor : pb);
        if (messageName == undefined) {
            return "";
        }
        return messageName;
    }

    export function GetPbTypeByName(name: string): any {
        let paths = name.split('.');
        let current = pb;

        for (let i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

    export function PbEncode(message: any): Uint8Array {
        let writer = message.constructor.encode(message) as Writer;
        return writer?.finish();
    }

    export function PbDecode<T extends Message>(name: string, arr: Uint8Array): T {
        try {
            let pbType = GetPbTypeByName(name);
            return pbType.decode(arr);
        } catch (e) {
            console.error(`pb decode error, name: ${name}, error: ${e}`);
        }
    }

    export function ClonePb<T>(obj: T | T[]): T | T[] {
        if (typeof obj !== "object" || !obj) return obj;
        let cpy: T;
        if (Array.isArray(obj) || ArrayBuffer.isView(obj)) {
            let len = (obj as T[]).length;
            cpy = new obj.constructor(len);
            for (var i = 0; i < len; ++i) {
                cpy[i] = ClonePb(obj[i]);
            }
        } else {
            cpy = Object.create(obj.constructor.prototype);
            cpy.constructor = obj.constructor;
            for (var i = 0, keys = Object.keys(obj), len = keys.length; i < len; ++i) {
                cpy[keys[i]] = ClonePb(obj[keys[i]]);
            }
        }
        return cpy;
    }
}

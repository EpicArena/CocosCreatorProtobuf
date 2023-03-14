import { _decorator, Component, Node } from 'cc';
import { PlayerInfo } from 'pb';
import { ProtobufUtil } from './ProtobufUtil';
import Long from 'long';
const { ccclass, property } = _decorator;

@ccclass('ProtobufTest')
export class ProtobufTest extends Component {
    onLoad() {
        ProtobufUtil.InitAllPb();
    }

    start() {
        let message: PlayerInfo = PlayerInfo.create();
        message.id = 1;
        message.name = "cocos";
        message.money = Long.fromString("18446744073709551615");
        // let buffer  = PlayerInfo.encode(message).finish();
        let buffer = ProtobufUtil.PbEncode(message);
        console.log("encode: ", buffer);
        // let decoded = PlayerInfo.decode(buffer);
        let decoded: any = ProtobufUtil.PbDecode("PlayerInfo", buffer);
        console.log("decode: ", decoded);
        console.log(`name: ${ProtobufUtil.GetPbNameByPb(message)}, type: ${ProtobufUtil.GetPbTypeByName("PlayerInfo")}`);
        this.outputPlayer(decoded as PlayerInfo);
    }

    private outputPlayer(player: PlayerInfo): void {
        console.log(`player: ${player}, long data: ${player.money.toString()}`);
    }

    update(deltaTime: number) {
        
    }
}

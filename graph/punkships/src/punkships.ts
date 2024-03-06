import { Bytes, JSONValueKind, TypedMap, json, log } from "@graphprotocol/graph-ts";
import { decode } from "as-base64";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  Mint as MintEvent,
} from "../generated/Punkships/Punkships";
import {
  Account,
  Approval,
  ApprovalForAll,
  Contract,
  OwnershipTransferred,
  Token,
  Transfer,
  Attribute,
} from "../generated/schema";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  log.info('Transferring token {} from {} to {}', [event.params.tokenId.toString(), event.params.from.toHex(), event.params.to.toHex()]);
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  if (event.params.from.toHex() != NULL_ADDRESS) {
    // this is not a mint, it's a transfer
    const account = new Account(event.params.to);
    account.contract = event.address;
    account.save();

    const tokenId = event.address.concatI32(event.params.tokenId.toI32());
    const token = Token.load(tokenId);

    if (!token) {
      const token = new Token(tokenId);
      token.contract = event.address;
      token.owner = event.params.to;
      token.tokenId = event.params.tokenId;
      token.save();
    }
  }
}

function decodeMetadata(dataUrl: string, tokenId: Bytes): TypedMap<string, string> {
  const result = new TypedMap<string, string>()

  const metadata_b64 = dataUrl.slice(29)
  const metadata = decode(metadata_b64)
  const metadata_string = String.UTF8.decode(metadata.buffer)
  const metadata_json = json.fromString(metadata_string)
  const metadata_obj = metadata_json.toObject()

  const image = metadata_obj.get('image')
  result.set('image', (image && image.kind == JSONValueKind.STRING) ? image.toString() : '')

  const attributes = metadata_obj.get('attributes')
  if (attributes && attributes.kind == JSONValueKind.ARRAY) {
    const attributes_array = attributes.toArray()

    for (let i = 0; i < attributes_array.length; i++) {
      const attribute = new Attribute(tokenId.concatI32(i))
      const element = attributes_array[i].toObject()
      const trait_type = element.get('trait_type')
      const value = element.get('value')

      if (trait_type && trait_type.kind == JSONValueKind.STRING) {
        attribute.trait = trait_type.toString()
      }
      if (value) {
        if (value.kind == JSONValueKind.NUMBER) {
          attribute.value = value.toU64().toString()
        } else {
          attribute.value = value.toString()
        }
      }

      attribute.token = tokenId
      attribute.save()
    }
  }
  return result
}

export function handleMint(event: MintEvent): void {
  log.info('Minting token {}', [event.params.id.toString()]);
  // save contract
  const contract = new Contract(event.address);
  contract.name = "Punkships";
  contract.symbol = "PNKS";
  contract.save();
  log.info('Contract {} saved', [contract.id.toHex()]);

  // save new owner's account
  const account = new Account(event.params.owner);
  account.contract = contract.id;
  account.save();
  log.info('Account {} saved', [account.id.toHex()]);

  // save token
  const tokenId = contract.id.concatI32(event.params.id.toI32());
  const token = new Token(tokenId);
  token.contract = contract.id;
  token.owner = event.params.owner;
  token.tokenId = event.params.id;
  token.tokenURI = event.params.tokenURI;
  log.info('Token {}\'s attributes set', [token.tokenId.toI32().toString()]);
  
  const metadata = decodeMetadata(event.params.tokenURI, token.id);
  if(metadata.isSet('image') && metadata.get('image') != ''){
    token.image = metadata.get('image');
  };
  log.info('Token {}\'s image set', [token.tokenId.toI32().toString()]);

  token.save();
}

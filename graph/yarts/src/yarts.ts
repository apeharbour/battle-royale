import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
  Mint as MintEvent,
  Burn as BurnEvent,
  Yarts
} from "../generated/Yarts/Yarts";
import {
  Account,
  Approval,
  ApprovalForAll,
  Contract,
  OwnershipTransferred,
  Token,
  Transfer,
  Attribute
} from "../generated/schema";
import { log, Bytes, JSONValueKind, TypedMap, json, Address, BigInt, store } from "@graphprotocol/graph-ts";
import { decode } from "as-base64";

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

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

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  saveOrLoadContract(event.address);
}

function saveOrLoadContract(address: Address): Contract {
  // Save contract
  let contract = Contract.load(address);
  if (contract == null) {

    const yarts = Yarts.bind(address);
    const name = yarts.name();
    const symbol = yarts.symbol();

    contract = new Contract(address);
    contract.name = name;
    contract.symbol = symbol;
    contract.save();
    log.info('Contract {} saved', [contract.id.toHex()]);
  }
  return contract;
}

function saveOrLoadAccount(address: Address, contract: Contract): Account {
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address);
    account.contract = contract.id;
    account.save();
    log.info('Account {} saved', [account.id.toHex()]);
  }
  return account;
}

function fetchTokenURI(contract: Contract, tokenId: BigInt): string {
  const yarts = Yarts.bind(Address.fromBytes(contract.id));
  const tokenURI = yarts.tokenURI(tokenId);
  log.info('TokenURI for token {} is {}', [tokenId.toString(), tokenURI]);
  return tokenURI;
}

function mintToken(to: Account, contract: Contract, tokenId: BigInt): void {
    const id = contract.id.concatI32(tokenId.toI32());
    const token = new Token(id);
    token.contract = to.contract;
    token.tokenId = tokenId;
    token.owner = to.id;
    token.burned = false;

    token.tokenURI = fetchTokenURI(contract, tokenId);

    const metadata = decodeMetadata(token.tokenURI, token.id);
    if (metadata.get('image') != '') {
      token.image = metadata.get('image');
    }
  
    token.save();
    log.info('Token {} minted', [token.tokenId.toString()]);
}

function burnToken(contract: Contract, tokenId: BigInt): void {
    const id = contract.id.concatI32(tokenId.toI32());

    const token = Token.load(id);
    if (!token) {
      log.error('Token {} not found', [tokenId.toString()]);
      return;
    }

    token.burned = true;
    token.save();

    // store.remove('Token', id.toString());
    log.info('Token {} burned', [tokenId.toString()]);
}

function transferToken(from: Account, to: Account, contract: Contract, tokenId: BigInt): void {
    const id = contract.id.concatI32(tokenId.toI32());
    let token = Token.load(id);

    if (token) {
      token.owner = to.id;
      token.save();
      log.info('Token {} transferred', [token.tokenId.toString()]);
    } else {
      log.error('Token {} not found', [tokenId.toString()]);
    }
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

  const contract = saveOrLoadContract(event.address);
  const from = saveOrLoadAccount(event.params.from, contract);
  const to = saveOrLoadAccount(event.params.to, contract);

  if (event.params.to.toHex() == NULL_ADDRESS) {
    burnToken(contract, event.params.tokenId);
    return
  } 

  if (event.params.from.toHex() == NULL_ADDRESS) {
    mintToken(to, contract, event.params.tokenId);
    return
  }

  transferToken(from, to, contract, event.params.tokenId);
}


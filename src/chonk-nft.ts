import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ApprovalForAll as ApprovalForAllEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/ChonkNFT/ChonkNFT";
import {
  ApprovalForAll,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  TransferBatch,
  TransferSingle,
  URI,
  NFTOwner,
} from "../generated/schema";

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.account;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;
  entity.contract = Bytes.fromHexString(
    "0xc805658931f959abc01133aa13ff173769133512"
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.newAdminRole = event.params.newAdminRole;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.operator = event.params.operator;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenIds = event.params.ids;
  entity.values = event.params.values;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  handleNFTBatchOwner(event);
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.operator = event.params.operator;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.id;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  handleNFTSingleOwner(event);
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;
  entity.tokenId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

function handleNFTSingleOwner(event: TransferSingleEvent): void {
  let entity = NFTOwner.load(event.params.to.toString());
  if (!entity) {
    entity = new NFTOwner(event.params.to.toString());
  }
  // if(entity.tokenIds){
  //   entity.tokenIds.push(event.params.id)
  // }
  // else{
  //   entity.tokenIds = [event.params.id]
  // }
  // entity.owner = event.params.to
  // if(entity.values){
  //   entity.values.push(event.params.value)
  // }
  // else{
  //   entity.values = [event.params.value]
  // }

  entity.tokenIds = [event.params.id];
  entity.owner = event.params.to;
  entity.values = [event.params.value];

  entity.save();
}

function handleNFTBatchOwner(event: TransferBatchEvent): void {
  let entity = NFTOwner.load(event.params.to.toString());
  if (!entity) {
    entity = new NFTOwner(event.params.to.toString());
  }
  let tokenIds = entity.tokenIds;
  let values = entity.values;
  if (tokenIds === null) {        
    tokenIds = event.params.ids;
  } else {
    let arr :BigInt[] = [];
    for (let index = 0; index < tokenIds.length; index++) {
      const element = tokenIds[index];
      arr.push(element);
    }
    for (let index = 0; index < event.params.ids.length; index++) {
      const element = event.params.ids[index];
      arr.push(element);
    }
  }
  if (values) {
    values = values.concat(event.params.values);
  } else {
    values = event.params.values;
  }
  entity.owner = event.params.to;
  // entity.values = event.params.values
  entity.save();
}

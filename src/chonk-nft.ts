import { BigInt, Bytes, log } from "@graphprotocol/graph-ts";
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
  Nft,
  NftOwner
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
  let entityNftOwner = NftOwner.load(event.params.to);
  if (!entityNftOwner){
    entityNftOwner =  new NftOwner(event.params.to);
  } 
  let entityNft = Nft.load(Bytes.fromHexString(event.params.id.toHexString()));
  if (!entityNft){
    entityNft =  new Nft(Bytes.fromHexString(event.params.id.toHexString()));
  } 
  entityNft.nftId = [event.params.id];
  entityNft.value = [event.params.value];
  entityNft.owners = [event.params.to];
  entityNft.transactionHash = event.transaction.hash;
  entityNftOwner.nft = [Bytes.fromHexString(event.params.id.toHexString())]

  entityNft.save();
  entityNftOwner.save();
}

function handleNFTBatchOwner(event: TransferBatchEvent): void {
  let entityNftOwner = NftOwner.load(event.params.to);
  if (!entityNftOwner){
    entityNftOwner =  new NftOwner(event.params.to);
  } 
  let entityNft = Nft.load(Bytes.fromHexString(event.params.ids.pop().toHexString()));
  if (!entityNft){
    entityNft =  new Nft(Bytes.fromHexString(event.params.ids.pop().toHexString()));
  } 
  entityNft.nftId = event.params.ids;
  entityNft.value = event.params.values;
  entityNft.owners = [event.params.to];
  entityNft.transactionHash = event.transaction.hash;
  entityNftOwner.nft = [Bytes.fromHexString(event.params.ids.pop().toHexString())]

  entityNft.save();
  entityNftOwner.save();
}

// function handleNFTBatchOwner(event: TransferBatchEvent): void {
//   let entity = NFTOwner.load(event.params.ids[0].toString());
//   if (!entity) {
//     entity = new NFTOwner(event.params.ids[0].toString());
//   }
//   let tokenIds = entity.tokenIds;
//   let values = entity.values;
//   entity.transactionHash = event.transaction.hash;
//   if (tokenIds === null) {
//     entity.tokenIds = event.params.ids;
//   } else {
//     entity.tokenIds = entity.tokenIds!.concat(event.params.ids);
//   }
//   if (values === null) {
//     entity.values = event.params.ids;
//   } else {
//     entity.values = entity.values!.concat(event.params.values);
//   }
//   entity.owner = event.params.to;
//   entity.save();
// }

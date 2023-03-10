import { BigInt, bigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from "../generated/KidNFT/KidNFT";
import {
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer,
  Nft,
  NftOwner
} from "../generated/schema";

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
  entity.contract = Bytes.fromHexString("0x77372a4cc66063575b05b44481F059BE356964A4");

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
  
  handleNFTOwner(event);
}

function handleNFTOwner(event: TransferEvent): void {
  let entityNftOwner = NftOwner.load(event.params.to);
  if (!entityNftOwner){
    entityNftOwner =  new NftOwner(event.params.to);
  } 
  let entityNft = Nft.load(Bytes.fromHexString(event.params.tokenId.toHexString()));
  if (!entityNft){
    entityNft =  new Nft(Bytes.fromHexString(event.params.tokenId.toHexString()));
  } 
  entityNft.nftId = [event.params.tokenId];
  entityNft.value = [BigInt.fromI64(1)];
  entityNft.owners = [event.params.to];
  entityNft.transactionHash = event.transaction.hash;
  entityNftOwner.nft = [(Bytes.fromHexString(event.params.tokenId.toHexString()))]

  entityNft.save();
  entityNftOwner.save();
}
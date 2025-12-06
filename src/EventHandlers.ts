/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Reflection,
  Reflection_Approval,
  Reflection_ApprovalForAll,
  Reflection_BatchMetadataUpdate,
  Reflection_Initialized,
  Reflection_MetadataUpdate,
  Reflection_OwnershipTransferred,
  Reflection_Paused,
  Reflection_Transfer,
  Reflection_TransferWithIPFS,
  Reflection_Unpaused,
} from "generated";

Reflection.Approval.handler(async ({ event, context }) => {
  const entity: Reflection_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.Reflection_Approval.set(entity);
});

Reflection.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: Reflection_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.Reflection_ApprovalForAll.set(entity);
});

Reflection.BatchMetadataUpdate.handler(async ({ event, context }) => {
  const entity: Reflection_BatchMetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _fromTokenId: event.params._fromTokenId,
    _toTokenId: event.params._toTokenId,
  };

  context.Reflection_BatchMetadataUpdate.set(entity);
});

Reflection.Initialized.handler(async ({ event, context }) => {
  const entity: Reflection_Initialized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    version: event.params.version,
  };

  context.Reflection_Initialized.set(entity);
});

Reflection.MetadataUpdate.handler(async ({ event, context }) => {
  const entity: Reflection_MetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _tokenId: event.params._tokenId,
  };

  context.Reflection_MetadataUpdate.set(entity);
});

Reflection.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: Reflection_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.Reflection_OwnershipTransferred.set(entity);
});

Reflection.Paused.handler(async ({ event, context }) => {
  const entity: Reflection_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  };

  context.Reflection_Paused.set(entity);
});

Reflection.Transfer.handler(async ({ event, context }) => {
  const entity: Reflection_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.Reflection_Transfer.set(entity);
});

Reflection.TransferWithIPFS.handler(async ({ event, context }) => {
  const tokenId = event.params.tokenid.toString();
  const ipfsHash = event.params.ipfsHash;

  let token = await context.Token.get(tokenId);
  if (!token) {
    token = {
      id: tokenId,
      owner: event.params.to.toLowerCase(),
      uri: "",
      metadata: "",
      mintedAt: BigInt(event.block.timestamp),
      burned: false,
      image_url: "",
      name: "",
      description: "",
    };
  }

  const uri = ipfsHash
  let metadataRaw = "";
  let metadataJson: any = {};

  // Fetch metadata JSON from IPFS
  try {
    const res = await fetch(uri);
    metadataRaw = await res.text();
    metadataJson = JSON.parse(metadataRaw);
  } catch (err) {
    console.log("Failed to fetch metadata", err);
  }

  // Extract fields safely
  const imageUrl =
    metadataJson.image_url?.startsWith("ipfs://")
      ? metadataJson.image_url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : metadataJson.image_url || "";

  const name = metadataJson.name || "";
  const description = metadataJson.description || "";

  // Save updated Token
  context.Token.set({
    id: token.id,
    owner: token.owner,
    uri,
    metadata: metadataRaw,
    mintedAt: token.mintedAt,
    burned: token.burned,
    image_url: imageUrl,
    name,
    description,
  });
});


Reflection.Unpaused.handler(async ({ event, context }) => {
  const entity: Reflection_Unpaused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  };

  context.Reflection_Unpaused.set(entity);
});



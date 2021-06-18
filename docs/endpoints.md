All the [BitClout node API](https://docs.bitclout.com/devs/backend-api), sorted by category. 

Only some endpoints have been implemented so far. Endpoints that have not yet been implemented can be manually called using {@link BitcloutClient.callApi}

### General

- {@link BitcloutClient.healthCheck}
- {@link BitcloutClient.getExchangeRate}
- {@link BitcloutClient.getAppState}

### Transactions

- {@link BitcloutClient.checkTransaction} (this is actually `getTxn`)
- {@link BitcloutClient.submitTransaction}
- {@link BitcloutClient.updateProfile}
- {@link BitcloutClient.burnBitcoin}
- {@link BitcloutClient.sendBitclout}
- {@link BitcloutClient.submitPost}
- {@link BitcloutClient.follow}
- {@link BitcloutClient.unfollow}
- {@link BitcloutClient.like}
- {@link BitcloutClient.unlike}
- {@link BitcloutClient.buyCreatorCoin}
- {@link BitcloutClient.sellCreatorCoin}
- {@link BitcloutClient.transferCreatorCoin}
- {@link BitcloutClient.sendDiamonds}

### Users

- {@link BitcloutClient.getUsers}
- {@link BitcloutClient.getProfiles}
- {@link BitcloutClient.getProfile}
- {@link BitcloutClient.getHodlers}
- {@link BitcloutClient.getDiamonds}
- {@link BitcloutClient.getFollows}
- {@link BitcloutClient.getUserGlobalMetadata}
- {@link BitcloutClient.updateUserGlobalMetadata}
- {@link BitcloutClient.getNotifications}
- {@link BitcloutClient.blockPublicKey}

### Posts

- {@link BitcloutClient.getPosts}
- {@link BitcloutClient.getPost}
- {@link BitcloutClient.getPostsForPublicKey}
- {@link BitcloutClient.getDiamondedPosts}

### Media

- {@link BitcloutClient.uploadImage}
- {@link BitcloutClient.getFullTikTokUrl}

### Messages

- {@link BitcloutClient.sendMessage}
- {@link BitcloutClient.getMessages}
- {@link BitcloutClient.markContactMessagesRead}
- {@link BitcloutClient.markAllMessagesRead}

### Verification

- {@link BitcloutClient.sendVerificationText}
- {@link BitcloutClient.submitVerificationText}

### Wyre

- {@link BitcloutClient.getWyreWalletOrderQuotation}
- {@link BitcloutClient.getWyreWalletOrderReservation}
- {@link BitcloutClient.wyreWalletOrderSubscription}
- {@link BitcloutClient.admin.getWyreOrdersForPublicKey}

### Mining

- {@link BitcloutClient.getBlockTemplate}
- {@link BitcloutClient.submitBlock}

## Admin

The remaining endpoints can be used from your own account to control or get stats from your node.

### Node
- {@link BitcloutClient.nodeControl}
- {@link BitcloutClient.reprocessBitcoinBlock}
- {@link BitcloutClient.getMempoolStats}
- {@link BitcloutClient.evictUnminedBitcoinTransactions}

### Transactions

- {@link BitcloutClient.admin.getGlobalParams}
- {@link BitcloutClient.admin.updateGlobalParams}
- {@link BitcloutClient.admin.swapIdentity}

### Users

- {@link BitcloutClient.admin.updateUserGlobalMetadata}
- {@link BitcloutClient.admin.getAllUsersGlobalMetadata}
- {@link BitcloutClient.admin.getUserGlobalMetadata}
- {@link BitcloutClient.admin.grantVerificationBadge}
- {@link BitcloutClient.admin.removeVerificationBadge}
- {@link BitcloutClient.admin.getVerifiedUsers}
- {@link BitcloutClient.admin.getUsernameVerificationAuditLogs}

### Feed

- {@link BitcloutClient.admin.updateGlobalFeed}
- {@link BitcloutClient.admin.pinPost}
- {@link BitcloutClient.admin.removeNilPosts}

import { BaseTxnSubmissionResponse } from "."
import { ProfileEntryResponseFull } from "./user"

// https://github.com/bitclout/backend/blob/main/routes/post.go#L56
interface PostEntryResponseFull {
  PostHashHex:                string
	PosterPublicKeyBase58Check: string
	ParentStakeID:              string
	Body:                       string
	ImageURLs:                  string[]
	RecloutedPostEntryResponse: PostEntryResponse
	CreatorBasisPoints:        	number
	StakeMultipleBasisPoints:   number
	TimestampNanos:             number
	IsHidden:                   boolean
	ConfirmationBlockHeight:    number
	InMempool:                  boolean
	StakeEntry: {
		TotalPostStake: 					number
		StakeList: {
			InitialStakeNanos:                   number
			BlockHeight:                         number
			InitialStakeMultipleBasisPoints:     number
			InitialCreatorPercentageBasisPoints: number
			RemainingStakeOwedNanos:             number
			StakerPublicKeyBase58Check:          string
		}[]
	}
	StakeEntryStats:            any // TODO
	/** Profile associated with this post */
	ProfileEntryResponse: 			Partial<ProfileEntryResponseFull>
	Comments:     							PostEntryResponse[]
	LikeCount:    							number
	DiamondCount: 							number
	// Information about the reader's state w/regard to this post (e.g. if they liked it).
	PostEntryReaderState: 			any // TODO *lib.PostEntryReaderState
	/** True if this post hash hex is in the global feed.  */
	InGlobalFeed:								boolean
	/** True if this post hash hex is pinned to the global feed. */
	IsPinned:										boolean
	// PostExtraData stores an arbitrary map of attributes of a PostEntry
	PostExtraData:    					Record<string, string> // I think this is the correct type?
	CommentCount:      					number
	RecloutCount:      					number
	QuoteRecloutCount: 					number
	/** A list of parents posts of thsi post. Ordered with closest parent last. */
	ParentPosts:								PostEntryResponse[]

	// TODO I don't understand what this field means:
	/** Number of diamonds the sender gave this post. Only set when getting diamond posts. */ 
	DiamondsFromSender:					number
}

export type PostEntryResponse = Partial<PostEntryResponseFull>

export interface TxnMetaSubmitPost {
  PostHashToModify: string
  ParentStakeId: string
  Body: string
  CreatorBasisPoints: number
  StakeMultipleBasisPoints: number
  TimestampNanos: number
  IsHidden: boolean
}

export type PostTxnResponse = BaseTxnSubmissionResponse<TxnMetaSubmitPost> & {
  PostEntryResponse:  PostEntryResponse
}

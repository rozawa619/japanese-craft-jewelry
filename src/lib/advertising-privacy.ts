import {z} from 'zod';
import raw from '../data/advertising-privacy.json' with {type:'json'};

/** Current deployment facts, not a self-certification of consent or compliance.
 * A live ad integration needs an explicit, separately reviewed implementation. */
export const advertisingPrivacySchema=z.object({
 mode:z.literal('off'),policyVersion:z.literal('2026-11-17-v14'),
 accountConnection:z.literal('not-configured'),certifiedCmp:z.literal('not-configured'),
 hostingSuitability:z.literal('pending-review'),adServingIntegration:z.literal('not-enabled'),
}).strict();
export const advertisingPrivacy=advertisingPrivacySchema.parse(raw);
export function assertAdvertisingPrivacyLock(input:unknown,activationValues:readonly unknown[]=[]){
 const state=advertisingPrivacySchema.parse(input);
 if(activationValues.some(value=>/^(?:true|1|on|enabled)$/i.test(String(value).trim())))throw new Error('Google advertising is locked off: connect the actual account, verify the host and certified CMP, update the current policy and test a reviewed integration before enabling ad serving.');
 return state;
}

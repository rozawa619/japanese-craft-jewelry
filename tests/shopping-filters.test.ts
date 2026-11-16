import test from 'node:test';
import assert from 'node:assert/strict';
import {budgetForJapanPrice,compareJapanPrices} from '../src/lib/shopping-filters.ts';

test('budget boundaries do not duplicate or omit a domestic reference amount',()=>{
 for(const [amount,expected] of [[0,'up-to-5000'],[5000,'up-to-5000'],[5001,'5000-10000'],[10000,'5000-10000'],[10001,'10000-20000'],[20000,'10000-20000'],[20001,'20000-40000'],[40000,'20000-40000'],[40001,'over-40000']] as const)assert.equal(budgetForJapanPrice(amount),expected);
});
test('unknown and invalid prices are never a low-budget match',()=>{
 for(const value of [null,undefined,NaN,Infinity,-1])assert.equal(budgetForJapanPrice(value),'unconfirmed');
});
test('unknown prices follow all known prices in both directions',()=>{
 const values=[{amount:null,order:0},{amount:9000,order:1},{amount:0,order:2},{amount:3000,order:3},{amount:null,order:4}];
 assert.deepEqual([...values].sort((a,b)=>compareJapanPrices(a,b,'price-asc')).map(item=>item.order),[2,3,1,0,4]);
 assert.deepEqual([...values].sort((a,b)=>compareJapanPrices(a,b,'price-desc')).map(item=>item.order),[1,3,2,0,4]);
});
test('equal prices keep editorial order and reset restores it',()=>{
 const values=[{amount:3000,order:2},{amount:null,order:1},{amount:3000,order:0}];
 assert.deepEqual([...values].sort((a,b)=>compareJapanPrices(a,b,'price-asc')).map(item=>item.order),[0,2,1]);
 assert.deepEqual([...values].sort((a,b)=>compareJapanPrices(a,b,'')).map(item=>item.order),[0,1,2]);
});

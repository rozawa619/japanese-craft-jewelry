export const budgetIds=['up-to-5000','5000-10000','10000-20000','20000-40000','over-40000','unconfirmed'] as const;
export type BudgetId=typeof budgetIds[number];
export type PriceSort=''|'price-asc'|'price-desc';

/** Domestic reference prices only. Unknown is never a zero-price offer. */
export function budgetForJapanPrice(amount:number|null|undefined):BudgetId {
 if(typeof amount!=='number'||!Number.isFinite(amount)||amount<0)return 'unconfirmed';
 if(amount<=5000)return 'up-to-5000';
 if(amount<=10000)return '5000-10000';
 if(amount<=20000)return '10000-20000';
 if(amount<=40000)return '20000-40000';
 return 'over-40000';
}

export function compareJapanPrices(a:{amount:number|null;order:number},b:{amount:number|null;order:number},sort:PriceSort):number {
 if(!sort)return a.order-b.order;
 const known=(value:number|null):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>=0;
 if(!known(a.amount))return !known(b.amount)?a.order-b.order:1;
 if(!known(b.amount))return -1;
 return (sort==='price-desc'?b.amount-a.amount:a.amount-b.amount)||a.order-b.order;
}

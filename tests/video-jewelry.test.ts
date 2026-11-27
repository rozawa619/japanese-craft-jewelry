import test from 'node:test';
import assert from 'node:assert/strict';
import {videoJewelryFor} from '../src/lib/video-jewelry.ts';
import {productImageFor} from '../src/lib/editorial-images.ts';

const visible='listed_on_public_profile';
const post=(number:number,productId:string)=>({
 url:`https://www.tiktok.com/@soracraftdiary/video/${number}`,
 availability:visible,productId,
});

test('only publicly matched products appear, once each in the order of the registry',()=>{
 const products=[
  {id:'first',publishStatus:'published'}, {id:'second',publishStatus:'published'},
  {id:'unverified',publishStatus:'published'}, {id:'draft',publishStatus:'draft'},
  {id:'unrelated-account',publishStatus:'published'},
 ] as const;
 const items=videoJewelryFor(products,[
  {...post(1,'unverified'),availability:'unconfirmed'},post(2,'second'),
  post(3,'first'),post(4,'second'),post(5,'draft'),post(6,'missing'),
  {...post(7,'unrelated-account'),url:'https://www.tiktok.com/@another-account/video/7'},
  {...post(8,'unverified'),url:null},
 ]);
 assert.deepEqual(items.map(item=>item.product.id),['second','first']);
});

test('a posted product remains linked and gets a thumbnail only when the current image matches a record',()=>{
 const product={id:'hamamatsuya-pendant',publishStatus:'published'} as const;
 const current=productImageFor(product.id);
 assert.ok(current);
 const previous={...post(1,product.id),imageAssetId:'past-image',siteImagePath:current.path};
 assert.deepEqual(videoJewelryFor([product],[previous]),[{product,image:undefined}]);
 const wrongPath={...post(2,product.id),imageAssetId:current.assetId,siteImagePath:'images/past-image.webp'};
 assert.deepEqual(videoJewelryFor([product],[wrongPath]),[{product,image:undefined}]);
 const matched={...post(3,product.id),imageAssetId:current.assetId,siteImagePath:current.path};
 assert.deepEqual(videoJewelryFor([product],[previous,matched]),[{product,image:current}]);
});

test('a verified archived portrait can use its reviewed revision as the profile thumbnail',()=>{
 const product={id:'morphosphere-ultramarine-pansy-pierced-earrings',publishStatus:'published'} as const;
 const current=productImageFor(product.id);
 assert.ok(current);
 const archived={...post(1,product.id),imageAssetId:'ai-morphosphere-blue-pansy-styling-v9',siteImagePath:'images/morphosphere-blue-pansy-styling-v9.webp'};
 assert.deepEqual(videoJewelryFor([product],[archived]),[{product,image:current}]);
 assert.deepEqual(videoJewelryFor([product],[{...archived,siteImagePath:current.path}]),[{product,image:undefined}]);
});

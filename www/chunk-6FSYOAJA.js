import{a as le,b as ue}from"./chunk-GPOJ6U7F.js";import{A as ie,C as ne,D as oe,F as re,K as ae,e as N,f as B,g as j,h as H,i as z,j as J,k as W,l as q,m as G,n as K,o as Q,q as U,r as X,s as Y,t as Z,w as ee,x as te}from"./chunk-NZTSZEPZ.js";import"./chunk-DBLGMTO4.js";import"./chunk-QUJFQN2Y.js";import"./chunk-O52IKJVK.js";import"./chunk-OQJCXMAZ.js";import"./chunk-VL6F45B6.js";import"./chunk-EU7FQ5IA.js";import"./chunk-STP2TL6J.js";import"./chunk-TCRGSDKV.js";import"./chunk-7FY2OE2O.js";import"./chunk-VBVQFYTF.js";import"./chunk-5EGKW7JY.js";import"./chunk-DM6TJFWJ.js";import"./chunk-MTHZ7MWU.js";import"./chunk-WI5MSH4N.js";import"./chunk-D7QNDGRV.js";import"./chunk-CKP3SGE2.js";import"./chunk-3IBBKVJY.js";import"./chunk-DADNZVRM.js";import{A as h,Ba as F,Ca as M,Ea as L,Ga as $,H as u,L as x,N as R,Na as k,Oa as D,Qa as O,R as d,W as s,X as i,Y as n,Z as A,d as f,da as b,e as v,ea as g,f as w,fa as p,g as E,l as T,ma as e,na as S,oa as _,va as C,wa as y,ya as P,z as I,zb as V}from"./chunk-3YJH32OC.js";import"./chunk-Z6NEOT2M.js";import"./chunk-MSMJJC2X.js";import"./chunk-53OGNGEH.js";import"./chunk-JVTPOORY.js";import"./chunk-CLDSZD2A.js";import"./chunk-M2X7KQLB.js";import"./chunk-REYR55MP.js";import"./chunk-OZYWYLNK.js";import"./chunk-42C7ZIID.js";import"./chunk-JHI3MBHO.js";var ce=()=>[1,2,3,4,5];function de(o,l){o&1&&(i(0,"div",8),e(1,`
\xA0 \xA0 `),A(2,"ion-spinner",9),e(3,`
\xA0 \xA0 `),i(4,"p"),e(5,"Cargando rese\xF1as..."),n(),e(6,`
\xA0 `),n())}function me(o,l){if(o&1){let t=b();i(0,"div",8),e(1,`
\xA0 \xA0 `),A(2,"ion-icon",10),e(3,`
\xA0 \xA0 `),i(4,"p",11),e(5),n(),e(6,`
\xA0 \xA0 `),i(7,"ion-button",12),g("click",function(){I(t);let c=p();return h(c.loadReviews())}),e(8,"Reintentar"),n(),e(9,`
\xA0 `),n()}if(o&2){let t=p();u(5),S(t.errorMessage)}}function Ae(o,l){o&1&&(i(0,"ion-list-header"),e(1,`
\xA0 \xA0 \xA0 `),i(2,"ion-label"),e(3,"A\xFAn no hay rese\xF1as publicadas."),n(),e(4,`
\xA0 \xA0 `),n())}function pe(o,l){if(o&1&&A(0,"ion-img",20),o&2){let t=p().$implicit;s("src",t.photos==null||t.photos[0]==null?null:t.photos[0].url)}}function _e(o,l){if(o&1&&A(0,"ion-icon",21),o&2){let t=l.$implicit,r=p().$implicit;s("name",t<=r.rating?"star":"star-outline")("color",t<=r.rating?"warning":"medium")}}function xe(o,l){if(o&1&&(i(0,"p"),e(1),n()),o&2){let t=p().$implicit;u(),_("Direcci\xF3n: ",t.place==null?null:t.place.address)}}function ge(o,l){if(o&1){let t=b();i(0,"ion-card"),e(1,`
\xA0 \xA0 \xA0 `),d(2,pe,1,1,"ion-img",14),e(3,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),i(4,"ion-card-header"),e(5,`
\xA0 \xA0 \xA0 \xA0 `),i(6,"ion-card-title"),e(7),n(),e(8,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),i(9,"ion-card-subtitle"),e(10,`
\xA0 \xA0 \xA0 \xA0 \xA0 `),d(11,_e,1,2,"ion-icon",15),e(12,`
\xA0 \xA0 \xA0 \xA0 `),n(),e(13," \xA0 \xA0 \xA0 "),n(),e(14," \xA0 \xA0 \xA0 "),i(15,"ion-card-content"),e(16,`
\xA0 \xA0 \xA0 \xA0 `),i(17,"p",16),e(18),n(),e(19,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),i(20,"ion-item",17),e(21,`
\xA0 \xA0 \xA0 \xA0 \xA0 `),i(22,"ion-label"),e(23,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),i(24,"p"),e(25),n(),e(26,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),d(27,xe,2,1,"p",7),e(28,`
\xA0 \xA0 \xA0 \xA0 \xA0 \xA0 `),i(29,"p")(30,"small"),e(31),y(32,"date"),n()(),e(33,`
\xA0 \xA0 \xA0 \xA0 \xA0 `),n(),e(34,`
\xA0 \xA0 \xA0 \xA0 `),n(),i(35,"ion-button",18),g("click",function(){let c=I(t).$implicit,a=p(2);return h(a.goToDetails(c.place_id))}),A(36,"ion-icon",19),e(37," Ver Detalles y Votaciones "),n(),e(38,`
\xA0 \xA0 \xA0 `),n(),e(39,`
\xA0 \xA0 `),n()}if(o&2){let t=l.$implicit;u(2),s("ngIf",t.photos==null?null:t.photos.length),u(5),S((t.place==null?null:t.place.name)||"Lugar Desconocido"),u(4),s("ngForOf",C(10,ce)),u(7),_('"',t.comment,'"'),u(7),_("Por: **",(t.user==null?null:t.user.name)||"An\xF3nimo","**"),u(2),s("ngIf",t.place==null?null:t.place.address),u(4),_("Publicado: ",P(32,7,t.created_at,"mediumDate"))}}function fe(o,l){if(o&1&&(i(0,"ion-list"),e(1,`
\xA0 \xA0 \xA0 \xA0 `),d(2,Ae,5,0,"ion-list-header",7),e(3," \xA0 \xA0 "),d(4,ge,40,11,"ion-card",13),e(5," \xA0 "),n()),o&2){let t=p();u(2),s("ngIf",t.reviews.length===0),u(2),s("ngForOf",t.reviews)}}var Fe=(()=>{let l=class l{constructor(r,c,a){this.reviewService=r,this.placeService=c,this.router=a,this.reviews=[],this.isLoadingReviews=!1,this.errorMessage=null}ngOnInit(){this.loadReviews()}ionViewWillEnter(){this.loadReviews()}goToDetails(r){r?(this.router.navigate(["/tabs","place-detail",r]),console.log("Navegando a:",`/tabs/place-detail/${r}`)):console.error("No se pudo navegar, placeId es inv\xE1lido.")}loadReviews(){this.isLoadingReviews=!0,this.errorMessage=null,this.reviewService.getReviews().pipe(v(r=>r.data||[]),w(r=>{if(r.length===0)return f([]);let c=r.map(a=>a.place?.name?f(a):this.placeService.getPlaceById(a.place_id).pipe(v(m=>(console.log(`Rese\xF1a ID: ${a.id} -> Buscando Place ID: ${a.place_id}`),m?(console.log(`Encontrado Place Name: ${m.name} para Rese\xF1a ID: ${a.id}`),a.place={id:m.id,name:m.name,address:m.address,lat:m.lat,lng:m.lng}):console.log(`NO se encontr\xF3 el lugar para Rese\xF1a ID: ${a.id}`),a))));return E(c)}),T(()=>this.isLoadingReviews=!1)).subscribe({next:r=>{this.reviews=r,console.log("Reviews loaded with Place details:",this.reviews)},error:r=>{console.error("API Error:",r),this.errorMessage="Error al cargar las rese\xF1as o los detalles del lugar."}})}};l.\u0275fac=function(c){return new(c||l)(x(le),x(ue),x(k))},l.\u0275cmp=R({type:l,selectors:[["app-tab1"]],decls:28,vars:5,consts:[[3,"translucent"],["slot","end"],["routerLink","/create-review"],["slot","icon-only","name","add-circle-outline"],[3,"fullscreen"],["slot","fixed",3,"ionRefresh"],["class","ion-padding ion-text-center",4,"ngIf"],[4,"ngIf"],[1,"ion-padding","ion-text-center"],["name","crescent"],["name","alert-circle-outline","color","danger","size","large"],["color","danger",1,"ion-text-wrap"],[3,"click"],[4,"ngFor","ngForOf"],["alt","Foto del lugar","class","card-image",3,"src",4,"ngIf"],[3,"name","color",4,"ngFor","ngForOf"],[1,"ion-text-wrap"],["lines","none",1,"ion-margin-top"],["routerDirection","forward","expand","block","fill","solid","color","secondary",1,"ion-margin-top",3,"click"],["slot","start","name","information-circle-outline"],["alt","Foto del lugar",1,"card-image",3,"src"],[3,"name","color"]],template:function(c,a){c&1&&(i(0,"ion-header",0),e(1,`
\xA0 `),i(2,"ion-toolbar"),e(3,`
\xA0 \xA0 `),i(4,"ion-title"),e(5,"Rese\xF1as de Lugares"),n(),e(6,`
\xA0 \xA0 `),i(7,"ion-buttons",1),e(8,`
\xA0 \xA0 \xA0 `),i(9,"ion-button",2),e(10,`
\xA0 \xA0 \xA0 \xA0 `),A(11,"ion-icon",3),e(12,`
\xA0 \xA0 \xA0 `),n(),e(13,`
\xA0 \xA0 `),n(),e(14,`
\xA0 `),n()(),i(15,"ion-content",4),e(16,`
\xA0 `),i(17,"ion-refresher",5),g("ionRefresh",function(se){return a.loadReviews(),se.detail.complete()}),e(18,`
\xA0 \xA0 `),A(19,"ion-refresher-content"),e(20,`
\xA0 `),n(),e(21," \xA0 "),d(22,de,7,0,"div",6),e(23,`
\xA0 \xA0 `),d(24,me,10,1,"div",6),e(25," \xA0 "),d(26,fe,6,2,"ion-list",7),e(27,`
\xA0 `),n()),c&2&&(s("translucent",!0),u(15),s("fullscreen",!0),u(7),s("ngIf",a.isLoadingReviews),u(2),s("ngIf",a.errorMessage),u(2),s("ngIf",!a.isLoadingReviews&&!a.errorMessage))},dependencies:[ae,N,B,j,H,z,J,W,q,G,K,Q,U,X,Y,Z,ee,te,ie,ne,oe,re,$,F,M,V,O,D,L],styles:[".card-image[_ngcontent-%COMP%]{height:200px;object-fit:cover}"]});let o=l;return o})();export{Fe as Tab1Page};

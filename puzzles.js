/* Original grid illustrations. No image names or previews are shown before completion. */
(() => {
  'use strict';
  const LEVELS = [
    { size: 8, colors: 4, name: 'Stórir reitir', note: 'Róleg byrjun', palette: ['#d7e9ed','#354e54','#ed8268','#e7bd54'], colorNames: ['Ljósblár','Dökkblár','Rauður','Gulur'] },
    { size: 12, colors: 6, name: 'Aðeins fleiri', note: 'Nýjar uppgötvanir', palette: ['#dcecf0','#354650','#eb916e','#eac559','#fff0cf','#88ad86'], colorNames: ['Ljósblár','Dökkblár','Appelsínugulur','Gulur','Kremhvítur','Grænn'] },
    { size: 16, colors: 8, name: 'Litlar áskoranir', note: 'Meira að lita', palette: ['#dfeaf4','#3c455d','#e68d68','#ebc658','#f8efdb','#89af94','#a28cc2','#d7a9b6'], colorNames: ['Ljósblár','Dökkblár','Appelsínugulur','Gulur','Kremhvítur','Grænn','Fjólublár','Bleikur'] },
    { size: 20, colors: 10, name: 'Stóra ævintýrið', note: 'Fyrir þolinmóða litara', palette: ['#dfebf2','#38465c','#df7968','#e9c259','#f8efd8','#80aa8b','#9c87bc','#d6a5c3','#719db5','#b98460'], colorNames: ['Ljósblár','Dökkblár','Rauður','Gulur','Kremhvítur','Grænn','Fjólublár','Bleikur','Blár','Brúnn'] }
  ];
  const designs = [
    ['Hjarta', p => {p.poly([[3,4],[7,3],[10,6],[13,3],[17,4],[18,9],[10,17],[2,9]],2);p.rect(5,5,2,2,3);p.rect(1,17,18,2,1);}],
    ['Jólatré', p => {p.rect(9,14,2,5,1);p.poly([[10,2],[18,15],[2,15]],1);p.rect(9,1,2,2,3);p.rect(6,9,2,2,2);p.rect(11,11,2,2,3);p.rect(9,6,2,2,2);}],
    ['Fiskur', p => {p.poly([[3,10],[0,5],[0,15]],2);p.ellipse(10,10,8,5,3);p.poly([[9,6],[11,2],[14,6]],2);p.rect(14,8,2,2,1);p.rect(7,9,2,4,2);p.rect(2,2,2,2,1);}],
    ['Blóm', p => {p.rect(9,9,2,10,1);p.poly([[9,15],[4,11],[3,14],[9,17]],1);p.circle(10,5,3,2);p.circle(6,8,3,2);p.circle(14,8,3,2);p.circle(8,11,3,2);p.circle(12,11,3,2);p.circle(10,8,2.5,3);}],
    ['Hús', p => {p.rect(4,9,12,9,3);p.poly([[2,9],[10,2],[18,9]],2);p.rect(9,12,3,6,1);p.rect(5,11,2,3,1);p.rect(13,11,2,3,1);p.rect(0,18,20,2,1);}],
    ['Seglbátur', p => {p.rect(0,16,20,4,1);p.rect(9,2,1.5,13,1);p.poly([[8,3],[8,13],[1,13]],3);p.poly([[11,4],[18,13],[11,13]],2);p.poly([[2,14],[18,14],[15,18],[5,18]],2);}],
    ['Köttur', p => {p.rect(4,17,12,2,5);p.ellipse(10,13,5,5,2);p.poly([[5,7],[5,2],[9,5],[12,5],[15,2],[15,9]],2);p.circle(10,8,5,2);p.rect(6,7,2,2,1);p.rect(12,7,2,2,1);p.rect(9,10,2,1.5,3);p.poly([[14,14],[18,10],[18,16],[14,17]],2);p.rect(9,13,2,4,4);}],
    ['Risaeðla', p => {p.rect(0,18,20,2,5);p.ellipse(10,12,5,4,5);p.rect(12,4,5,9,5);p.rect(13,3,6,5,5);p.rect(16,4,1.5,1.5,1);p.rect(7,14,2,4,2);p.rect(12,14,2,4,2);p.poly([[7,11],[1,8],[3,14],[8,15]],5);p.rect(14,7,4,1,4);p.rect(2,2,3,3,3);}],
    ['Geimflaug', p => {p.poly([[6,13],[2,18],[7,17]],2);p.poly([[14,13],[18,18],[13,17]],2);p.poly([[8,16],[10,20],[12,16]],3);p.rect(7,7,6,10,4);p.poly([[7,7],[10,2],[13,7]],2);p.circle(10,10,2.3,1);p.circle(10,10,1.2,0);p.rect(2,3,1.5,1.5,5);}],
    ['Sveppur', p => {p.rect(0,17,20,3,5);p.rect(8,10,4,7,4);p.ellipse(10,9,8,6,2);p.rect(2,10,16,2,2);p.circle(6,8,1.8,4);p.circle(12,6,1.8,3);p.circle(15,10,1.5,4);p.rect(9,13,1,1,1);p.rect(11,13,1,1,1);}],
    ['Skjaldbaka', p => {p.rect(0,17,20,3,4);p.ellipse(9,11,6,4,5);p.ellipse(16,11,3,2.5,5);p.rect(17,10,1,1,1);p.rect(5,14,2,3,5);p.rect(11,14,2,3,5);p.poly([[3,10],[0,11],[4,13]],5);p.ellipse(9,10,4,3,2);p.rect(8,8,2,4,3);}],
    ['Ís í brauðformi', p => {p.poly([[5,10],[15,10],[10,19]],3);p.line(7,11,12,15,1,2);p.line(13,11,9,16,1,2);p.circle(7,8,3,4);p.circle(13,8,3,2);p.circle(10,5,3,4);p.circle(10,2,1.4,2);p.rect(2,2,1.5,1.5,5);p.rect(16,14,1.5,1.5,1);}],
    ['Ugla', p => {p.rect(1,17,18,1.4,1);p.ellipse(10,11,5.5,6,6);p.poly([[5,7],[5,2],[9,6]],6);p.poly([[11,6],[15,2],[15,8]],6);p.circle(7.7,8,2.4,4);p.circle(12.3,8,2.4,4);p.circle(8,8,1,1);p.circle(12,8,1,1);p.poly([[9,10],[11,10],[10,12]],3);p.ellipse(10,14,2.6,3,7);p.rect(7,17,1,2,2);p.rect(12,17,1,2,2);p.rect(1,2,2,2,5);}],
    ['Refur', p => {p.ellipse(11,14,4,4,2);p.poly([[13,14],[18,10],[18,17],[13,18]],2);p.poly([[17,11],[18,10],[18,14],[16,15]],4);p.poly([[4,9],[4,2],[9,6],[13,2],[14,9],[9,14]],2);p.poly([[4,9],[7,8],[9,13]],4);p.poly([[14,9],[11,8],[9,13]],4);p.rect(6,7,1.2,1.2,1);p.rect(11,7,1.2,1.2,1);p.rect(8,11,2,1,1);p.rect(0,18,20,2,5);}],
    ['Fiðrildi', p => {p.ellipse(5,7,4.5,5,6);p.ellipse(15,7,4.5,5,6);p.ellipse(6,14,3.6,4,7);p.ellipse(14,14,3.6,4,7);p.circle(5,7,2,3);p.circle(15,7,2,3);p.circle(6,14,1.5,2);p.circle(14,14,1.5,2);p.rect(9,6,2,11,1);p.line(10,7,7,2,.8,1);p.line(10,7,13,2,.8,1);p.rect(0,19,20,1,5);p.rect(1,1,1,1,4);}],
    ['Vélmenni', p => {p.rect(5,3,10,6,6);p.rect(9,1,2,2,1);p.circle(10,1,1,2);p.rect(7,5,2,2,4);p.rect(11,5,2,2,4);p.rect(6,10,8,6,8%8);p.rect(7,10,6,5,6);p.rect(8,11,2,2,3);p.rect(11,11,1,1,2);p.rect(2,10,3,5,1);p.rect(15,10,3,5,1);p.rect(6,16,3,3,1);p.rect(11,16,3,3,1);p.rect(0,19,20,1,5);}],
    ['Mörgæs', p => {p.ellipse(10,11,5,8,1);p.ellipse(10,13,3.4,5,4);p.circle(8,6,1.6,4);p.circle(12,6,1.6,4);p.circle(8,6,.7,1);p.circle(12,6,.7,1);p.poly([[8,8],[12,8],[10,10]],3);p.rect(6,9,8,2,2);p.rect(12,10,1.5,4,2);p.ellipse(6,18,2.5,1,3);p.ellipse(14,18,2.5,1,3);p.poly([[5,10],[1,15],[5,14]],1);p.poly([[15,10],[19,15],[15,14]],1);p.circle(2,2,1,6);}],
    ['Kastali', p => {p.rect(3,7,4,11,6);p.rect(13,7,4,11,6);p.rect(6,11,8,7,7);p.poly([[2,7],[5,2],[8,7]],2);p.poly([[12,7],[15,2],[18,7]],2);p.rect(9,14,2,4,1);p.rect(4,9,2,2,4);p.rect(14,9,2,2,4);p.rect(9,9,2,3,3);p.rect(0,18,20,2,5);}],
    ['Dreki', p => {p.poly([[7,10],[3,3],[9,6],[11,11]],6);p.poly([[12,10],[18,3],[17,12]],6);p.ellipse(10,13,4,5,5);p.ellipse(10,14,2,3,3);p.rect(10,5,5,6,5);p.rect(12,4,6,4,5);p.rect(15,5,1,1,1);p.poly([[12,4],[12,1],[14,4]],4);p.poly([[17,7],[20,6],[19,9]],2);p.line(8,15,3,17,2,5);p.poly([[4,17],[1,14],[1,18],[6,18]],5);p.rect(7,17,2,2,9);p.rect(12,17,2,2,9);}],
    ['Geimfari', p => {p.circle(10,6,5,4);p.ellipse(10,6,3.6,2.8,8);p.rect(8,4,2,1,0);p.rect(6,11,8,6,4);p.rect(8,12,4,3,8);p.rect(8,12,1,1,2);p.rect(10,12,1,1,3);p.rect(3,10,3,6,4);p.rect(14,10,3,6,4);p.rect(5,16,4,3,4);p.rect(11,16,4,3,4);p.rect(5,18,4,1,1);p.rect(11,18,4,1,1);p.circle(2,2,1,3);p.circle(18,3,1,6);}],
    ['Einhyrningur', p => {p.ellipse(10,13,5,3,4);p.rect(12,6,3,7,4);p.ellipse(14,6,3,2,4);p.poly([[13,5],[14,1],[15,5]],3);p.poly([[13,5],[11,4],[11,11],[13,12]],7);p.rect(15,5,1,1,1);p.rect(6,14,2,5,4);p.rect(12,14,2,5,4);p.rect(6,18,2,1,6);p.rect(12,18,2,1,6);p.poly([[6,12],[2,11],[2,16],[5,14]],6);p.rect(0,19,20,1,5);}],
    ['Lest', p => {p.rect(0,17,20,1,9);p.rect(1,9,8,6,2);p.rect(3,5,6,5,2);p.rect(2,4,8,1,1);p.rect(4,6,3,3,0);p.rect(10,10,9,5,8);p.rect(11,11,3,2,4);p.rect(15,11,3,2,4);p.rect(1,9,2,2,3);p.circle(3,15,2,1);p.circle(7,15,2,1);p.circle(12,15,2,1);p.circle(17,15,2,1);p.circle(2,2,1.2,4);p.circle(4,1,1.2,4);}],
    ['Hvalur', p => {p.rect(0,17,20,3,8);p.ellipse(10,12,7,5,8);p.poly([[4,11],[1,7],[0,8],[1,14],[5,15]],8);p.ellipse(12,14,4,2,4);p.circle(14,10,1,1);p.line(14,13,16,12,.5,1);p.ellipse(9,15,1.5,2.5,6);p.line(11,6,11,3,1,8);p.line(11,3,8,1,1,8);p.line(11,3,14,1,1,8);p.circle(18,5,1,3);}],
    ['Páfagaukur', p => {p.rect(1,17,18,1,9);p.ellipse(10,11,4,6,5);p.circle(11,6,4,2);p.circle(12,6,2.5,4);p.circle(13,5,1,1);p.poly([[14,6],[18,7],[15,10]],3);p.ellipse(8,11,2,4,8);p.poly([[7,14],[6,20],[10,17]],6);p.rect(9,16,1,2,3);p.rect(12,16,1,2,3);p.poly([[8,3],[7,0],[10,2],[12,1],[12,3]],2); }]
  ];
  function rasterize(index, size, colorCount) {
    const grid = Array(size*size).fill(0);
    const fill = (test,color) => {for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(test((x+.5)*20/size,(y+.5)*20/size))grid[y*size+x]=color;};
    const p = {
      rect:(x,y,w,h,c)=>fill((a,b)=>a>=x&&a<x+w&&b>=y&&b<y+h,c),
      ellipse:(x,y,rx,ry,c)=>fill((a,b)=>((a-x)/rx)**2+((b-y)/ry)**2<=1,c),
      circle:(x,y,r,c)=>p.ellipse(x,y,r,r,c),
      poly:(points,c)=>fill((x,y)=>{let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;},c),
      line:(x1,y1,x2,y2,width,c)=>fill((x,y)=>{const t=Math.max(0,Math.min(1,((x-x1)*(x2-x1)+(y-y1)*(y2-y1))/((x2-x1)**2+(y2-y1)**2)));return Math.hypot(x-x1-t*(x2-x1),y-y1-t*(y2-y1))<=width/2;},c)
    };
    designs[index][1](p);
    // Decorative corner pixels supply every color in the level's palette.
    for(let c=0;c<colorCount;c++)if(!grid.includes(c))grid[c*size+(c%2?size-1:0)]=c;
    return grid;
  }
  function getPuzzle(level, number) {
    const info=LEVELS[level]; const index=level*6+number;
    // Rotate the number-to-color mapping per picture; numbers never name an object.
    const offset=(number*3+level)%info.colors;
    const palette=info.palette.map((_,i)=>info.palette[(i+offset)%info.colors]);
    const colorNames=info.colorNames.map((_,i)=>info.colorNames[(i+offset)%info.colors]);
    const values=rasterize(index,info.size,info.colors).map(c=>(c-offset+info.colors)%info.colors);
    return {id:`v1-${level}-${number}`,level,number,size:info.size,palette,colorNames,values,name:designs[index][0]};
  }
  window.LeynilitirPuzzles={LEVELS,getPuzzle};
})();

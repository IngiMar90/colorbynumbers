const test=require('node:test');
const assert=require('node:assert/strict');
global.window={};require('../puzzles.js');
const {LEVELS,getPuzzle}=window.LeynilitirPuzzles;
test('four increasing levels and 24 valid, distinct pictures',()=>{
  assert.deepEqual(LEVELS.map(l=>l.size),[8,12,16,20]);
  assert.deepEqual(LEVELS.map(l=>l.colors),[4,6,8,10]);
  const names=new Set(),ids=new Set();
  LEVELS.forEach((level,l)=>{
    const grids=new Set();
    for(let n=0;n<6;n++){
      const p=getPuzzle(l,n);
      assert.equal(p.values.length,level.size**2);
      assert.equal(p.palette.length,level.colors);
      assert.equal(p.colorNames.length,level.colors);
      assert(p.colorNames.every(name=>typeof name==='string'&&name.length>0));
      for(let c=0;c<p.palette.length;c++)assert.equal(p.colorNames[c],level.colorNames[level.palette.indexOf(p.palette[c])], 'color labels must follow the numbered palette');
      assert.equal(new Set(p.values).size,level.colors);
      assert(p.values.every(c=>Number.isInteger(c)&&c>=0&&c<level.colors));
      assert(p.palette.every(c=>/^#[a-f0-9]{6}$/i.test(c)));
      assert.deepEqual(p,getPuzzle(l,n),'puzzles must remain stable when restoring progress');
      names.add(p.name);ids.add(p.id);grids.add(JSON.stringify(p.values));
    }
    assert.equal(grids.size,6);
  });
  assert.equal(names.size,24);assert.equal(ids.size,24);
});

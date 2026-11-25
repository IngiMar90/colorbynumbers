(() => {
  'use strict';
  const { LEVELS, getPuzzle } = window.LeynilitirPuzzles;
  const $ = id => document.getElementById(id);
  const KEY='leynilitir-v1';
  let saved={};let storageAvailable=true;
  try { saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={}; } catch {saved={};storageAvailable=false;}
  let level=0,puzzle=null,filled=[],selected=0,hints=false,zoom=1,painting=false,focusIndex=0;
  let cells=[],paletteButtons=[],lastPaint=-1,dragPointer=null,audioContext=null,soundOn=saved.sound===true;
  const totalFilled=()=>filled.reduce((sum,v)=>sum+Number(v),0);
  function readProgress(p) {const v=saved[p.id];return Array.isArray(v)&&v.length===p.values.length?v.map(x=>x===true):Array(p.values.length).fill(false);}
  function persist() {if(puzzle)saved[puzzle.id]=filled; saved.sound=soundOn;try{localStorage.setItem(KEY,JSON.stringify(saved));}catch{storageAvailable=false;announce('Vafrinn gat ekki vistað framvinduna.');} }
  function announce(message){$('announcer').textContent=message;}
  function tone(done=false){if(!soundOn)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const oscillator=audioContext.createOscillator(),gain=audioContext.createGain(),t=audioContext.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(done?523:440+selected*45,t);if(done)oscillator.frequency.setValueAtTime(784,t+.13);gain.gain.setValueAtTime(.045,t);gain.gain.exponentialRampToValueAtTime(.001,t+(done?.5:.09));oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(t+(done?.5:.1));}catch{/* Sound is optional. */}}
  function contrast(hex){const v=hex.slice(1).match(/../g).map(c=>parseInt(c,16));return (v[0]*.299+v[1]*.587+v[2]*.114)>155?'#263b3d':'#ffffff';}
  function renderHome(){
    $('levels').replaceChildren();
    LEVELS.forEach((info,i)=>{const button=document.createElement('button');button.className='level-card';button.setAttribute('aria-pressed',String(i===level));button.innerHTML=`<span class="level-top"><span class="level-number">Stig ${i+1}</span><span class="mini-grid" aria-hidden="true">${'<i></i>'.repeat(16)}</span></span><strong>${info.name}</strong><small>${info.size} × ${info.size} reitir · ${info.colors} litir</small>${i===level?'<span class="level-check" aria-hidden="true">✓</span>':''}`;button.addEventListener('click',()=>{level=i;renderHome();$('levels').children[i].focus();});$('levels').append(button);});
    $('level-label').textContent=`STIG ${level+1} · ${LEVELS[level].colors} LITIR`;
    $('puzzles').replaceChildren();let completed=0;
    for(let n=0;n<6;n++){
      const p=getPuzzle(level,n),progress=readProgress(p),count=progress.filter(Boolean).length,done=count===progress.length;
      if(done)completed++;
      const button=document.createElement('button');button.className='puzzle-card';
      const tile=document.createElement('div');tile.className='mystery-tile';tile.setAttribute('aria-hidden','true');
      if(done){const canvas=document.createElement('canvas');drawImage(canvas,p);tile.append(canvas);}else{const mark=document.createElement('span');mark.textContent='?';tile.append(mark);}
      const title=document.createElement('strong');title.textContent=done?p.name:`Leynimynd ${String(n+1).padStart(2,'0')}`;
      const label=document.createElement('small');label.textContent=done?'✓ Myndin er tilbúin':count?`${Math.floor(count/progress.length*100)}% litað · Halda áfram`:'Hvað skyldi þetta vera?';
      const bar=document.createElement('div');bar.className='card-progress';const fill=document.createElement('i');fill.style.width=`${count/progress.length*100}%`;bar.append(fill);
      button.append(tile,title,label,bar);button.addEventListener('click',()=>openPuzzle(level,n));$('puzzles').append(button);
    }
    $('collection-count').textContent=`${completed} af 6 myndum tilbúnar`;
    document.querySelector('.save-note').textContent=storageAvailable?'✓ Framvindan þín vistast í þessum vafra. Þú getur haldið áfram seinna.':'Vafrinn getur ekki vistað framvinduna. Hafðu síðuna opna til að halda áfram.';
  }
  function openPuzzle(l,n){
    level=l;puzzle=getPuzzle(l,n);filled=readProgress(puzzle);selected=0;hints=false;zoom=1;focusIndex=0;painting=false;
    // Prefer the first unfinished color when resuming.
    const remaining=puzzle.values.find((c,i)=>!filled[i]);if(remaining!==undefined)selected=remaining;
    $('home').hidden=true;$('game').hidden=false;$('celebration').hidden=true;
    $('puzzle-title').textContent=`Leynimynd ${String(n+1).padStart(2,'0')}`;
    $('game-level').textContent=`Stig ${l+1}`;$('game-size').textContent=`${puzzle.size} × ${puzzle.size} · ${puzzle.palette.length} litir`;
    $('hint').setAttribute('aria-pressed','false');$('board').style.setProperty('--size',puzzle.size);$('board').style.width='100%';
    $('board').setAttribute('aria-rowcount',puzzle.size);$('board').setAttribute('aria-colcount',puzzle.size);$('board').replaceChildren();cells=[];
    for(let y=0;y<puzzle.size;y++){
      const row=document.createElement('div');row.className='board-row';row.setAttribute('role','row');row.setAttribute('aria-rowindex',y+1);
      for(let x=0;x<puzzle.size;x++){
        const i=y*puzzle.size+x,cell=document.createElement('button');cell.className='cell';cell.dataset.index=i;cell.setAttribute('role','gridcell');cell.setAttribute('aria-colindex',x+1);cell.tabIndex=i===0?0:-1;cell.style.setProperty('--fill',puzzle.palette[puzzle.values[i]]);cell.textContent=puzzle.values[i]+1;
        cell.addEventListener('focus',()=>setFocus(i,false));row.append(cell);cells.push(cell);updateCell(i);
      }$('board').append(row);
    }
    renderPalette();updateProgress(false);window.scrollTo({top:0,behavior:'instant'});$('back').focus();
  }
  function updateCell(i){const cell=cells[i];cell.classList.toggle('filled',filled[i]);cell.classList.toggle('hint',hints&&puzzle.values[i]===selected&&!filled[i]);cell.setAttribute('aria-label',`Röð ${Math.floor(i/puzzle.size)+1}, dálkur ${i%puzzle.size+1}, númer ${puzzle.values[i]+1}${filled[i]?', litað':''}`);cell.setAttribute('aria-readonly',String(filled[i]));}
  function remainingCounts(){const result=Array(puzzle.palette.length).fill(0);puzzle.values.forEach((c,i)=>{if(!filled[i])result[c]++;});return result;}
  function renderPalette(){
    $('palette').replaceChildren();paletteButtons=[];
    puzzle.palette.forEach((color,i)=>{const button=document.createElement('button');button.className='color-button';button.style.setProperty('--swatch',color);button.style.setProperty('--on-swatch',contrast(color));const number=document.createElement('span');number.textContent=i+1;const count=document.createElement('small');button.append(number,count);button.addEventListener('click',()=>selectColor(i));paletteButtons.push(button);$('palette').append(button);});updatePalette();
  }
  function updatePalette(){const counts=remainingCounts();paletteButtons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===selected));button.setAttribute('aria-label',`Litur ${i+1}, ${counts[i]} reitir eftir`);button.classList.toggle('done',counts[i]===0);button.querySelector('small').textContent=counts[i]===0?'✓':counts[i];});$('selected-label').textContent=`Númer ${selected+1}`;}
  function selectColor(i){selected=i;updatePalette();if(hints)cells.forEach((_,index)=>updateCell(index));announce(`Litur ${i+1} valinn.`);}
  function paint(i){
    if(!puzzle||filled[i]||totalFilled()===filled.length)return;
    if(puzzle.values[i]!==selected){const cell=cells[i];cell.classList.remove('wrong');void cell.offsetWidth;cell.classList.add('wrong');$('board-status').textContent=`Veldu lit ${puzzle.values[i]+1} fyrir þennan reit.`;return;}
    filled[i]=true;updateCell(i);updatePalette();updateProgress(true);persist();if(totalFilled()<filled.length)tone();
  }
  function updateProgress(celebrate){
    const count=totalFilled(),done=count===filled.length,percent=Math.floor(count/filled.length*100);
    $('progress').value=percent;$('progress-label').textContent=`${percent}%`;$('cell-count').textContent=`${count} af ${filled.length} reitum litaðir`;
    $('board').classList.toggle('complete',done);$('celebration').hidden=!done;$('hint').disabled=done;
    $('board-status').textContent=done?'Leynimyndin er komin í ljós!':'Hvaða mynd kemur í ljós?';
    $('game-instruction').textContent=done?'Þú kláraðir alla reitina. Sjáðu hvað kom í ljós!':'Veldu lit og litaðu reiti með sama númeri.';
    if(done){$('puzzle-title').textContent=puzzle.name;$('done-title').textContent=puzzle.name+'!';$('next').textContent=puzzle.number<5?'Næsta leynimynd →':'Velja aðra mynd →';if(celebrate){tone(true);announce(`Vel gert! Myndin er ${puzzle.name}. Allir reitir litaðir.`);$('celebration').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});}}
    else if(celebrate&&count%10===0)announce(`${percent}% litað.`);
  }
  function setFocus(i,move=true){if(cells[focusIndex])cells[focusIndex].tabIndex=-1;focusIndex=i;cells[i].tabIndex=0;if(move)cells[i].focus({preventScroll:true});}
  function drawImage(canvas,p,scale=1){canvas.width=p.size*scale;canvas.height=p.size*scale;const ctx=canvas.getContext('2d');p.values.forEach((c,i)=>{ctx.fillStyle=p.palette[c];ctx.fillRect(i%p.size*scale,Math.floor(i/p.size)*scale,scale,scale);});}
  function goHome(){persist();puzzle=null;$('game').hidden=true;$('home').hidden=false;renderHome();window.scrollTo({top:0,behavior:'instant'});$('levels').children[level].focus();}
  function updateZoom(delta){zoom=Math.max(1,Math.min(3,zoom+delta));$('board').style.width=`${zoom*100}%`;$('zoom-out').disabled=zoom<=1;$('zoom-in').disabled=zoom>=3;}
  $('board').addEventListener('pointerdown',event=>{if(event.button!==0)return;const cell=event.target.closest('.cell');if(!cell)return;event.preventDefault();painting=true;dragPointer=event.pointerId;lastPaint=Number(cell.dataset.index);setFocus(lastPaint);$('board').setPointerCapture(event.pointerId);paint(lastPaint);});
  $('board').addEventListener('pointermove',event=>{if(!painting||dragPointer!==event.pointerId)return;const cell=document.elementFromPoint(event.clientX,event.clientY)?.closest('.cell');if(cell&&$('board').contains(cell)){const i=Number(cell.dataset.index);if(i!==lastPaint){lastPaint=i;paint(i);}}});
  function stopPainting(){painting=false;dragPointer=null;lastPaint=-1;}
  $('board').addEventListener('pointerup',stopPainting);$('board').addEventListener('pointercancel',stopPainting);$('board').addEventListener('lostpointercapture',stopPainting);window.addEventListener('blur',stopPainting);
  // Supports keyboard activation and assistive technologies that dispatch click only.
  $('board').addEventListener('click',event=>{if(event.detail===0){const cell=event.target.closest('.cell');if(cell)paint(Number(cell.dataset.index));}});
  $('board').addEventListener('keydown',event=>{if(!puzzle)return;const s=puzzle.size;let next=focusIndex;switch(event.key){case'ArrowRight':next=Math.min(cells.length-1,focusIndex+1);break;case'ArrowLeft':next=Math.max(0,focusIndex-1);break;case'ArrowDown':next=Math.min(cells.length-1,focusIndex+s);break;case'ArrowUp':next=Math.max(0,focusIndex-s);break;case'Home':next=event.ctrlKey?0:Math.floor(focusIndex/s)*s;break;case'End':next=event.ctrlKey?cells.length-1:Math.floor(focusIndex/s)*s+s-1;break;default:return;}event.preventDefault();setFocus(next);cells[next].scrollIntoView({block:'nearest',inline:'nearest'});});
  document.addEventListener('keydown',event=>{if(!puzzle||$('restart-dialog').open||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select'))return;const n=event.key==='0'?9:Number(event.key)-1;if(/^[0-9]$/.test(event.key)&&n<puzzle.palette.length){event.preventDefault();selectColor(n);}});
  $('hint').addEventListener('click',()=>{hints=!hints;$('hint').setAttribute('aria-pressed',String(hints));cells.forEach((_,i)=>updateCell(i));});
  $('back').addEventListener('click',goHome);document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();if(puzzle)goHome();else window.scrollTo({top:0,behavior:'smooth'});});
  $('sound').addEventListener('click',()=>{soundOn=!soundOn;updateSound();persist();if(soundOn)tone();});
  function updateSound(){$('sound').setAttribute('aria-pressed',String(soundOn));$('sound').setAttribute('aria-label',soundOn?'Slökkva á hljóði':'Kveikja á hljóði');$('sound').querySelector('span').textContent=soundOn?'Hljóð á':'Hljóð af';}
  $('zoom-in').addEventListener('click',()=>updateZoom(.5));$('zoom-out').addEventListener('click',()=>updateZoom(-.5));
  $('restart').addEventListener('click',()=>{$('restart-dialog').showModal();$('cancel-restart').focus();});$('cancel-restart').addEventListener('click',()=>$('restart-dialog').close());
  $('confirm-restart').addEventListener('click',()=>{filled=Array(filled.length).fill(false);persist();$('restart-dialog').close();openPuzzle(level,puzzle.number);});
  $('next').addEventListener('click',()=>{if(puzzle.number<5)openPuzzle(level,puzzle.number+1);else goHome();});
  $('download').addEventListener('click',()=>{if(totalFilled()!==filled.length)return;const canvas=document.createElement('canvas');drawImage(canvas,puzzle,Math.ceil(800/puzzle.size));canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`leynilitir-stig-${level+1}-mynd-${puzzle.number+1}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),5000);},'image/png');});
  window.addEventListener('pagehide',persist);updateSound();renderHome();
})();

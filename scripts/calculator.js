// Minimal scientific calculator core + UI wiring
(function(){
  // Utility: tokenize expression into numbers, functions, operators, parentheses
  function tokenize(input){
    const tokens = [];
    const re = /\s*([0-9]*\.?[0-9]+|pi|[a-zA-Z_]+|\^|\+|\-|\*|\/|%|\(|\)|\.|,)/g;
    let m;
    while((m = re.exec(input)) !== null){
      tokens.push(m[1]);
    }
    return tokens;
  }

  const ops = {
    '+':{prec:2,assoc:'L',fn:(a,b)=>a+b},
    '-':{prec:2,assoc:'L',fn:(a,b)=>a-b},
    '*':{prec:3,assoc:'L',fn:(a,b)=>a*b},
    '/':{prec:3,assoc:'L',fn:(a,b)=>a/b},
    '%':{prec:3,assoc:'L',fn:(a,b)=>a%b},
    '^':{prec:4,assoc:'R',fn:(a,b)=>Math.pow(a,b)}
  };

  const funcs = {
    sin: (x)=>Math.sin(x), cos: (x)=>Math.cos(x), tan: (x)=>Math.tan(x),
    asin: (x)=>Math.asin(x), acos: (x)=>Math.acos(x), atan: (x)=>Math.atan(x),
    ln: (x)=>Math.log(x), log: (x)=>Math.log10 ? Math.log10(x) : Math.log(x)/Math.LN10,
    exp: (x)=>Math.exp(x), sqrt: (x)=>Math.sqrt(x)
  };

  function shuntingYard(tokens){
    const output = [];
    const stack = [];
    for(let i=0;i<tokens.length;i++){
      const t = tokens[i];
      if(!isNaN(t)){ output.push(parseFloat(t)); continue }
      if(t.toLowerCase()==='pi'){ output.push(Math.PI); continue }
      if(t in funcs){ stack.push(t); continue }
      if(t in ops){
        while(stack.length){
          const top = stack[stack.length-1];
          if(top in ops && ((ops[t].assoc==='L' && ops[t].prec<=ops[top].prec) || (ops[t].assoc==='R' && ops[t].prec<ops[top].prec))){
            output.push(stack.pop());
            continue;
          }
          break;
        }
        stack.push(t);
        continue;
      }
      if(t==='('){ stack.push(t); continue }
      if(t===')'){
        while(stack.length && stack[stack.length-1] !== '('){ output.push(stack.pop()) }
        if(stack.length && stack[stack.length-1]==='(') stack.pop();
        if(stack.length && stack[stack.length-1] in funcs) output.push(stack.pop());
        continue;
      }
      // ignore commas and unknown tokens
    }
    while(stack.length) output.push(stack.pop());
    return output;
  }

  function evalRPN(rpn){
    const s = [];
    for(const t of rpn){
      if(typeof t === 'number'){ s.push(t); continue }
      if(t in ops){
        const b = s.pop(); const a = s.pop(); s.push(ops[t].fn(a,b)); continue;
      }
      if(t in funcs){
        const a = s.pop(); s.push(funcs[t](a)); continue;
      }
      // unknown
    }
    return s.pop();
  }

  function evaluate(expr){
    try{
      const tokens = tokenize(expr);
      const rpn = shuntingYard(tokens);
      const val = evalRPN(rpn);
      if(!isFinite(val)) return 'Error';
      return val;
    }catch(e){ return 'Error' }
  }

  // UI wiring
  const displayEl = document.getElementById('output');
  const historyEl = document.getElementById('history');
  const keys = document.getElementById('keys');

  let expr = '';
  let memory = 0;

  function update(){
    if(displayEl) displayEl.textContent = expr || '0';
  }

  if(keys) keys.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button'); if(!btn) return;
    const v = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if(v){ expr += v; update(); return }
    if(action){
      switch(action){
        case 'clear': expr=''; if(historyEl) historyEl.textContent=''; update(); break;
        case 'back': expr = expr.slice(0,-1); update(); break;
        case 'equals':
          if(historyEl) historyEl.textContent = expr;
          const res = evaluate(expr);
          expr = (typeof res === 'number') ? String(res) : res;
          update();
          break;
        case 'pi': expr += 'pi'; update(); break;
        case 'sqrt': expr += 'sqrt('; update(); break;
        case 'ln': expr += 'ln('; update(); break;
        case 'log': expr += 'log('; update(); break;
        case 'exp': expr += 'exp('; update(); break;
        case 'sin': expr += 'sin('; update(); break;
        case 'cos': expr += 'cos('; update(); break;
        case 'tan': expr += 'tan('; update(); break;
        case 'asin': expr += 'asin('; update(); break;
        case 'acos': expr += 'acos('; update(); break;
        case 'atan': expr += 'atan('; update(); break;
        case 'percent': expr += '%'; update(); break;
        case 'mc': memory = 0; break;
        case 'mplus': memory += (evaluate(expr) || 0); break;
        case 'mrec': expr = String(memory); update(); break;
      }
    }
  });

  // simple keyboard support
  window.addEventListener('keydown',(e)=>{
    if(e.key.match(/[0-9\.\+\-\*\/\^\%\(\)]/)){
      expr += e.key; update(); e.preventDefault(); return;
    }
    if(e.key === 'Enter'){ if(historyEl) historyEl.textContent = expr; const r=evaluate(expr); expr = (typeof r==='number')?String(r):r; update(); e.preventDefault(); return }
    if(e.key === 'Backspace'){ expr = expr.slice(0,-1); update(); e.preventDefault(); return }
    if(e.key === 'c' || e.key === 'C'){ expr=''; update(); }
  });

  // expose evaluate for tests
  window.calc = { evaluate };
  if(displayEl) update();
})();

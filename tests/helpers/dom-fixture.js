// Minimal DOM fixture for event/state integration tests; it does not render CSS.
export function createDOM(html){
 const voidTags=new Set(['input','img','meta','link','br','hr','source']);let document;
 const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
 class Element{
  constructor(tag='div',attrs={}){this.tagName=tag.toLowerCase();this.attributes={...attrs};this.children=[];this.parentElement=null;this.style={};this.listeners={};this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,x)=>x.toUpperCase())]=v;this.value=attrs.value||'';this.hidden='hidden'in attrs;this.checked='checked'in attrs;this.disabled='disabled'in attrs;this.open=false;this.classList={contains:c=>(this.attributes.class||'').split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c))this.attributes.class=((this.attributes.class||'')+' '+c).trim();},remove:c=>{this.attributes.class=(this.attributes.class||'').split(/\s+/).filter(x=>x!==c).join(' ');},toggle:(c,force)=>{const enabled=force??!this.classList.contains(c);enabled?this.classList.add(c):this.classList.remove(c);return enabled;}};}
  get className(){return this.attributes.class||'';}set className(v){this.attributes.class=v;}
  append(...items){for(const item of items){item.parentElement=this;this.children.push(item);}}
  replaceChildren(...items){this.children=[];this.append(...items);}
  get textContent(){return this.children.map(c=>c.textContent||'').join('');}set textContent(value){this.replaceChildren({textContent:String(value),nodeType:3});}
  set innerHTML(value){this.children=[];parse(value,this);}get innerHTML(){return this.textContent;}
  insertAdjacentHTML(_,value){parse(value,this);}
  setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k];}
  addEventListener(k,fn){this.listeners[k]=fn;}
  querySelectorAll(s){return descendants(this).filter(e=>matches(e,s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
  closest(s){let node=this;while(node){if(matches(node,s))return node;node=node.parentElement;}return null;}
  get elements(){return Object.fromEntries(this.querySelectorAll('[name]').map(n=>[n.attributes.name,n]));}
  showModal(){this.open=true;}close(){this.open=false;}focus(){document.activeElement=this;}
  getContext(){return null;}getBoundingClientRect(){return{width:600,height:300,left:0};}setPointerCapture(){}
 }
 const descendants=node=>node.children.flatMap(c=>c instanceof Element?[c,...descendants(c)]:[]);
 function matches(node,selector){const parts=selector.trim().split(/\s+/);if(parts.length>1){const last=parts.pop();if(!matches(node,last))return false;let parent=node.parentElement;while(parent){if(matches(parent,parts.join(' ')))return true;parent=parent.parentElement;}return false;}const s=parts[0];if(s.startsWith('#'))return node.attributes.id===s.slice(1);if(s.startsWith('.'))return node.classList.contains(s.slice(1));if(s.startsWith('[')){const m=s.match(/^\[([^=\]]+)(?:=['"]?([^'"\]]+)['"]?)?\]$/);return m&&m[1]in node.attributes&&(m[2]===undefined||node.attributes[m[1]]===m[2]);}return node.tagName===s;}
 function parse(source,root){const stack=[root];for(const token of source.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g)||[]){if(token.startsWith('<!'))continue;if(token.startsWith('</')){const tag=token.slice(2,-1).trim().toLowerCase();for(let i=stack.length-1;i>0;i--)if(stack[i].tagName===tag){stack.length=i;break;}continue;}if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};const raw=token.slice(tag.length+1).replace(/\/?\s*>$/,'');for(const m of raw.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[m[1]]=decode(m[2]??m[3]??m[4]??'');const node=new Element(tag,attrs);stack.at(-1).append(node);if(!voidTags.has(tag)&&!token.endsWith('/>'))stack.push(node);}else stack.at(-1).append({textContent:decode(token),nodeType:3});}for(const select of root.querySelectorAll('select'))if(!select.value)select.value=select.querySelector('option')?.attributes.value||'';}
 const root=new Element('root');parse(html,root);document={hidden:false,activeElement:null,querySelector:s=>root.querySelector(s),querySelectorAll:s=>root.querySelectorAll(s),createElement:t=>new Element(t),createTextNode:text=>({nodeType:3,textContent:String(text)}),addEventListener(){}};
 return document;
}

import { readFile, writeFile } from 'node:fs/promises'
const language=process.argv[2]
if(!['en','uz'].includes(language))throw new Error('Expected en or uz')
const keys=JSON.parse(await readFile(new URL('../src/data/ui-keys.json',import.meta.url),'utf8')).filter(x=>/[А-Яа-яЁё]/.test(x))
const output={}
for(let start=0;start<keys.length;start+=12){
  const batch=keys.slice(start,start+12)
  const q=batch.map((x,i)=>`@@@${i}@@@\n${x}`).join('\n')
  const url=new URL('https://translate.googleapis.com/translate_a/single')
  url.search=new URLSearchParams({client:'gtx',sl:'ru',tl:language,dt:'t',q}).toString()
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)})
  if(!response.ok)throw new Error(`HTTP ${response.status}`)
  const translated=(await response.json())[0].map(x=>x[0]).join('')
  const parts=[...translated.matchAll(/@@@(\d+)@@@\s*([\s\S]*?)(?=@@@\d+@@@|$)/g)]
  if(parts.length===batch.length&&parts.every((p,i)=>Number(p[1])===i)) batch.forEach((x,i)=>output[x]=parts[i][2].trim())
  else for(const x of batch){const single=new URL('https://translate.googleapis.com/translate_a/single');single.search=new URLSearchParams({client:'gtx',sl:'ru',tl:language,dt:'t',q:x}).toString();const v=await(await fetch(single)).json();output[x]=v[0].map(y=>y[0]).join('').trim()}
}
await writeFile(new URL(`../src/data/ui-${language}.json`,import.meta.url),JSON.stringify(output,null,2))
console.log(language,Object.keys(output).length)

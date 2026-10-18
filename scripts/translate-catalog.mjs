import { readFile, writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'

const source = JSON.parse(await readFile(new URL('../src/data/exercises.json', import.meta.url), 'utf8'))
const language = process.argv[2]
if (!['ru', 'uz'].includes(language)) throw new Error('Expected ru or uz')
const output = new URL(`../src/data/translations-${language}.json`, import.meta.url)
let result = {}
try { result = JSON.parse(await readFile(output, 'utf8')) } catch {}

const fields = source.flatMap(e => [{ id:e.id, type:'name', index:0, text:e.name }, ...e.instructions.map((text,index) => ({ id:e.id, type:'step', index, text }))])
const pending = fields.filter(f => f.type === 'name' ? !result[f.id]?.name : !result[f.id]?.instructions?.[f.index])
const batches = []
let batch = [], length = 0
for (const field of pending) {
  if (batch.length && (length + field.text.length > 2400 || batch.length >= 16)) { batches.push(batch); batch = []; length = 0 }
  batch.push(field); length += field.text.length + 24
}
if (batch.length) batches.push(batch)
console.log(language, 'fields', pending.length, 'batches', batches.length)

function unpack(response) { return response[0].map(x => x[0]).join('') }
async function translate(batch) {
  if (batch.length === 1) {
    const url = new URL('https://translate.googleapis.com/translate_a/single')
    url.search = new URLSearchParams({ client:'gtx', sl:'en', tl:language, dt:'t', q:batch[0].text }).toString()
    for (let attempt=0;attempt<5;attempt++) {
      try { const response=await fetch(url,{signal:AbortSignal.timeout(30000)}); if(!response.ok)throw new Error(`HTTP ${response.status}`); return [unpack(await response.json()).trim()] }
      catch(error) { if(attempt===4)throw error; await delay(1000*2**attempt) }
    }
  }
  const input = batch.map((f,i) => `@@@${i}@@@\n${f.text}`).join('\n')
  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.search = new URLSearchParams({ client:'gtx', sl:'en', tl:language, dt:'t', q:input }).toString()
  for (let attempt=0; attempt<5; attempt++) {
    try {
      const response = await fetch(url, { headers:{ 'User-Agent':'Mozilla/5.0' }, signal:AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const translated = unpack(await response.json())
      const parts = [...translated.matchAll(/@@@(\d+)@@@\s*([\s\S]*?)(?=@@@\d+@@@|$)/g)]
      if (parts.length !== batch.length || parts.some((p,i) => Number(p[1]) !== i || !p[2].trim())) return [...await translate(batch.slice(0,Math.ceil(batch.length/2))),...await translate(batch.slice(Math.ceil(batch.length/2)))]
      return parts.map(p => p[2].trim())
    } catch (error) { if (attempt === 4) throw error; await delay(1000 * 2 ** attempt) }
  }
}

let next = 0, completed = 0
async function worker() {
  while (next < batches.length) {
    const current = next++
    const translated = await translate(batches[current])
    translated.forEach((text,i) => {
      const field = batches[current][i]
      result[field.id] ??= { name:'', instructions:[] }
      if (field.type === 'name') result[field.id].name = text
      else result[field.id].instructions[field.index] = text
    })
    completed++
    if (completed % 20 === 0 || completed === batches.length) { await writeFile(output, JSON.stringify(result)); console.log(language, completed, '/', batches.length) }
    await delay(150)
  }
}
await Promise.all(Array.from({ length:4 }, worker))
await writeFile(output, JSON.stringify(result))
console.log('done', language, Object.keys(result).length)

// Convert the researched CSV into a browser-local content table.
// The UT game supplies its own odds, stat model, and simulated USD wages.
'use strict';
const fs=require('node:fs');
const text=fs.readFileSync(require('node:path').join(__dirname,'../docs/research/reference/companies.csv'),'utf8');
const rows=[];let row=[],field='',quoted=false;
for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(field);field='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(Boolean))rows.push(row);row=[];field='';}
  else field+=c;
}
if(field||row.length){row.push(field);rows.push(row);}
const header=rows.shift(),wages=[0,15,18,22,27,33,41,52,68,90,120];
const axisMap={systems:0,product:1,aiData:2,quant:3,hardware:4,mechanical:4,bioNano:4};
const result=rows.map((cells,index)=>{
  const source=Object.fromEntries(header.map((h,i)=>[h,cells[i]]));
  const axes=[...new Set(source.topAxes.split('/').map(a=>axisMap[a]).filter(a=>a!==undefined))];
  if(!axes.length)axes.push(1,5,6);
  const prestige=Number(source.prestige),boost=Array(7).fill(0);
  axes.forEach((a,i)=>boost[a]=i===0?5:2);boost[5]=1;boost[6]=1;
  return {id:`company-${String(index+1).padStart(3,'0')}`,name:source.company,role:source.role,city:source.location,
    prestige,difficulty:Number(source.selectivity),survival:source.survivalJob==='true',axes,axis:axes[0],
    pay:wages[prestige]+(/Research|Quant|Trading/.test(source.role)&&prestige>=6?5:0),boost};
});
process.stdout.write(JSON.stringify(result));

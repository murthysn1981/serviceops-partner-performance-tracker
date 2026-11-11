const demoCalls = [
  {call_id:"CALL-1001",partner:"Gayatri Infotech",region:"Rajahmundry",allocated_date:"2026-11-07",closed_date:"2026-11-08",status:"Closed",sla_days:2},
  {call_id:"CALL-1002",partner:"Gayatri Infotech",region:"Rajahmundry",allocated_date:"2026-11-06",closed_date:"",status:"Pending",sla_days:1},
  {call_id:"CALL-1003",partner:"Gayatri Infotech",region:"Rajahmundry",allocated_date:"2026-11-10",closed_date:"",status:"Pending",sla_days:2},
  {call_id:"CALL-1004",partner:"Gayatri Infotech",region:"Rajahmundry",allocated_date:"2026-11-03",closed_date:"2026-11-06",status:"Closed",sla_days:2},
  {call_id:"CALL-1005",partner:"Gayatri Infotech",region:"Rajahmundry",allocated_date:"2026-11-08",closed_date:"",status:"Pending",sla_days:2},
  {call_id:"CALL-2001",partner:"Global Computer Services",region:"Eluru",allocated_date:"2026-11-08",closed_date:"2026-11-09",status:"Closed",sla_days:2},
  {call_id:"CALL-2002",partner:"Global Computer Services",region:"Eluru",allocated_date:"2026-11-09",closed_date:"",status:"Pending",sla_days:2},
  {call_id:"CALL-2003",partner:"Global Computer Services",region:"Eluru",allocated_date:"2026-11-04",closed_date:"2026-11-05",status:"Closed",sla_days:2},
  {call_id:"CALL-2004",partner:"Global Computer Services",region:"Eluru",allocated_date:"2026-11-02",closed_date:"",status:"Pending",sla_days:2},
  {call_id:"CALL-3001",partner:"Sample Partner C",region:"Vijayawada",allocated_date:"2026-11-10",closed_date:"2026-11-10",status:"Closed",sla_days:1}
];
let calls = [...demoCalls];
const $ = id => document.getElementById(id);
const today = new Date(); today.setHours(0,0,0,0);
function parseDate(value){ if(!value) return null; const d=new Date(value+"T00:00:00"); return Number.isNaN(d.getTime())?null:d; }
function daysBetween(a,b){ return Math.max(0,Math.floor((b-a)/86400000)); }
function details(call){
  const allocated=parseDate(call.allocated_date);
  const closed=parseDate(call.closed_date);
  const end=closed || today;
  const age=allocated?daysBetween(allocated,end):0;
  const sla=Number(call.sla_days)||0;
  const isClosed=String(call.status).toLowerCase()==="closed" || !!closed;
  const overdue=!isClosed && age>sla;
  const compliant=isClosed && age<=sla;
  return {age,sla,isClosed,overdue,compliant};
}
function uniqueValues(key){return [...new Set(calls.map(c=>c[key]).filter(Boolean))].sort();}
function fillFilter(id,key){
  const select=$(id), old=select.value;
  select.innerHTML='<option value="all">All '+(key==="partner"?"partners":"regions")+'</option>';
  uniqueValues(key).forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;select.appendChild(o);});
  if([...select.options].some(o=>o.value===old)) select.value=old;
}
function filteredCalls(){
  return calls.filter(c=>($("partnerFilter").value==="all"||c.partner===$("partnerFilter").value)&&($("regionFilter").value==="all"||c.region===$("regionFilter").value));
}
function render(){
  const rows=filteredCalls(), computed=rows.map(c=>({call:c,...details(c)}));
  const closed=computed.filter(x=>x.isClosed).length;
  const pending=computed.length-closed;
  const overdue=computed.filter(x=>x.overdue).length;
  const compliant=computed.filter(x=>x.compliant).length;
  const rate=closed?Math.round(compliant/closed*100):0;
  $("totalCalls").textContent=rows.length;
  $("closedCalls").textContent=closed;
  $("pendingCalls").textContent=pending;
  $("tatRate").textContent=rate+"%";
  $("overdueCalls").textContent=overdue;
  $("closedSummary").textContent=closed;
  $("pendingSummary").textContent=pending;
  $("overdueSummary").textContent=overdue;
  $("rowCount").textContent=rows.length+" records";
  $("callsTable").innerHTML=computed.map(x=>{
    const result=x.overdue?"Overdue":x.isClosed?(x.compliant?"Within SLA":"Breached SLA"):"Within SLA";
    const cls=x.overdue?"overdue":x.isClosed?"closed":"pending";
    return `<tr><td><strong>${escapeHtml(x.call.call_id)}</strong></td><td>${escapeHtml(x.call.partner)}</td><td>${escapeHtml(x.call.region)}</td><td>${escapeHtml(x.call.allocated_date)}</td><td>${escapeHtml(x.call.status)}</td><td>${x.age}</td><td>${x.sla}</td><td><span class="pill ${cls}">${result}</span></td></tr>`;
  }).join("");
  const partnerCounts={};
  rows.forEach(c=>partnerCounts[c.partner]=(partnerCounts[c.partner]||0)+1);
  const entries=Object.entries(partnerCounts).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...entries.map(e=>e[1]));
  $("partnerChart").innerHTML=entries.length?entries.map(([name,count])=>`<div class="bar-row"><span class="bar-label" title="${escapeHtml(name)}">${escapeHtml(name)}</span><div class="bar-track"><div class="bar-fill" style="width:${count/max*100}%"></div></div><span class="bar-value">${count}</span></div>`).join(""):'<p class="hint">No records match these filters.</p>';
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function loadData(data,label){
  const required=["call_id","partner","region","allocated_date","status","sla_days"];
  if(!data.length||required.some(k=>!(k in data[0]))){alert("CSV must include: "+required.join(", "));return;}
  calls=data;
  fillFilter("partnerFilter","partner");fillFilter("regionFilter","region");
  $("dataNote").textContent=label+" · SLA is read from each row";
  render();
}
function parseCSV(text){
  const lines=text.trim().split(/\r?\n/); if(lines.length<2)return [];
  const headers=splitCSVLine(lines[0]).map(h=>h.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map(line=>{
    const values=splitCSVLine(line), obj={};
    headers.forEach((h,i)=>obj[h]=(values[i]||"").trim());
    obj.sla_days=Number(obj.sla_days);
    return obj;
  });
}
function splitCSVLine(line){
  const out=[];let value="",quoted=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&line[i+1]==='"'&&quoted){value+='"';i++;}else if(ch==='"'){quoted=!quoted;}else if(ch===","&&!quoted){out.push(value);value="";}else{value+=ch;}}
  out.push(value);return out;
}
$("partnerFilter").addEventListener("change",render);
$("regionFilter").addEventListener("change",render);
$("resetBtn").addEventListener("click",()=>loadData([...demoCalls],"Showing sample data"));
$("csvFile").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{loadData(parseCSV(await file.text()),"Uploaded: "+file.name);}catch(err){alert("Could not read this CSV file.");}
  e.target.value="";
});
fillFilter("partnerFilter","partner");fillFilter("regionFilter","region");render();

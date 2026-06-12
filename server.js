
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3090;
const TOKEN = process.env.PAL_BRIDGE_TOKEN || 'CHANGE_ME_SECURELY';
const POLICY_FILE = path.join(__dirname,'policies','commands-policy.json');
const ROLES_FILE = path.join(__dirname,'policies','roles-policy.json');
const JOBS_FILE = path.join(__dirname,'storage','jobs.json');
const STATE_FILE = path.join(__dirname,'storage','state.json');
const IDEMPOTENCY_FILE = path.join(__dirname,'storage','idempotency.json');
const AUDIT_LOG = path.join(__dirname,'storage','audit.log');

function readJson(file, fallback){ try { return JSON.parse(fs.readFileSync(file,'utf-8')); } catch { return fallback; } }
function writeJson(file,obj){ fs.writeFileSync(file, JSON.stringify(obj,null,2), 'utf-8'); }
function audit(entry){ fs.appendFileSync(AUDIT_LOG, JSON.stringify({ ...entry, at:new Date().toISOString() })+'\n'); }
function policy(){ return readJson(POLICY_FILE,{allowedCommands:[]}); }
function roles(){ return readJson(ROLES_FILE,{roles:[]}); }
function jobs(){ return readJson(JOBS_FILE,[]); }
function saveJobs(list){ writeJson(JOBS_FILE,list); }
function state(){ return readJson(STATE_FILE,{emergencyStop:false,lastChangedAt:null,reason:null}); }
function saveState(v){ writeJson(STATE_FILE,v); }
function idem(){ return readJson(IDEMPOTENCY_FILE,{}); }
function saveIdem(v){ writeJson(IDEMPOTENCY_FILE,v); }
function auth(req,res,next){ const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'').trim(); if(!token||token!==TOKEN){ audit({type:'auth_failed',ip:req.ip}); return res.status(401).json({error:'غير مصرح.'}); } next(); }
function authorize(commandName, roleName){ const role=(roles().roles||[]).find(r=>r.name===roleName); if(!role) return {ok:false,reason:'الدور غير معروف.'}; if((role.allowedCommands||[]).includes('*')) return {ok:true}; if((role.allowedCommands||[]).includes(commandName)) return {ok:true}; return {ok:false,reason:'الأمر غير مسموح لهذا الدور.'}; }
function commandAllowed(name){ return (policy().allowedCommands||[]).find(c=>c.name===name); }
function emergencyAllows(name){ const safe=['health_check','validate_policy','get_audit_tail','clear_emergency_stop']; const s=state(); if(!s.emergencyStop) return true; return safe.includes(name); }
function remember(requestId, result){ if(!requestId) return; const s=idem(); s[requestId]={at:new Date().toISOString(), result}; saveIdem(s); }
function recall(requestId){ if(!requestId) return null; return idem()[requestId]||null; }
const handlers = {
  health_check: async () => ({ ok:true, service:'pal-final-enterprise-project', mode:'safe-allowlist-rbac-queue-emergency', arbitraryShell:false }),
  validate_policy: async () => ({ ok:true, rule:'اعتمد ← أصلح ← أكمل', commands:(policy().allowedCommands||[]).map(c=>c.name), roles:(roles().roles||[]).map(r=>r.name) }),
  summarize_runtime_status: async () => ({ ok:true, state:state(), jobsCount:jobs().length, bridgeMode:'final-enterprise-project' }),
  check_eschool_readiness: async (payload) => ({ ok:true, status:'integration-ready-not-live', hasBaseUrl:!!payload?.baseUrl, note:'يلزم اعتماد رسمي ووثائق صحيحة قبل التفعيل الحي.' }),
  ai_continuity_plan: async (payload) => ({ ok:true, primary:payload?.primary||'Microsoft/Azure', secondary:payload?.secondary||'Google', third:payload?.third||'Local', fallback:payload?.fallback||'Local Rule Engine' }),
  create_job: async (payload) => { const reqId=payload?.requestId||null; const cached=recall(reqId); if(cached) return {ok:true,idempotent:true,cached}; const list=jobs(); const job={id:'job_'+Date.now(),kind:payload?.kind||'generic',payload:payload||{},status:'queued',attempts:0,createdAt:new Date().toISOString(),lastError:null}; list.push(job); saveJobs(list); const result={ok:true,job}; remember(reqId,result); return result; },
  list_jobs: async () => ({ ok:true, jobs:jobs() }),
  process_next_job: async () => { const list=jobs(); const next=list.find(j=>j.status==='queued'); if(!next) return {ok:true,message:'لا توجد مهام في الطابور.'}; next.attempts=(next.attempts||0)+1; next.status='done'; next.finishedAt=new Date().toISOString(); saveJobs(list); return {ok:true,processed:next}; },
  retry_failed_job: async (payload) => { const list=jobs(); const j=list.find(x=>x.id===payload?.jobId && x.status==='failed'); if(!j) return {ok:false,message:'لم يتم العثور على مهمة فاشلة بهذا المعرّف.'}; j.status='queued'; j.lastError=null; saveJobs(list); return {ok:true,retried:j.id}; },
  get_audit_tail: async () => { try { const text=fs.readFileSync(AUDIT_LOG,'utf-8').trim().split('\n').slice(-20).join('\n'); return {ok:true,tail:text||''}; } catch { return {ok:true,tail:''}; } },
  emergency_stop: async (payload) => { const s=state(); s.emergencyStop=true; s.lastChangedAt=new Date().toISOString(); s.reason=payload?.reason||'manual'; saveState(s); return {ok:true,emergencyStop:true,state:s}; },
  clear_emergency_stop: async () => { const s=state(); s.emergencyStop=false; s.lastChangedAt=new Date().toISOString(); saveState(s); return {ok:true,emergencyStop:false,state:s}; }
};
app.get('/health',(req,res)=>res.json({ok:true,service:'pal-final-enterprise-project'}));
app.post('/api/commands/run', auth, async (req,res)=>{ const {commandName,payload}=req.body||{}; const roleName=String(req.headers['x-role-name']||'viewer'); audit({type:'command_requested',commandName,roleName}); if(!commandAllowed(commandName)) return res.status(403).json({error:'الأمر غير موجود في السياسة.'}); const authz=authorize(commandName,roleName); if(!authz.ok) return res.status(403).json({error:authz.reason}); if(!emergencyAllows(commandName)) return res.status(423).json({error:'النظام في وضع الإيقاف الطارئ. الأمر الحالي غير مسموح.'}); try { const h=handlers[commandName]; if(!h) return res.status(500).json({error:'لا يوجد معالج آمن لهذا الأمر.'}); const result=await h(payload||{}); audit({type:'command_succeeded',commandName,roleName}); return res.json(result); } catch(err){ audit({type:'command_failed',commandName,roleName,error:String(err.message||err)}); return res.status(500).json({error:'فشل تنفيذ الأمر الآمن.'}); } });
app.listen(PORT,()=>console.log('PAL final enterprise project on :'+PORT));

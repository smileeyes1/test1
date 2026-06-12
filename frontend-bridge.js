
window.PAL_BRIDGE=(function(){
  async function run(baseUrl, token, role, commandName, payload){
    const res = await fetch(String(baseUrl).replace(/\/$/, '') + '/api/commands/run', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'X-Role-Name':role||'viewer'},
      body: JSON.stringify({ commandName, payload: payload || {} })
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || ('HTTP '+res.status));
    return data;
  }
  return {run};
})();

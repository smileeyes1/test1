
window.PAL_AGENT=(function(){
  function makeDraggable(panel,header){let active=false,startX=0,startY=0,originX=0,originY=0;header.addEventListener('pointerdown',e=>{active=true;startX=e.clientX;startY=e.clientY;const rect=panel.getBoundingClientRect();originX=rect.left;originY=rect.top;});window.addEventListener('pointermove',e=>{if(!active) return;panel.style.left=(originX+(e.clientX-startX))+'px';panel.style.top=(originY+(e.clientY-startY))+'px';panel.style.bottom='auto';});window.addEventListener('pointerup',()=>{active=false;});}
  function log(el,msg){const time=new Date().toLocaleTimeString('ar');el.textContent += '['+time+'] '+msg+'
';el.scrollTop = el.scrollHeight;}
  function helpText(){return ['الأوامر المتاحة:','/generate lesson','/generate worksheet','/generate test','/improve','/autopack','/save','/load','/export','/print','/bridge health','/bridge audit','/status','/help'].join('
')}
  async function execute(cmd, ctx){const c=(cmd||'').trim();if(!c) return 'لم يتم إدخال أمر.';const out=ctx.output;const v=ctx.getVals();
    if(c==='/help') return helpText();
    if(c==='/status') return ['حالة المشروع: نهائي مدمج.','المساعد يعمل داخل التطبيق.','الجسر الخلفي يُفعل عند تشغيل backend.','القاعدة: اعتمد ← أصلح ← أكمل'].join('
');
    if(c==='/save'){ctx.saveLocal(); return 'تم حفظ الحالة محليًا.';}
    if(c==='/load'){ctx.loadLocal(false); return 'تمت استعادة الحالة المحفوظة.';}
    if(c==='/export'){ctx.exportJson(); return 'تم تصدير ملف البيانات.';}
    if(c==='/print'){window.print(); return 'تم إرسال أمر الطباعة.';}
    if(c==='/improve'){const html=await window.PAL_AI.callAI(v,'improve',out,ctx.aiStatus); out.innerHTML += html; ctx.hdr(); return 'تم تنفيذ تحسين النص.';}
    if(c==='/autopack'){const html=await window.PAL_AI.callAI(v,'autopack',out,ctx.aiStatus); out.innerHTML = html; ctx.hdr(); return 'تمت أتمتة الحقيبة.';}
    if(c==='/generate lesson'){ctx.setOutputMode('lessonPlan'); return 'تم ضبط الوضع إلى تحضير مباشر.';}
    if(c==='/generate worksheet'){ctx.setOutputMode('worksheet'); return 'تم ضبط الوضع إلى ورقة مباشرة.';}
    if(c==='/generate test'){ctx.setOutputMode('test'); return 'تم ضبط الوضع إلى اختبار مباشر.';}
    if(c==='/bridge health'){const data=await ctx.runBridge('health_check'); return JSON.stringify(data,null,2);}
    if(c==='/bridge audit'){const data=await ctx.runBridge('get_audit_tail'); return JSON.stringify(data,null,2);}
    return 'أمر غير معروف. اكتب /help لعرض الأوامر المتاحة.';
  }
  return {makeDraggable,log,execute};
})();

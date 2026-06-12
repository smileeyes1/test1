
window.PAL_T=(function(){
  function e(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function rule(){return `<section class="block"><h2>القاعدة التشغيلية</h2><ol><li>اعتمد المرجع المتحقق.</li><li>أصلح الصياغة والتنظيم.</li><li>أكمل العناصر العملية للطباعة والتنفيذ.</li></ol></section>`}
  function corp(s){return `<section class="block"><h2>الهوية المؤسسية</h2><table><tr><th>المديرية</th><th>المدرسة</th><th>المعلم</th><th>المادة</th></tr><tr><td>${e(s.directorateName)}</td><td>${e(s.schoolName)}</td><td>${e(s.teacherName)}</td><td>${e(s.subjectName)}</td></tr></table></section>`}
  function ref(s){return `<section class="block"><h2>المقتطف المعتمد</h2><p>${e(s.pageText||'لا يوجد نص مستخرج بعد.')}</p>${s.extraNotes?`<p><strong>ملاحظات:</strong> ${e(s.extraNotes)}</p>`:''}</section>`}
  function cover(s){return `<section class="block"><h2>غلاف مؤسسي</h2><p><strong>المعلم:</strong> ${e(s.teacherName)}</p><p><strong>المدرسة:</strong> ${e(s.schoolName)}</p><p><strong>المديرية:</strong> ${e(s.directorateName)}</p><p><strong>المادة:</strong> ${e(s.subjectName)}</p><p><strong>الصف / الشعبة:</strong> ${e(s.gradeName)} ${s.sectionName?'/ '+e(s.sectionName):''}</p></section>`}
  function lessonPlan(s){return `<section class="block"><h2>تحضير درس</h2><p><strong>العنوان:</strong> ${e(s.lessonTitle)}</p><p><strong>الوحدة:</strong> ${e(s.unitTitle)}</p><p><strong>الزمن:</strong> ${e(s.lessonTime)}</p><h3>الأهداف</h3><ul><li>فهم الفكرة الأساسية.</li><li>تطبيق المهارة الرئيسة.</li><li>إظهار التعلم في نشاط أو سؤال.</li></ul><h3>الإجراءات</h3><ul><li>تهيئة مناسبة.</li><li>عرض منظم مع مثال من المرجع.</li><li>تدريب موجه ثم مستقل.</li></ul></section>`}
  function worksheet(s){return `<section class="block"><h2>ورقة عمل</h2><ol><li>اكتب الفكرة الأساسية في موضوع ${e(s.lessonTitle||'الدرس')}.</li><li>حل تدريبًا مباشرًا على المهارة.</li><li>أكمل سؤال مقارنة أو تفسير.</li><li>طبّق المهارة في مثال جديد.</li></ol></section>`}
  function test(){return `<section class="block"><h2>اختبار قصير</h2><table><tr><th>السؤال</th><th>المطلوب</th><th>الدرجة</th></tr><tr><td>1</td><td>فهم مباشر</td><td>5</td></tr><tr><td>2</td><td>تطبيق</td><td>5</td></tr><tr><td>3</td><td>تحليل / تفسير</td><td>5</td></tr></table></section>`}
  function analysis(){return `<section class="block"><h2>تحليل نتائج</h2><table><tr><th>المؤشر</th><th>القيمة</th><th>الدلالة</th></tr><tr><td>الإتقان</td><td>عالٍ / متوسط / منخفض</td><td>يُكتب الوصف هنا</td></tr></table></section>`}
  function report(s){return `<section class="block"><h2>تقرير إنجاز</h2><p>تم تنفيذ موضوع <strong>${e(s.lessonTitle||'—')}</strong> وفق الخطة الموضوعة، مع متابعة وتقويم ورصد للطلبة عند الحاجة.</p></section>`}
  function portfolio(s){return `<section class="block"><h2>ملف إنجاز المعلم</h2><ul><li>نبذة عن العمل المنفذ في ${e(s.subjectName||'المادة')}.</li><li>نماذج من التحاضير والأوراق والاختبارات.</li><li>مؤشرات القوة والتحسين.</li></ul></section>`}
  function all(s){return `${rule()}${corp(s)}${cover(s)}${ref(s)}${lessonPlan(s)}${worksheet(s)}${test()}${analysis()}${report(s)}${portfolio(s)}`}
  return {rule,corp,ref,cover,lessonPlan,worksheet,test,analysis,report,portfolio,all};
})();


window.PAL_PDF=(function(){
  const state={pdfDoc:null,currentPage:1,pageCount:0};
  async function loadPdf(file,indicator,canvas){if(!file) return;const buf=await file.arrayBuffer();const task=window.pdfjsLib.getDocument({data:buf});state.pdfDoc=await task.promise;state.pageCount=state.pdfDoc.numPages;state.currentPage=1;update(indicator);await render(indicator,canvas)}
  async function render(indicator,canvas){if(!state.pdfDoc) return;const page=await state.pdfDoc.getPage(state.currentPage);const vp=page.getViewport({scale:1.2});const ctx=canvas.getContext('2d');canvas.width=vp.width;canvas.height=vp.height;await page.render({canvasContext:ctx,viewport:vp}).promise;update(indicator)}
  async function prev(indicator,canvas){if(state.pdfDoc&&state.currentPage>1){state.currentPage--;await render(indicator,canvas)}}
  async function next(indicator,canvas){if(state.pdfDoc&&state.currentPage<state.pageCount){state.currentPage++;await render(indicator,canvas)}}
  async function extract(){if(!state.pdfDoc) throw new Error('ارفع ملف PDF أولًا.');const page=await state.pdfDoc.getPage(state.currentPage);const tc=await page.getTextContent();return tc.items.map(i=>i.str).join(' ').trim()}
  function update(indicator){indicator.textContent=state.pageCount?('الصفحة '+state.currentPage+' من '+state.pageCount):'لا يوجد ملف'}
  return {loadPdf,render,prev,next,extract,update};
})();

function $(id){return document.getElementById(id)}
function openCase(id){var d=window.REPORT_CASE_DETAILS[id];if(!d)return;var b=$('dialogBody');
var dims=d.dims.map(function(x){return '<span class="pill '+(x.scale==='0/1'?(x.score===1?'PASS':(x.score===0?'FAIL':'WAIT')):'PROVISIONAL')+'">'+x.d+' · '+x.scale+' · '+(x.score===null?'—':x.score)+'</span>'}).join(' ');
var tags=d.tags.map(function(t){return '<span class="pill">'+t+'</span>'}).join(' ');
b.innerHTML='<h3>'+d.case_id+' '+d.title+'</h3><p class="sub">'+tags+'</p><p><b>维度评分</b>：'+dims+'</p><p><b>实际结果</b>：'+d.output+'</p><p><b>执行过程</b>：'+d.process+'</p><p><b>用时</b>：'+d.time+' ｜ <b>证据</b>：'+d.evidence+'</p>';
$('caseDialog').showModal()}
function closeCaseDialog(){var dl=$('caseDialog');if(dl&&dl.open)dl.close()}
function ucTab(btn,uc){document.querySelectorAll('.usecase-tab').forEach(function(b){b.classList.remove('active')});btn.classList.add('active');document.querySelectorAll('.uc-panel').forEach(function(p){p.style.display=(p.dataset.uc===uc)?'block':'none'})}
function filterCases(){var e=$('caseSearch'),dm=$('dimFilter'),tg=$('tagFilter');var q=e?e.value.toLowerCase():'';var d=dm?dm.value:'';var t=tg?tg.value:'';var n=0;
document.querySelectorAll('#caseTable tbody tr').forEach(function(tr){var ok=(!q||tr.innerText.toLowerCase().indexOf(q)>=0)&&(!d||(tr.dataset.dims||'').split(';').indexOf(d)>=0)&&(!t||(tr.dataset.tags||'').indexOf(t)>=0);tr.style.display=ok?'':'none';if(ok)n++});
var c=$('caseCount');if(c)c.textContent='筛选出 '+n+' 条'}
if(document.readyState!=='loading')filterCases();else document.addEventListener('DOMContentLoaded',filterCases);

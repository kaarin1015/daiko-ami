// cms-loader.js — site-data.json を読み込んでページに反映する
(function(){
  fetch('/admin/site-data.json?t='+Date.now())
    .then(r=>r.ok?r.json():null)
    .then(d=>{if(d)apply(d)})
    .catch(()=>{});

  function apply(d){
    document.querySelectorAll('[data-cms]').forEach(el=>{
      const key=el.dataset.cms;
      const parts=key.split('.');
      let val=d;
      for(const p of parts){
        if(val&&val[p]!==undefined) val=val[p];
        else return;
      }
      if(typeof val==='string'&&val.trim()){
        // br タグを保持するため innerHTML を使う
        // ただし改行文字は<br>に変換
        el.innerHTML=val.replace(/\n/g,'<br>');
      }
    });
  }
})();

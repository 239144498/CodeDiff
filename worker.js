addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const html = `
  <!DOCTYPE html>
  <html lang="zh">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CodeDiff</title>
      <script>
          const savedConfig=localStorage.getItem('codeDiffConfig');const theme=savedConfig?JSON.parse(savedConfig).theme:'vs-dark';document.documentElement.style.colorScheme=theme==='vs'?'light':'dark';document.documentElement.dataset.theme=theme;
      </script>
      <style>
          *{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden}:root[data-theme='vs']{background-color:#ffffff}:root[data-theme='vs-dark']{background-color:#1e1e1e}:root[data-theme='hc-black']{background-color:#000000}.toolbar{position:fixed;top:0;left:0;right:0;padding:10px;background:#1e1e1e;z-index:100;display:flex;gap:10px;align-items:center}:root[data-theme='vs'] .toolbar{background:#f3f3f3}:root[data-theme='vs-dark'] .toolbar{background:#1e1e1e}:root[data-theme='hc-black'] .toolbar{background:#000000}:root[data-theme='vs'] .toolbar select,:root[data-theme='vs'] .toolbar button,:root[data-theme='vs'] .toolbar input{background:#ffffff;color:#000000;border:1px solid #cccccc;border-radius:4px}:root[data-theme='vs'] .toolbar select:hover,:root[data-theme='vs'] .toolbar button:hover{background:#e8e8e8}:root[data-theme='vs-dark'] .toolbar select,:root[data-theme='vs-dark'] .toolbar button,:root[data-theme='vs-dark'] .toolbar input{background:#3c3c3c;color:#ffffff;border:1px solid #555555;border-radius:4px}:root[data-theme='vs-dark'] .toolbar select:hover,:root[data-theme='vs-dark'] .toolbar button:hover{background:#4c4c4c}:root[data-theme='hc-black'] .toolbar select,:root[data-theme='hc-black'] .toolbar button,:root[data-theme='hc-black'] .toolbar input{background:#000000;color:#ffffff;border:1px solid #ffffff;border-radius:4px}:root[data-theme='hc-black'] .toolbar select:hover,:root[data-theme='hc-black'] .toolbar button:hover{background:#333333}:root[data-theme='vs'] .toolbar .separator{background:#cccccc}:root[data-theme='vs-dark'] .toolbar .separator{background:#555555}:root[data-theme='hc-black'] .toolbar .separator{background:#ffffff}.toolbar select,.toolbar button,.toolbar input{padding:5px 10px;cursor:pointer;transition:background-color 0.2s}.toolbar input[type="number"]::-webkit-inner-spin-button,.toolbar input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.toolbar input[type="number"]{-moz-appearance:textfield;width:50px;text-align:center}:root[data-theme='vs'] .shortcut-help{background:rgba(255,255,255,0.9);color:#000000;border:1px solid #cccccc}:root[data-theme='vs-dark'] .shortcut-help{background:rgba(30,30,30,0.9);color:#ffffff;border:1px solid #555555}:root[data-theme='hc-black'] .shortcut-help{background:#000000;color:#ffffff;border:1px solid #ffffff}.toolbar select,.toolbar button,.toolbar input{padding:5px 10px;background:#3c3c3c;color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer}.toolbar button:hover{background:#4c4c4c}.toolbar .separator{width:1px;height:24px;background:#555;margin:0 10px}.toolbar .font-size-control{display:flex;align-items:center;gap:5px}.toolbar .font-size-control input{width:50px;text-align:center}.toolbar input[type="number"]::-webkit-inner-spin-button,.toolbar input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.toolbar input[type="number"]{-moz-appearance:textfield}#editor-main{width:100vw;height:calc(100vh - 50px);position:fixed;top:50px;left:0;overflow:hidden}.shortcut-help{position:fixed;bottom:20px;right:20px;background:rgba(30,30,30,0.9);padding:15px;border-radius:8px;color:#fff;font-size:14px;display:none;z-index:1000}.shortcut-help.visible{display:block}.zen-mode .toolbar{display:none}#editor-main.zen-mode{height:100vh;top:0}
      </style>
  </head>
  
  <body>
      <div class="toolbar">
          <select id="language-select">
              <option value="plaintext">Plain Text</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="javascript">JavaScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="sql">SQL</option>
              <option value="matlab">MATLAB</option>
              <option value="ruby">Ruby</option>
              <option value="r">R</option>
              <option value="swift">Swift</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="csharp">C#</option>
              <option value="typescript">TypeScript</option>
              <option value="php">PHP</option>
              <option value="kotlin">Kotlin</option>
              <option value="shell">Shell</option>
              <option value="scala">Scala</option>
              <option value="perl">Perl</option>
              <option value="lua">Lua</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="xml">XML</option>
              <option value="markdown">Markdown</option>
              <option value="dockerfile">Dockerfile</option>
              <option value="ini">INI</option>
          </select>
          <div class="separator"></div>
          <button id="theme-toggle" title="">切换主题</button>
          <button id="line-numbers-toggle" title="">切换行号</button>
          <button id="zen-mode-toggle" title="">Zen模式</button>
          <div class="separator"></div>
          <div class="font-size-control">
              <button id="font-decrease" title="">A-</button>
              <input type="number" id="font-size" value="14" min="8" max="32" title="字体大小">
              <button id="font-increase" title="">A+</button>
          </div>
          <div class="separator"></div>
          <button id="copy-left" title="">复制左侧</button>
          <button id="copy-right" title="">复制右侧</button>
          <button id="clear" title="">清空</button>
          <div class="separator"></div>
          <button id="help-toggle" title="">快捷键帮助</button>
      </div>
      <div id="editor-main"></div>
      <div class="shortcut-help">
          <h3>快捷键列表</h3>
          <br>
          <div>ESC: 退出 Zen 模式<br></div>
      </div>
  
      <script src="https://fastly.jsdelivr.net/npm/monaco-editor@latest/min/vs/loader.js"></script>
      <script>
          const userPreferences={get:function(){const defaultConfig={language:'plaintext',theme:'vs-dark',fontSize:14,lineNumbers:true,zenMode:false};const savedConfig=localStorage.getItem('codeDiffConfig');return savedConfig?JSON.parse(savedConfig):defaultConfig},save:function(config){localStorage.setItem('codeDiffConfig',JSON.stringify(config))},update:function(key,value){const config=this.get();config[key]=value;this.save(config)}};require.config({paths:{'vs':'https://fastly.jsdelivr.net/npm/monaco-editor@latest/min/vs'}});require(['vs/editor/editor.main'],function(){const savedConfig=userPreferences.get();const themes=['vs','vs-dark','hc-black'];const themeNames={'vs':'浅色','vs-dark':'深色','hc-black':'高对比度'};const themeColors={'vs':{'diffEditor.insertedTextBackground':'#c8e6c9','diffEditor.removedTextBackground':'#ffcdd2','diffEditor.insertedLineBackground':'#a5d6a7','diffEditor.removedLineBackground':'#ef9a9a','diffEditorGutter.insertedLineBackground':'#a5d6a7','diffEditorGutter.removedLineBackground':'#ef9a9a'},'vs-dark':{'diffEditor.insertedTextBackground':'#1b4d1b80','diffEditor.removedTextBackground':'#4d1b1b80','diffEditor.insertedLineBackground':'#1b4d1b40','diffEditor.removedLineBackground':'#4d1b1b40','diffEditorGutter.insertedLineBackground':'#1b4d1b40','diffEditorGutter.removedLineBackground':'#4d1b1b40'},'hc-black':{'diffEditor.insertedTextBackground':'#1b4d1bcc','diffEditor.removedTextBackground':'#4d1b1bcc','diffEditor.insertedLineBackground':'#1b4d1b99','diffEditor.removedLineBackground':'#4d1b1b99','diffEditorGutter.insertedLineBackground':'#1b4d1b99','diffEditorGutter.removedLineBackground':'#4d1b1b99'}};themes.forEach(theme=>{monaco.editor.defineTheme('custom-'+theme,{base:theme,inherit:true,rules:[],colors:themeColors[theme]})});monaco.editor.setTheme('custom-'+savedConfig.theme);const editorConfig={language:savedConfig.language,originalEditable:true,fontSize:savedConfig.fontSize,wordWrap:'on',automaticLayout:true,theme:savedConfig.theme,fontFamily:'"JetBrains Mono","HarmonyOS Sans SC","Cascadia Code","Consolas","Menlo","monospace"',minimap:{enabled:true},scrollbar:{vertical:'visible',horizontal:'visible'},renderSideBySide:true,lineNumbers:savedConfig.lineNumbers?'on':'off',diffWordWrap:'on',renderIndicators:true,renderOverviewRuler:true,diffAlgorithm:'advanced',bracketPairColorization:{enabled:true},autoClosingBrackets:'always',autoClosingQuotes:'always',formatOnPaste:true,formatOnType:true,tabSize:4,scrollBeyondLastLine:false};let editor=monaco.editor.createDiffEditor(document.getElementById('editor-main'),editorConfig);let isZenMode=savedConfig.zenMode;editor.setModel({original:monaco.editor.createModel('',savedConfig.language),modified:monaco.editor.createModel('',savedConfig.language)});document.getElementById('language-select').value=savedConfig.language;document.getElementById('font-size').value=savedConfig.fontSize;if(savedConfig.zenMode){toggleZenMode()}document.getElementById('language-select').addEventListener('change',(e)=>{const language=e.target.value;const model=editor.getModel();monaco.editor.setModelLanguage(model.original,language);monaco.editor.setModelLanguage(model.modified,language);userPreferences.update('language',language)});function toggleTheme(){const currentTheme=userPreferences.get().theme;const currentIndex=themes.indexOf(currentTheme);const nextTheme=themes[(currentIndex+1)%themes.length];monaco.editor.setTheme('custom-'+nextTheme);document.documentElement.dataset.theme=nextTheme;document.documentElement.style.colorScheme=nextTheme==='vs'?'light':'dark';userPreferences.update('theme',nextTheme);document.getElementById('theme-toggle').textContent='主题:'+themeNames[nextTheme]}document.getElementById('theme-toggle').textContent='主题:'+themeNames[savedConfig.theme];let showLineNumbers=savedConfig.lineNumbers;function toggleLineNumbers(){showLineNumbers=!showLineNumbers;editor.updateOptions({lineNumbers:showLineNumbers?'on':'off'});userPreferences.update('lineNumbers',showLineNumbers)}function toggleZenMode(){isZenMode=!isZenMode;document.body.classList.toggle('zen-mode',isZenMode);document.getElementById('editor-main').classList.toggle('zen-mode',isZenMode);editor.layout();userPreferences.update('zenMode',isZenMode)}let fontSize=savedConfig.fontSize;function updateFontSize(newSize){fontSize=Math.max(8,Math.min(32,newSize));document.getElementById('font-size').value=fontSize;editor.updateOptions({fontSize:fontSize});userPreferences.update('fontSize',fontSize)}let isHelpVisible=false;function toggleHelp(){isHelpVisible=!isHelpVisible;document.querySelector('.shortcut-help').classList.toggle('visible',isHelpVisible)}document.getElementById('theme-toggle').addEventListener('click',toggleTheme);document.getElementById('line-numbers-toggle').addEventListener('click',toggleLineNumbers);document.getElementById('zen-mode-toggle').addEventListener('click',toggleZenMode);document.getElementById('font-decrease').addEventListener('click',()=>updateFontSize(fontSize-2));document.getElementById('font-increase').addEventListener('click',()=>updateFontSize(fontSize+2));document.getElementById('font-size').addEventListener('change',(e)=>updateFontSize(parseInt(e.target.value)));document.getElementById('copy-left').addEventListener('click',()=>copyText(editor.getModel().original.getValue()));document.getElementById('copy-right').addEventListener('click',()=>copyText(editor.getModel().modified.getValue()));document.getElementById('zen-mode-toggle').title='Zen模式 (ESC退出)';document.getElementById('help-toggle').addEventListener('click',toggleHelp);document.getElementById('clear').addEventListener('click',()=>{editor.getModel().original.setValue('');editor.getModel().modified.setValue('')});async function copyText(text){try{await navigator.clipboard.writeText(text)}catch(err){console.error('复制失败:',err)}}window.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&isZenMode){toggleZenMode()}if(e.ctrlKey&&e.key==='s'){e.preventDefault()}})});
      </script>
  </body>
  </html>
  `;
  
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    })
  }
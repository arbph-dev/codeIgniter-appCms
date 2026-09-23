- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/js/components/wysedit.js
- https://github.com/arbph-dev/codeIgniter-appCms/blob/main/refactoring/assets/css/components/wysedit.css




```html

<div class="cp_wysedit_zone" id="wysedit1">
  <textarea class="cp_wysedit_textarea" rows="10" placeholder="Saisir du HTML ici…">
    &lt;h3&gt;Titre exemple&lt;/h3&gt;
    &lt;p&gt;Contenu &lt;strong&gt;formaté&lt;/strong&gt; en HTML.&lt;/p&gt;
  </textarea>
  <div class="cp_wysedit_view"></div>
  <button class="cp_wysedit_toggle">Aperçu</button>
</div>                                        
<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
  <button onclick="window.eventBusPublish(null, \'wysedit:clear:wysedit1\', null)">Vider</button>
    <button onclick="window.eventBusPublish(null, \'wysedit:set:wysedit1\',\'&lt;h3&gt;Contenu injecté&lt;/h3&gt;&lt;p&gt;Via le bus d\\\'événements.&lt;/p&gt;\')">
        Injecter contenu
    </button>
</div>

```

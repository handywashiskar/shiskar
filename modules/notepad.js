export function render(app) {
  app.innerHTML = `
    <section class="notepad" style="position:fixed; bottom:20px; right:20px; width:300px; height:300px; background:#fff; border:1px solid #ccc; padding:10px; resize:both; overflow:auto; z-index:9999;">
      <h3>📝 Notepad</h3>
      <textarea style="width:100%; height:200px;" placeholder="Write your notes here..."></textarea>
      <button>Save</button>
      <button>Download PDF</button>
    </section>
  `;
}

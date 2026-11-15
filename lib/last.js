(function () {
  var slug = location.pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  if (!slug || slug.indexOf(".") !== -1) return;
  try {
    localStorage.setItem("gewu-last", JSON.stringify({ slug: slug, t: Date.now() }));
  } catch (e) {}
})();

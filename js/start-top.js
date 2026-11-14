/* Always open the site at the top (Home), never at a saved section.
   Stops the browser from jumping to #booking from an old link or from
   its remembered scroll position. Runs before the page is drawn. */
(function () {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
    window.addEventListener('load', function () { window.scrollTo(0, 0); });
})();

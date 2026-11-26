/* Roda antes da página aparecer: se o aparelho suporta WebGL, marca <html class="com3d">.
   Assim a foto de reserva do topo nem chega a ser mostrada enquanto a xícara 3D carrega. */
(function () {
  try {
    var c = document.createElement('canvas');
    if (window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))) document.documentElement.classList.add('com3d');
  } catch (e) {}
})();

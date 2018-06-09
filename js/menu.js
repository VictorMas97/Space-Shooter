var canvas;

var runGame = function()
{
  document.getElementById("theHead").style.display   = "none";
  document.getElementById("newGame").style.display   = "none";
  document.getElementById("credits").style.display   = "none";
  document.getElementById("creditBtn").style.display = "none";
  document.getElementById("main").style.display      = "block";
  canvas = document.getElementById("my_canvas");
  Init();
};

var showCredits = function()
{
 document.getElementById("theHead").style.display   = "none";
 document.getElementById("creditBtn").style.display = "none";
 document.getElementById("newGame").style.display   = "none";
 document.getElementById("credits").style.display   = "block";
 document.getElementById("backBtn").style.display   = "block";
};

var goBack = function()
{
  document.getElementById("backBtn").style.display   = "none";
  document.getElementById("credits").style.display   = "none";
  document.getElementById("theHead").style.display   = "block";
  document.getElementById("newGame").style.display   = "block";
  document.getElementById("creditBtn").style.display = "block";
};


var positioning = "abs";
var dad = "classic"
var mainMode = "svg_hotspots";

var textMaxLength = 0;
var textMaxChars = 0;
var currentEditor = null;

var bgImage = null;

var svg = null;




function initApplication() {
    $( "#tabs" ).tabs();
   
    // fix the classes
    $( ".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *" )
    .removeClass( "ui-corner-all ui-corner-top" )
    .addClass( "ui-corner-bottom" );
    // move the nav to the bottom
    $( ".tabs-bottom .ui-tabs-nav" ).appendTo( ".tabs-bottom" );
    
    $("#tabs").on( "tabsactivate", function( event, ui ) {
      
      var pid = ui.newPanel.attr("id")
            
      if (pid == "tabs-2") generatePreview()
      if (pid == "tabs-3") generateCode()
      //if (ui.newTab) 
    //
    } 
    );
    document.getElementById("edit_panes").style.display = "block"
    document.getElementById("form_absolute").style.display = "block"
    
    $( "#dialog-setBgImage" ).dialog({
      autoOpen: false,
      height: 250,
      width: 800,
      modal: true,
      resizable: false,
      buttons: {
      
      "Nahrát obrázek": function() {
        loadImage(); 
        $( this ).dialog( "close" );
      },
        "Zavřít": function() { $( this ).dialog( "close" ); }
      },
      close: function() {
        $("#pic_url").val( "" ).removeClass( "ui-state-error" );
      }
    });
    
    $( ".ui-right" ).draggable()
    
    document.getElementById("shape-ellipse").checked = true;
    
    loadImage("http://www.pathpedia.com/education/eatlas/histology/blood_cells/blood-cells-%5B1-ce16h-1%5D.jpeg?Width=600&Height=450&Format=4")
}
 
function resetAll() {
   
   
   
    document.getElementById("edit_title").innerHTML = ""
    document.getElementById("edit_task").innerHTML = ""
    
    var bgImg = document.querySelector("#img_placeholder img");
    if (bgImg) bgImg.parentNode.removeChild(bgImg)
    var bgInit = document.getElementById("bg-init");
    bgInit.style.display = "block";
    
    $( "#tabs" ).tabs( "option", "active", 0 );
   
   
   // $("#br-init").html("").click(function() { $('#dialog-setBgImage' ).dialog( 'open' ) })
    
}

function gotoMainSelect() {
    document.getElementById("main_select").style.display = "block"
    document.getElementById("edit_panes").style.display = "none"
}




// The instanceReady event is fired, when an instance of CKEditor has finished
// its initialization.
CKEDITOR.on( 'instanceReady', function( ev ) {
	// Show the editor name and description in the browser status bar.
	document.getElementById( 'eMessage' ).innerHTML = 'Instance <code>' + ev.editor.name + '<\/code> loaded.';

	// Show this sample buttons.
	//document.getElementById( 'eButtons' ).style.display = 'block';
});

var configEdit = { 
  allowedContent: true,
  toolbar: [
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
					[ 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink' ],
					[ 'FontSize', 'TextColor', 'BGColor' ] ,
				  { name: 'paragraph', groups: [ 'indent', 'blocks', 'align'], items: [ 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
				  { name: 'insert', items : [ 'Table','HorizontalRule','SpecialChar'] },
				  [ 'NewPage']
				],  
  on: {
    focus: onFocus,
    blur: onBlur,
    
        		
    selectionChange: function(evt) {
             document.getElementById("testitem_content").style.display = "none";
           var selected = evt.editor.getSelection().getStartElement().$
           var name = selected.nodeName.toLowerCase()
          document.getElementById( 'eMessage' ).innerHTML = selected.nodeName + "." + selected.className 
          // document.getElementById("txtArea").value = selected.nodeName.toLocaleLowerCase() + "." + selected.className
          if (selected.className.indexOf("testitem") > -1)  {
             if (name == "img") {
               var novy = document.createElement("span");
                novy.className = selected.className;
                var obsah = "text"
                if (selected.hasAttribute("data-type") && selected.getAttribute("data-type") == "n") obsah = "123"
                novy.innerHTML = "<span class='option' data-type='" + selected.getAttribute("data-type") + "'>" + obsah + "</span>";
                selected.parentNode.insertBefore(novy, selected);
                selected.parentNode.removeChild(selected);
                
             }
          }
          if (name == "span" && selected.className == "option") {
                actSelected = selected.parentNode; //alert("Option")
                readTestitem(selected.parentNode);
             }
             if (name == "span" && selected.className.indexOf("testitem") > -1) {
                actSelected = selected;
                readTestitem(selected);
                
             }
          if (name == "textarea" && selected.className.indexOf("testitem") > -1) {
                actSelected = selected;
                readTestitem(selected);
                
             } 
          
           
          document.getElementById( 'eMessage' ).innerHTML = name + "." + selected.$.className
           
       }
    
    } 
};

function InsertHTML(content) {
	// Get the editor instance that we want to interact with.
	var editor = CKEDITOR.currentInstance; //instances.editor1;


	// Check the active editing mode.
	if ( editor.mode == 'wysiwyg' )
	{
		// Insert HTML code.
		// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-insertHtml
		editor.insertHtml( content );
	}
	else
		alert( 'You must be in WYSIWYG mode!' );
		
	
}


var actSelected = null;

function changeValue (evt) {
  var input = evt.currentTarget
  var change = parseInt(input.getAttribute("data-change"))
 
  
  var cil = input.parentNode.querySelector("input");
  var min = parseInt(cil.getAttribute("data-min"));
  var max = parseInt(cil.getAttribute("data-max"));
  var target = cil.getAttribute("data-target");
  var current = parseInt(cil.value);
  
  var newValue = Math.max( min, current + change);
  newValue = Math.min( max, newValue);
  
  actSelected.setAttribute(target, newValue);
  cil.value = newValue 
}

function generateCode() {
    var q_content;
   
   
   if (mainMode == "svg_hotspots") q_content = SVGHotspots.getCode()
   
   var qTitle = document.getElementById("edit_title").innerHTML
   if (qTitle == "Titulek otázky") qTitle = ""
   
   var qTask = document.getElementById("edit_task").innerHTML
   if (qTask == "Zadání otázky") qTask = ""
   
  
   
    var vystup = "<HTML>\n<style type=\"text/css\"> @import \"/do/1499/el/storage/styles/testovy.css\"; " 
    
    
    if (mainMode =="svg_hotspots") vystup +=  "@import \"/do/rect/el/storage/utils/svghotspots/hotspots.css\"; ";
    vystup += "<\/style>\n"
    
    var classDAD = ""
    
   
   if (mainMode =="svg_hotspots") {
    vystup += " <script src=\"https://is.muni.cz/auth/do/rect/el/storage/utils/svghotspots/hotspots.js\"></script>\n"; 
       classDAD = " svghotspots"
   }
    
    vystup += "<div class=\"question" + classDAD +"\">\n"
    



   if (qTitle != "") vystup += "<div class=\"title\">" + qTitle + "<\/div>\n"
   if (qTask != "") vystup += "<div class=\"task\">" + qTask +"<\/div>\n"
   
      
    
   vystup += "<div class=\"content\">\n"
   vystup += q_content.content + "\n<\div>\n</div>\n"
   
   
   vystup += "<p><script>initHotspots()</script></p>\n";
       
   vystup += q_content.ok + "\n";
   if (q_content.ok == "") {
       vystup = q_content.content;
   }
    
    
     $('#code_shower' ).val(vystup)
   // $('#dialog-showCode' ).dialog( 'open' )
   //document.getElementById("question_code").value = vystup;
}

function generatePreview() {
    var pw = document.getElementById("preview_content")
    pw.innerHTML = "";
    
    var qc = pw.appendChild(document.createElement("div"));
        qc.className = "question";
    
  
   
   var qTitle = document.getElementById("edit_title").innerHTML
   if (qTitle == "Titulek otázky") qTitle = ""
   
   
   if (qTitle != "") {
        var ptit = document.createElement("div");
        ptit.className = "title"
        ptit.innerHTML = qTitle;
        qc.appendChild(ptit)
    }
   
    var qTask = document.getElementById("edit_task").innerHTML
    if (qTask == "Zadání otázky") { qTask = "" }
         
    if (qTask != "") {
        var ptask = document.createElement("div");
        ptask.className = "task"
        ptask.innerHTML = qTask;
        qc.appendChild(ptask)
    }
   
    var pcont = document.createElement("div");
    pcont.className = "content"
    qc.appendChild(pcont) 
    
     
    SVGHotspots.getPreview() 
    
     initHotspots()
     
}


function InsertText() {
	// Get the editor instance that we want to interact with.
	var editor = CKEDITOR.instances.editor1;
	var value = document.getElementById( 'txtArea' ).value;

	// Check the active editing mode.
	if ( editor.mode == 'wysiwyg' )
	{
		// Insert as plain text.
		// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-insertText
		editor.insertText( value );
	}
	else
		alert( 'You must be in WYSIWYG mode!' );
}

function loadImage(adresa) {
 if (adresa == undefined) adresa = document.querySelector("#pic_url").value
 if (adresa == "") return;
 
  var init = document.querySelector("#bg-init")
  var img = document.querySelector("#qArea img")
  
  if (init.style.display != "none") {
     init.style.display = "none";
     img = document.createElement("img");
     
     var svgNS = "http://www.w3.org/2000/svg"
     svg = init.parentNode.insertBefore(document.createElementNS(svgNS,  "svg"),init)
     svg.setAttribute("xmlns", svgNS);
     svg.setAttribute("version", "1.1");
     
     svg.style.position = "absolute"
     svg.style.left = "0px"
     svg.style.top = "0px"
     svg.style.width  = "100%"
     svg.style.height = "100%"
     svg.className = "hotspots"
     
     var hs = svg.appendChild(document.createElementNS(svgNS,  "g"));
     hs.setAttribute("id", "hotspots"); 
     
     var edits = svg.appendChild(document.createElementNS(svgNS,  "g"));
     edits.setAttribute("id", "edits"); 
      
      var border = svg.appendChild(document.createElementNS(svgNS,  "rect"));
      addRect(edits, 0, 0, 100, 50, "edit-border", "", "stroke: black; stroke-width: 1px; fill: none")
      var nw = addRect(edits, 0, 0, 10, 10, "edit-nw", "edit-rect nw", "");
      
      var ne = addRect(edits, 0, 0, 10, 10, "edit-ne", "edit-rect ne", "");
      
      var en = addRect(edits, 0, 0, 10, 10, "edit-n", "edit-rect n", "");
      var es = addRect(edits, 0, 0, 10, 10, "edit-s", "edit-rect s", "");
      var ew = addRect(edits, 0, 0, 10, 10, "edit-w", "edit-rect w", "");
      var ee = addRect(edits, 0, 0, 10, 10, "edit-e", "edit-rect e", "");
      var sw = addRect(edits, 0, 0, 10, 10, "edit-sw", "edit-rect sw", "");
      var se = addRect(edits, 0, 0, 10, 10, "edit-se", "edit-rect se", "");
      
    Snap(se).drag(editMoveSE, editStart);
    Snap(sw).drag(editMoveSW, editStart);
    Snap(ne).drag(editMoveNE, editStart);
    Snap(nw).drag(editMoveNW, editStart);
    Snap(en).drag(editMoveN, editStart);
    Snap(es).drag(editMoveS, editStart);
    Snap(ew).drag(editMoveW, editStart);
    Snap(ee).drag(editMoveE, editStart);
      
    init.parentNode.insertBefore(img, svg)
    svg = Snap(svg)
  }
 
  img.setAttribute("src", adresa);
  
  img.onload = function() { 
    /*
    bgImage.src = this.src; 
    bgImage.width = this.width; 
    bgImage.height = this.height; 
    */    
    
 }
  img.onclick = bgClicker;
  svg.node.onclick = bgClicker;
  
  
}

function addRect(node, x, y, width, height, id, className, style) {
    var svgNS = "http://www.w3.org/2000/svg";
    var rect = node.appendChild(document.createElementNS(svgNS,  "rect"))
    if (id != "") rect.setAttribute("id", id);
    if (className != "") rect.setAttribute("class", className);
    if (style != "") rect.setAttribute("style", style);
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    
    return rect;
    
}
var cnt = 0
function onFocus(evt) {
	//document.getElementById( 'eMessage' ).innerHTML = '<b>' + this.name + ' is focused </b> ' //+ ++cnt + evt.currentTarget;
}

function onBlur() {
	//document.getElementById( 'eMessage' ).innerHTML = this.name + ' lost focus';
}


function clearEmptyElement(node) {
  if (node.innerHTML == "<br>") node.innerHTML = ""
}

function initHotspots(evt) {
    var qs = document.querySelectorAll(".question.svghotspots");
    for (var i = 0; i < qs.length; i++) {
var question = qs[i];
if (question.hasAttribute("data-ready")) { continue; }
question.setAttribute("data-ready", "true");
var spots = question.querySelectorAll(".hotspot");
for (var j = 0; j < spots.length; j++) {
var spot = spots[j];
spot.setAttribute("title", "Označit prvek");
        spot.setAttribute("data-state", "free");
        spot.addEventListener("click", hsClicker);
        spot.style.fill = "";
}

var spans = question.querySelectorAll(".checks span");
for (var j = 0; j < spans.length; j++) {
var span= spans[j];
var sid = span.getAttribute("data-index");
var input = span.querySelector("input");
var img = span.querySelector("img");
var spot = question.querySelector("svg [data-index='" + sid + "']");
if (input.checked && img) {
    spot.style.strokeWidth = "5px";
    spot.setAttribute("data-state", "checked")
    if (img.src.indexOf("green") > 0) {
       spot.style.stroke = "darkgreen";
    }
    else {
       spot.style.stroke = "red";
    }
    
 }
}
}

}

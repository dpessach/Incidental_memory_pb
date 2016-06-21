/**
 * Adrian Oesch
 * Oktober 2015
 *
 * adapted for js.psych 5.0+ and introduce check order function by Danielle Pessach (May16)
 */
jsPsych.plugins['response-table'] = (function() {

   var plugin = {};

   jsPsych.pluginAPI.registerPreload('response-table', 'words');
	
	
   plugin.trial = function(display_element, trial){
	   
    header = trial.header;
	rows = trial.rows;
    cols = trial.cols;
    tdStyle = (typeof trial.tdStyle === 'undefined') ? {} : trial.tdStyle ;
    tableStyle = (typeof trial.tableStyle === 'undefined') ? {} : trial.tableStyle;
	words = (typeof trial.words === 'undefined') ? "" : trial.words;
	objects = trial.obj;
	test_order = trial.test_order;
	
	 
//  prepare html table
     trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
     //$('*').css('cursor', 'none');
     

     var response_table = "<table id='response_table' style='"+tableStyle+"'>";
     var idx=0;
     for (i=0;i<rows;i++){
       response_table = response_table.concat('<tr>');
       for(j=0;j<cols;j++){
         tdStr = "<td class='teAc' style='"+tdStyle+"'id='r"+(i+1).toString()+"-c"+(j+1).toString()+"'>"+words[idx]+"</td>";
         response_table = response_table.concat(tdStr);
         idx+=1;
       }
       response_table = response_table.concat('</tr>');
     }
     response_table = response_table.concat("</table>");

	
 /*	 function getOrder(arr){
		 var t = [];
			for (i=0; i<arr.length; i++){
				x= arr[i];
				y = test_order.indexOf(x);	
				t.push(y);
			};
		return JSON.stringify(t);
		}; 

	
		*/
     // prepare end function
     var endTrial = function(){


	   
	//var lastTable = jsPsych.data.getTrialsOfType('response-table');
    //var repetition = lastTable.length>1 ? trialIdx == lastTable[lastTable.length-1]['trial_idx'] : false;

       trial_data = {
         
         "rt": JSON.stringify(responseTimes),
         "location": JSON.stringify(responseLocation),
		 "words_presented" : words,
         "words_selected": JSON.stringify(responseContent),
		 "nCorr": nCorr,
		 "nLast": nLast,
		 "nNPL": nNPL,
		 "order": order,
		 "ordercheck": test_order
       };
       //jsPsych.data.write(trial_data);
       // clear the display
       display_element.html('')
       //$('*').css('cursor', 'none')
	   
       // move on to the next trial
       jsPsych.finishTrial(trial_data);
     }

     //  prepare response arrays
     responseTimes = [];
     responseLocation = [];
     responseContent = [];
		

		
    //  show table
     display_element.html(trial.header+response_table);
     $(".teAc").mouseenter(function(){$(this).css("background", "rgb(180,180,180)")});
     $(".teAc").mouseleave(function(){$(this).css("background", "")});

    // and start listening and recording
     var nCorr = 0; 
	 var order= [];
	 var nLast = 0; 
	 var nNPL = 0; 
	 idx = 0;
     t0 = (new Date()).getTime();
     $(".teAc").click(function(event){
       t1 = (new Date()).getTime();
       responseTimes.push(t1-t0);
	   var x = event.target.textContent;
       responseContent.push(x);
       responseLocation.push(event.target.id);
	   for (i=0;i<18;i++){
		   if(x === words[i]){
			   if(objects[i].info == "last"){
					nLast+=1;
				} else if(objects[i].info == "NPL"){
					nNPL+=1;
				} 	else {
					nCorr+=1;
					
				}
		   };
	   };
       var that = this
       $(that).css("background", "rgb(100,100,100)");
       setTimeout(function(){
         if ($(that).is(':hover')){
            $(that).css("background", "rgb(180,180,180)")
         }else{
           $(that).css("background", "")
         };
       },100);
       t0=t1;
       if (idx==5){
		 for(i=0; i<6;i++){
			 x = responseContent[i];
			 if (test_order.indexOf(x) === responseContent.indexOf(x)){
			order.push(1);
		   } else {
			order.push(0);
		   }
		 }  setTimeout(endTrial,150);}
       idx+=1;
     });
	 	 
  }

  return plugin;
})();

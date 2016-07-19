/**
 * jspsych-wordlist
 * Josh de Leeuw/Adrian Oesch
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 * adapted for Jspsych 5.0++ by Danielle Pessach May16

 **/


jsPsych.plugins["single-stim-wl-rep"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('single-stim-wl-wl', 'stimulus', 'image');

  plugin.trial = function(display_element, trial) {

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set default values for the parameters
    trial.choices = trial.choices || [];
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? true : trial.response_ends_trial;
    trial.timing_stim = trial.timing_stim || -1;
    trial.timing_response = trial.timing_response || -1;
    trial.prompt = trial.prompt || "";
	

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];
	//$('*').css('cursor', 'none');
	//$('*').css('cursor', '');

    // display stimulus
      display_element.append($('<div>', {
        html: trial.stimulus,
        id: 'jspsych-single-stim-wl-stimulus',
		style: "position:relative;top:"+(centerY-25).toString()+"px;text-align:center;"+
                          "font-weight:bold;font-size:100px;",
      }));

    //show prompt if there is one
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }

    // store response
    var response = {
      rt: -1,
      key: -1
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }


	   function getJudgement(size,key){
					if ((key == 39 && size>0)||(key == 37 && size<0)) {
						return "TRUE"
					}else{
						return "FALSE"
					}
				}
	  
      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "item": trial.stimulus,
		"wordID": trial.wordID,
		"sizeDiff": trial.size,
        "key_press": response.key,
		"correct": getJudgement(trial.size, response.key)
      };

      //jsPsych.data.write(trial_data);

      // clear the display
      display_element.html('');
		//$('*').css('cursor', '');
      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-single-stim-wl-stimulus").addClass('responded');

      // only record the first response
      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // hide image if timing is set
    if (trial.timing_stim > 0) {
      var t1 = setTimeout(function() {
        $('#jspsych-single-stim-wl-stimulus').css('visibility', 'hidden');
      }, trial.timing_stim);
      setTimeoutHandlers.push(t1);
    }

    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function() {
        end_trial();
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }

  };

  return plugin;
})();

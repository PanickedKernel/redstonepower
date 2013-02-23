/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.4 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */
(function(e){var t;e.rails=t={linkClickSelector:"a[data-confirm], a[data-method], a[data-remote]",formSubmitSelector:"form",formInputClickSelector:"form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])",disableSelector:"input[data-disable-with], button[data-disable-with], textarea[data-disable-with]",enableSelector:"input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled",requiredInputSelector:"input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",fileInputSelector:"input:file",CSRFProtection:function(t){var n=e('meta[name="csrf-token"]').attr("content");n&&t.setRequestHeader("X-CSRF-Token",n)},fire:function(t,n,r){var i=e.Event(n);return t.trigger(i,r),i.result!==!1},confirm:function(e){return confirm(e)},ajax:function(t){return e.ajax(t)},handleRemote:function(n){var r,i,s,o=n.data("type")||e.ajaxSettings&&e.ajaxSettings.dataType;if(t.fire(n,"ajax:before")){if(n.is("form")){r=n.attr("method"),i=n.attr("action"),s=n.serializeArray();var u=n.data("ujs:submit-button");u&&(s.push(u),n.data("ujs:submit-button",null))}else r=n.data("method"),i=n.attr("href"),s=n.data("params")||null;t.ajax({url:i,type:r||"GET",data:s,dataType:o,beforeSend:function(e,r){return r.dataType===undefined&&e.setRequestHeader("accept","*/*;q=0.5, "+r.accepts.script),t.fire(n,"ajax:beforeSend",[e,r])},success:function(e,t,r){n.trigger("ajax:success",[e,t,r])},complete:function(e,t){n.trigger("ajax:complete",[e,t])},error:function(e,t,r){n.trigger("ajax:error",[e,t,r])}})}},handleMethod:function(t){var n=t.attr("href"),r=t.data("method"),i=e("meta[name=csrf-token]").attr("content"),s=e("meta[name=csrf-param]").attr("content"),o=e('<form method="post" action="'+n+'"></form>'),u='<input name="_method" value="'+r+'" type="hidden" />';s!==undefined&&i!==undefined&&(u+='<input name="'+s+'" value="'+i+'" type="hidden" />'),o.hide().append(u).appendTo("body"),o.submit()},disableFormElements:function(n){n.find(t.disableSelector).each(function(){var t=e(this),n=t.is("button")?"html":"val";t.data("ujs:enable-with",t[n]()),t[n](t.data("disable-with")),t.attr("disabled","disabled")})},enableFormElements:function(n){n.find(t.enableSelector).each(function(){var t=e(this),n=t.is("button")?"html":"val";t.data("ujs:enable-with")&&t[n](t.data("ujs:enable-with")),t.removeAttr("disabled")})},allowAction:function(e){var n=e.data("confirm"),r=!1,i;return n?(t.fire(e,"confirm")&&(r=t.confirm(n),i=t.fire(e,"confirm:complete",[r])),r&&i):!0},blankInputs:function(t,n,r){var i=e(),s,o=n||"input,textarea";return t.find(o).each(function(){s=e(this);if(r?s.val():!s.val())i=i.add(s)}),i.length?i:!1},nonBlankInputs:function(e,n){return t.blankInputs(e,n,!0)},stopEverything:function(t){return e(t.target).trigger("ujs:everythingStopped"),t.stopImmediatePropagation(),!1},callFormSubmitBindings:function(t){var n=t.data("events"),r=!0;return n!==undefined&&n.submit!==undefined&&e.each(n.submit,function(e,t){if(typeof t.handler=="function")return r=t.handler(t.data)}),r}},"ajaxPrefilter"in e?e.ajaxPrefilter(function(e,n,r){t.CSRFProtection(r)}):e(document).ajaxSend(function(e,n){t.CSRFProtection(n)}),e(t.linkClickSelector).live("click.rails",function(n){var r=e(this);if(!t.allowAction(r))return t.stopEverything(n);if(r.data("remote")!==undefined)return t.handleRemote(r),!1;if(r.data("method"))return t.handleMethod(r),!1}),e(t.formSubmitSelector).live("submit.rails",function(n){var r=e(this),i=r.data("remote")!==undefined,s=t.blankInputs(r,t.requiredInputSelector),o=t.nonBlankInputs(r,t.fileInputSelector);if(!t.allowAction(r))return t.stopEverything(n);if(s&&t.fire(r,"ajax:aborted:required",[s]))return t.stopEverything(n);if(i)return o?t.fire(r,"ajax:aborted:file",[o]):!e.support.submitBubbles&&t.callFormSubmitBindings(r)===!1?t.stopEverything(n):(t.handleRemote(r),!1);setTimeout(function(){t.disableFormElements(r)},13)}),e(t.formInputClickSelector).live("click.rails",function(n){var r=e(this);if(!t.allowAction(r))return t.stopEverything(n);var i=r.attr("name"),s=i?{name:i,value:r.val()}:null;r.closest("form").data("ujs:submit-button",s)}),e(t.formSubmitSelector).live("ajax:beforeSend.rails",function(n){this==n.target&&t.disableFormElements(e(this))}),e(t.formSubmitSelector).live("ajax:complete.rails",function(n){this==n.target&&t.enableFormElements(e(this))})})(jQuery);
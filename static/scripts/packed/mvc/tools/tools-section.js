define(["utils/utils","mvc/ui/ui-table","mvc/ui/ui-misc","mvc/ui/ui-tabs","mvc/tools/tools-select-dataset"],function(d,b,f,a,c){var e=Backbone.View.extend({initialize:function(h,g){this.app=h;this.inputs=g.inputs;g.cls_tr="section-row";this.table=new b.View(g);this.setElement(this.table.$el);this.render()},render:function(){this.table.delAll();for(var g in this.inputs){this._add(this.inputs[g])}},_add:function(i){var h=this;var g=jQuery.extend(true,{},i);g.id=d.uuid();this.app.input_list[g.id]=g;var j=g.type;switch(j){case"conditional":this._addConditional(g);break;case"repeat":this._addRepeat(g);break;default:this._addRow(j,g)}},_addConditional:function(g){g.label=g.test_param.label;g.value=g.test_param.value;this._addRow("conditional",g);for(var j in g.cases){var h=g.id+"-section-"+j;var k=new e(this.app,{inputs:g.cases[j].inputs,cls:"ui-table-plain"});this.table.add(this._create_field({label:"",help:g.help,$el:k.$el,color:true}));this.table.append(h)}},_addRepeat:function(g){var h=this;var l=new a.View({title_new:"Add "+g.title,max:g.max,onnew:function(){var i=g.id+"-section-"+d.uuid();var n=new e(h.app,{inputs:g.inputs,cls:"ui-table-plain"});l.add({id:i,title:g.title,$el:n.$el,ondel:function(){l.del(i);l.retitle(g.title);h.app.refresh()}});l.retitle(g.title);l.show(i);h.app.refresh()}});for(var k=0;k<g.min;k++){var j=g.id+"-section-"+d.uuid();var m=new e(h.app,{inputs:g.inputs,cls:"ui-table-plain"});l.add({id:j,title:g.title,$el:m.$el})}l.retitle(g.title);this.table.add(this._create_field({label:g.title,help:g.help,$el:l.$el,color:true}));this.table.append(g.id)},_addRow:function(i,g){var j=g.id;var h=null;switch(i){case"text":h=this._field_text(g);break;case"select":h=this._field_select(g);break;case"data":h=this._field_data(g);break;case"data_column":h=this._field_data_colum(g);break;case"conditional":h=this._field_conditional(g);break;case"hidden":h=this._field_hidden(g);break;case"integer":h=this._field_slider(g);break;case"float":h=this._field_slider(g);break;case"boolean":h=this._field_boolean(g);break}if(!h){if(g.options){h=this._field_select(g)}else{h=this._field_text(g)}console.debug("tools-form::_addRow() : Auto matched field type ("+i+").")}if(g.value!==undefined){h.value(g.value)}this.app.field_list[j]=h;this.table.add(this._create_field({label:g.label,help:g.help,$el:h.$el}));this.table.append(j)},_field_conditional:function(g){var h=this;var j=[];for(var k in g.test_param.options){var l=g.test_param.options[k];j.push({label:l[0],value:l[1]})}return new f.Select.View({id:"field-"+g.id,data:j,onchange:function(t){for(var r in g.cases){var n=g.cases[r];var q=g.id+"-section-"+r;var m=h.table.get(q);var p=false;for(var o in n.inputs){var s=n.inputs[o].type;if(s&&s!=="hidden"){p=true;break}}if(n.value==t&&p){m.fadeIn("fast")}else{m.hide()}}}})},_field_data:function(g){var h=this;var i=g.id;return new c.View(this.app,{id:"field-"+i,extensions:g.extensions,multiple:g.multiple,onchange:function(r){if(r instanceof Array){r=r[0]}var p=h.app.tree.findReferences(i,"data_column");var k=h.app.datasets.filter(r);if(k&&p.length>0){console.debug("tool-form::field_data() - Selected dataset "+r+".");var t=k.get("metadata_column_types");if(!t){console.debug("tool-form::field_data() - FAILED: Could not find metadata for dataset "+r+".")}for(var m in p){var n=h.app.input_list[p[m]];var o=h.app.field_list[p[m]];if(!n||!o){console.debug("tool-form::field_data() - FAILED: Column not found.")}var l=n.numerical;var j=[];for(var s in t){var q=t[s];if(q=="int"||q=="float"||!l){j.push({label:"Column: "+(parseInt(s)+1)+" ["+t[s]+"]",value:s})}}if(o){o.update(j);if(!o.exists(o.value())){o.value(o.first())}}}}else{console.debug("tool-form::field_data() - FAILED: Could not find dataset "+r+".")}}})},_field_select:function(g){var h=[];for(var j in g.options){var k=g.options[j];h.push({label:k[0],value:k[1]})}var l=f.Select;switch(g.display){case"checkboxes":l=f.Checkbox;break;case"radio":l=f.RadioButton;break}return new l.View({id:"field-"+g.id,data:h,multiple:g.multiple})},_field_data_colum:function(g){return new f.Select.View({id:"field-"+g.id,multiple:g.multiple})},_field_text:function(g){return new f.Input({id:"field-"+g.id,area:g.area})},_field_slider:function(g){var h=1;if(g.type=="float"){h=(g.max-g.min)/10000}return new f.Slider.View({id:"field-"+g.id,min:g.min||0,max:g.max||1000,step:h})},_field_hidden:function(g){return new f.Hidden({id:"field-"+g.id})},_field_boolean:function(g){return new f.RadioButton.View({id:"field-"+g.id,data:[{label:"Yes",value:true},{label:"No",value:false}]})},_create_field:function(g){var h;if(g.color){h=$('<div class="ui-table-form-section"/>')}else{h=$("<div/>")}if(g.label){h.append('<div class="ui-table-form-title-strong">'+g.label+"</div>")}h.append(g.$el);if(g.help){h.append('<div class="ui-table-form-info">'+g.help+"</div>")}return h}});return{View:e}});
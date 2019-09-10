COBY.go((
		c, tt = c.tt, 
		t = c.t,
		range = c.range,
		iz = c.iz,
		deepSearch = c.deepSearch,
		id = c.id
	) => ({
	elements:[
		{
			parent:"cob_container",
			
			className:"coby_content",
			style:{
			//	background:"red"
			},
			added() {
				
			},
			elements: [
			//	c.taf("orderForm", 123),
			//	c.taf({"orderForm": 16}),
				c.taf(
					{
						orderForm: form => [
							{
								title: "Kosher Order Form"
							},
							{title: {
								size:20,
								text:"For the lunches you can choose from the following:"
							}},
							{title: {
								size:24,
								text: "Sandwiches:"
							}},
							{multipleQuanityItem: [
								{
									name:"Tuna",
									price: 20,
									max:16
								},
								{
									name:"Cold Cut",
									price: 25,
									max:16
								},
								{
									name:"Lox",
									price: 25,
									max:16
								},
							]},
							
							{title: {
								size:24,
								text: "Entree (includes side dish of rice or steamed vegetables, and a salad):"
							}},
							{multipleQuanityItem: [
								{
									name:"Chicken breast",
									price: 35,
									max:14
								},
								{
									name:"Salmon",
									price: 35,
									max:16
								},
								{
									name:"Rib Eye Steak",
									price: 50,
									max:10
								},
							]},
							{
								dropdownPricedItem: {
									label: `For Shabbos, we have a Shabbos box, which includes: <span class="bigList"><ul>${
										[
											"Tea Lights",
											"Challah",
											"Grape Juice (wine would be extra if requested)",
											"Fish",
											"Salad",
											"Dip",
											"Soup",
											"Chicken",
											"Two Side Dishes",
											"Dessert",
											"One Extra Salad (for lunch)",
											"Choice of Cold Cuts or Chicken (for lunch)"
										].map(x => "<li>" + x + "</li>").join("")
									}</ul></span>`,
									options: {
										"None": 0,
										"Single Person ($85)":85,
										"2 People ($150)": 150
									},
									name: "ShabbosBox"
								}
							},
							{
								dropdownPricedItem: {
									label: "Additional donation",
									options: Object.fromEntries(
										range(18 * 18).map((x, i) => {
											var amount = x <= 18 ? x : x < 18 * 8 ? (x - 17) * 18 : x < 18 * 13 ? x * 18 * (x - 18 * 8 + 3) : 18 * Math.pow(i, 2);
											return ["$" + amount, amount];
										})
									),
									displayValue:false,
									name: "additional_donation"
								}
							},
							{
								title: "Other options"
							},
							{
								dropdownPricedItem: {
									label: "Delivery Location ",
									options: {
										"Select a Location":0,
										"Goleta ($18)": 18,
										"S. Barbara ($25)": 25
									},
									name: "DeliveryLocation"
								}
							},
							{
								formEntry: {
									label: "Delivery Instructions",
									elements: {
										tag:"textarea",
										name:"delivery_instructions"
									}
								}
							},
							{
								formEntry: {
									label: "Pick a date to order, if within current week, an extra $20 will be added to total",
									elements: [c.taf("datePicker", {
										name:"delivery_date",
										limit:"future",
										onpick(date, dayDifference) {
											var a = iz("hiThere"),
												val = 0;
											if(a) {
												var r = "";
												
												console.log(dayDifference, "days later");
												if(dayDifference <= 7 && dayDifference > 0) {
													val = 20;
													r = `+$${val}`;
													
												}
												form.updateTotalValue("dayDelay", val);
												a.innerHTML = r;
												
											}
					
										},
										columnClass: "cob_col"
									})],
									totalName:"hiThere"
								}
							},
							{
								formEntry: {
									label: "and your total is",
									
									elements: {
										
										innerHTML: "$"+form.total
									}
								}
							},
							{title:"Payment details"},
							{title: {text:"Credit Card Info", size:54}},
							/*{
								formEntry: {
									label:"Card Type",
									elements: c.taf("select", {
										name: "q18_payment[cc_type]",
										options: {
											Visa: "Visa",
											MasterCard: "Mastercard",
											"American Express": "Amex",
											Discover: "Discover"
										}
									})
								}
							},*/
							{
								formEntry: {
									label:"Credit Card Number",
									elements: {
										
										tag:"input",
										name:"x_card_num"
									}
								},
							},
							
							{	
								formEntry:{
									label:"Expiration Date",
									elements: [{
										tag:"span",
										elements: [
											c.taf("select", {
												name:"x_exp_month",
												options: Object.fromEntries(
													`January Februrary March April May June July August September October November December`.split(" ").map((x,i) => 
														[x,i + 1]
													)
												)
											}),
											c.taf("select", {
												name:"x_exp_year",
												options: Object.fromEntries(
													range(12).map(x => {
															var cur = (new Date()).getYear() + 1900 + x;
															return [cur,cur]//.map(y => [y,y])
														}
													)
												)
											})
										]
									}]
								}
							}/*,
							{
								formEntry:{
									label:"CCV",
									elements: {
										tag:"input",
										type:"tel",
										style:{width:"100px"},
										name:"q18_payment[cc_ccv]"
									}
								}
								
							},
							{title: {text:"Billing Address Info", size:54}},
							{
								formEntry: {
									label:"Address Line 1",
									elements: {
										tag:"input",
										name: "q18_payment[addr_line1]"
									}
								}
							},
							{
								formEntry: {
									label:"Address Line 2",
									elements: {
										tag:"input",
										name: "q18_payment[addr_line2]"
									}
								}
							},
							{
								formEntry: {
									label:"City",
									elements: {
										tag:"input",
										name:"q18_payment[city]"
									}
								}
							},
							{
								formEntry: {
									label:"State",
									elements: {
										tag:"input",
										name:"q18_payment[state]"
									}
								}
							},
							
							{
								formEntry: {
									label:"Zip Code",
									elements: {
										tag:"input",
										type:"tel",
										name:"q18_payment[postal]"
									}
								}
							},
							{
								formEntry: {
									label:"Country",
									elements: {
										tag:"input",
										name:"q18_payment[country]"
									}
								}
							},*/
							{
								formEntry: {
									label:"Again, here's your total order amount: ",
									elements: [
										{
											tag:"input",
											style: {
												display:"none"	
											},
											name: "x_amount",
											added(x) {
												form.addToTotalNodeList({
													node: x.el,
													field:"value"
												});
												console.log(form, x.el);
											}
										},
										{
											
											elements: {
													tag:"span",
													id:"total_view"+Date.now(),
													innerHTML:0,
													onadded(x) {
													
														console.log("HA",x.el);
														form.addToTotalNodeList(x.el.id);
													},
											},
											
											innerHTML:"$"
										}
									]
								}
							}
						]
					}
				)
			]
		}
	],
	css: `
		body {
		//	background:green;
		}
		.cob_col {
		//padding:5px;
			border: 1px solid black;
			width:99px;
			height:50px;
			display:inline-block;
			
		}
		
		.cob_cal_internal {
			user-select:none;
			height:100%
		}
		
		.cob_cal_internal .dateTxt{
		//padding:5px;
			display:inline-block;
			top:50%;
			position:relative
		}
		${c.taf("btn", {
			selector: ".cob_cal_select",
			rgbBase: [100,23,255]
		})}
		
		${c.taf("btn", {
			selector: ".cob_cal_passive",
			rgbBase: [50,0,205]
		})}
		
		${c.taf("btn", {
			selector: ".cob_cal_current",
			rgbBase: [150,73,255]
		})}
		
		${c.taf("btn", {
			selector: ".cob_cal_today",
			rgbBase: [250,173,155]
		})}
		
		${c.taf("btn", {
			selector: ".btnL",
			rgbBase: [220,133,55] 
		})}
		
		${c.taf("btn", {
			selector: ".btnR",
			rgbBase: [10,233,155] 
		})}
		
		${c.taf("btn", {
			selector: ".cancelX",
			rgbBase: [255,0,0] 
		})}
		
		${c.taf("btn", {
			selector:".dateDisplay",
			
			rgbBase: [56,32,226]
		})}
		
		.dateDisplay {
			padding:8px
		}
		.arrowHolders {
			padding-bottom:16px
		}
		
		.cancelX {
			padding:6px;
			position:relative;
			margin-right:-150px
		//	float:right
		}
		
		.coby_content {
			padding:10px
		}
		
		
		
		.coby_content .cob_header {
			font-weight:bold;
			font-size:75px;
		}
		
		
		
		.coby_content {
			font-family:Helvetica;
		}
		
		/*${c.taf("btn", {
			selector: ".coby_content  select",
			rgbBase: [200,200,200] 
		})}*/
		
		/*${c.taf("btn", {
			selector: ".datePickerBox .monthName",
			rgbBase: [60,133,255] 
		})}*/
		
		.coby_content .cob_form_entry  {
			border:1px solid black;
			overflow:auto;
			padding:15px;
			font-size:45px;
		}
		
		.cob_form_entry input {
			font-size:45px;
			padding:8px;
			margin-top:-8px;
		}
		
		.cob_form_entry textarea {
			width:550px;
			height:150px;
			font-size:25px;
			resize:none;
		}
		.coby_content .cob_formValue {
			float:right;
			display:inline-block;
			
		}
		
		.coby_content .cob_label {
			display:inline-block;
			width:50%;
		}
		
		.coby_content .total_value {
			width:120px;
			display:inline-block
		}
		
		.coby_content select {
		//	float:right;
			font-size:45px;
			
			border:0;
			background:rgba(0,0,0,0);
		
		}
		
		.coby_content .cob_formValue select {
			
			padding:8;
			margin-top: -8;
		}

		
		html {
			font-family:Helvetica
		}
		
		.datePickerBox {
			position:absolute;
			text-align:center;
			border:1px solid black;
			background:rgb(234,234,234);
			padding:10px;
			font-size:30px;
		}
		
		.datePickerBox .cob_cal_days {
			
			user-select:none;
		}
		
		.datePickerBox .monthName {
			padding:8px;
			float:left;
		//	font-size:14px !important;
		//	width:100%
		}
		
		.datePickerBox .btnR {
			float:right;
			padding:18px;
			margin-top:-8px;
		}
		
		.datePickerBox .btnL {
			float:left;
			padding:18px;
			margin-top:-8px;
		}
		
		.datePickerBox {
			width:max-content;
		}
		
		.datePickerBox .arrowHolders {
			width:100%;
		}

		bigText {
			font-size:18px;
		}
	`,
	tafkids: {
		
		
		wow(...args) {
			var num = args[0];
			console.log(args);
			return {
				elements: range(0,num).map(x=> ({
					innerHTML:x
				}))
			}
		},
		el: data => data,
		orderForm(func) {
			var ID = Date.now(); 
			var nodesOfTotal = [],
				valueNodesOfTotal = [];
			var obj = {
				total:`<span id="${"$_coby_form_total_"+ID}">${realTotal(obj)}</span>`,
				addToTotalNodeList: (node, field) => nodesOfTotal.push(
					!field ? node : ({
						node: node,
						field: field
					})
				),
				fields: {},
				totalAmount:() => {
					var t = id("$_coby_form_total_"+ID);
					if(t) {
						return t.innerHTML
					} else {
						return 0;
					}
				},
				updateTotalValue:(inputTotalName, totVal) => {
					obj.moneyFields[inputTotalName] = totVal;
					realTotal(obj);
				},
				moneyFields: {}
			},
			finalFields;
			
			function realTotal(obj) {
				var result = 0;
				t(obj, Object) && Object.keys(obj.moneyFields).forEach(x => {
					if(x.includes("coby_other_total_value")) {
						obj.moneyFields[x] = 0;
					}
				});
				var otherTotals = Array.apply(null,document.querySelectorAll(".coby_other_total_value"));
				otherTotals.forEach((x,i) => {
					
					obj.moneyFields["coby_other_total_value"+i] = parseInt(x.innerHTML) || 0;
					console.log(x);
				});
				Object.keys((obj && tt(obj.moneyFields, Object) || {})).forEach(x => {
					console.log(obj.moneyFields.x);
					var num = parseInt(obj.moneyFields[x]);
					console.log(obj.moneyFields);
					if(num !== NaN) {
						console.log(num,x);
						result += num;
					}
				});	
				
				var totalNode = id("$_coby_form_total_"+ID);
				if(totalNode) {
					totalNode.innerHTML = `${result}`;
					
				}
				console.log(nodesOfTotal);
				nodesOfTotal.forEach(obj => {
					var field = t(obj, Object) && obj["field"] || "innerHTML",
						x = t(obj, Object) && obj["node"] || obj;
					console.log(x, field)
					x && !t(x, String) ? (
							x[field] = result
						) : (
							t(x, String) ? (
								iz(x) ? (
									iz(x)[field] = result
								) : id(x) ? (
									id(x)[field] = result
								) : 0
							) : 0
						)
						
				});
				
				if(!finalFields) {
					finalFields = iz("finalFields"+ID);
				}
				
				if(finalFields) {
					console.log("FAIN", obj);
				}
				return result;
			}
			
			var arr = (
				tt(
					tt(
						func, 
						Function, 
						f => f(obj)
					), Array
				) || []
			);
			var tafs = arr.map(x => 
				c.taf(x)
			).flatten().concat({
				sheim:"finalFields"+ID
			});;

			console.log(tafs,"b4");
			deepSearch({
				array: tafs,
				anything: (value, object, key) => (
					key == "tag" && 
					value == "input"/**/
				),
				onfind(x, value, key) {
					var oldOnchange = x.onchange;
					x.onchange = e => {
						/*console.log("LOL I did something",key, value, x);
						
							var option = Array.apply(null,e.target.childNodes)
								.find(x => x.value == e.target.value);
							
							var quantity = option.innerHTML,
								moneyTotal = parseInt(e.target.value),
								name = x.sheim/*.replace("_quantity");
							console.log("CHANGED OMG", quantity, moneyTotal, name);
							if(quantity && moneyTotal && name) {
								obj.fields[quantity] = name;
								obj.moneyFields[name] = moneyTotal;
								
								console.log(obj);
							}
						}
						;*/
						if((tt(x["sheim"], String) || "").includes("_fieldTotal")) {
							obj.moneyFields[e.target.name] = e.target.value;
							realTotal(obj);
							console.log("LOL",e.target.value, e.target.name);
						}
						tt(oldOnchange, Function, ooc => ooc(e));
					};
					x.onadded = (el) => {
			//			console.log("WOW",el);
					}

				}
			});
			
			
		
		//	console.log(tafs,"after");
			return tafs;
		},
		text: data => ({
			className: "cob_text ",
			tag:"span",
			innerHTML: tt(data, String) || tt(data, Object, x => x.text)
		}),
		title: data => ({
			className: "cob_header ",
			innerHTML: tt(data, String) || tt(data, Object, x => x.text),
			tag:"h2",
			style:{fontSize:(tt(data.size, Number, x => x  + "px")) || "75px"}
		}),
		paragraph: data => ({
			className: "cob_parag",
			tag:"p",
			innerHTML:tt(data, String) || tt(data, Object, x => x.text)
		}),
		multipleQuanityItem: opts => {
			var arr = tt(opts, Array),

				rez = [],
			makeItem = (data) => {
				
				var max = 1 + (tt(data.max, Number) || 1),
					price = tt(data.price, Number) || 0;
				data.options = Object.fromEntries(
					range(0, max).map(x => [
						x, x
					])
				);
				
				data.label = `${data.name}: $${price}`;
				return c.taf("dropdownPricedItem")(data);
			};
			
			if(t(opts, Object)) console.log(rez.push(makeItem(opts)));
			else if (arr) {
				arr.forEach(x=> {
					rez.push(makeItem(x))
				});
			}
			return rez;
		},
		dropdownPricedItem(data) {
			if(!t(data, Object)) data = {};
			
			var name = tt(data.name, String) || "",
				shortenedName = name.split(' ').join('_'),
				totalName =  shortenedName+ "_total",
				quantityName = totalName + "_quantity",
				prices = {},
				options = Object.fromEntries(
							Object.entries(tt(data.options, Object) || {}).map(x => 
								x[0] != x[1] ? 
									void(prices[x[0]] = x[1]) || [
										x[0],
										x[0]
									]   
								:
									x
							)	
						),
				price = tt(data.price, Number) || 0,
				rezzult;
		
			return c.taf("formEntry", {
					label:(tt(data.label, String) || "") ,
					elements: [
								c.taf("select", ({
									onchange(e) {
										var isItNumb = (parseInt(e.target.value) * (price || 1));
										var val = prices[e.target.value] || (!isNaN(isItNumb) ? isItNumb : 0);
										iz(`${shortenedName}_fieldTotal`).value = val;
										data.displayValue !== false && (iz(totalName).innerHTML = ":$" + val);
										console.log("YO MAN", e.target.value, prices, val,iz(totalName), iz(`${shortenedName}_fieldTotal`));
									},
									options: options,
									name:shortenedName+"_value",
									sheim: quantityName
								})),
								{
									tag: "input",
									type:"hidden",
									sheim:shortenedName+"_fieldTotal",
									name:shortenedName+"_total"
								}
								
							],
					totalName: totalName
				});
			
		},
		formEntry(data) {
			
			if(t(data, Function)) {
				data = data({});
			}
		//	console.log(data);
			var totalName = tt(data.totalName, String) || "";
			if(t(data, Function)) {
				data = data();
			}
			return {
				className:"cob_form_entry",
				elements: [
					{
						className:"cob_label",
						innerHTML:tt(data.label, String) || "",
						
					},
					{
						className: "cob_formValue",
						elements: [
							data.elements || [],
							{
								sheim:totalName,
								className:"total_value"
							},
							"<br>"
						]
					}
				],
				onselected(value) {
					
				}
			};
		}
	}
}));

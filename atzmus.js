/*B"H*/
var COBY = new(function() {
	//https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js
	if (!window.Int8Array) {
		window.Int8Array = Array;
		window.Uint8Array = Array;
		window.Int16Array = Array;
		window.Uint16Array = Array;
		window.Int32Array = Array;
		window.Uint32Array = Array;

	}
	var self = this,
		empty = (() => {}),
		keyCodes = [],
		moving = false,
		started = false,
		IzList = [],
		startFunctions = [],
		fullyLoadedFuncs = [],
		scriptsLoaded = [],
		onStartedEvents = () => {
			startFunctions.forEach(x => {
				t(x, Function) && x();
			});
			startFunctions = [];
		},
		possibilities = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()`~-_=+[{]}\\|'\";:/?.>,< 	'/'קראטוןםפשדגכעיחלךזסבהנמצתץףֱֲֳִֵֶַָֹֻּׂ",
		imports = {
			extend: extend,
			t: t,
			tt: tt,
			iz: iz,
			id: id,
			f$: f$,
			c$: c$,
			show: show,
			hide: hide,
			deepSearch: deepSearch,
			range: range,
			copy: copy,
		
			randomID: randomID
		};
	this.cobysSocket = null,
		this.onready = (f) => {
			t(f, Function) && f()
		};
	this.onfullyloaded = () => {
		
		fullyLoadedFuncs.forEach(x => {
			if (t(x, Function)) {
				x();
			}
		});
		
		fullyLoadedFuncs = [];
	};
	this.i = imports;
	this.onsocketmessage = empty;
	this.onsocketerror = empty;
	this.onsocketclose = empty;
	this.socketURL = null;
	this.socketFunctionsToDo = null;
	this.scriptsToLoad = [];
	this.makeElements = makeElements;
	this.elements = [];
	this.events = {};
	define();
	this.start = (callback) => {
		if (!started) {
			makeElements(self.elements);
			startupThings();
			this.loadScripts(this.scriptsToLoad, () => {
			/*	this.startWebsocket(() => {
					if (callback) {
						callback();
					}
				});*/
			});
			started = true;
		}
	};
	
	document.addEventListener("mousemove", function(e) {
		self.mouseEvent = e;
	});
	document.addEventListener("readystatechange", e => {
		if (e.target.readyState === "interactive") {
			self.onready();
			self.start();
			onStartedEvents();
		
		}
		if (e.target.readyState === "complete") {
			self.onfullyloaded();
		}
	});
	
	function startupThings() {
		self.go({
			css: `
				body {
					font-family: "Helvetica";
			
				}
				
				body, html {
					margin:0
				}
			`,
			elements: {
				
				tag:"span",
				
				added(s) {
					var c = new self.element({
						tag: "canvas",
						width:50,
						height:50,
						style: {
							display: "none"
						}
					});
					
					s.el.cobified = true;
					var ctx = c.el.getContext("2d");
				//	c.appendTo(s.el)
					ctx.font = "26px sans-serif";
					ctx.fillText('B"H', 0, 20);
					var url = c.el.toDataURL();
					s.el.style.background = "url(" + url + ")";
					s.el.style.width = c.el.width;
					s.el.style.height = c.el.height;
					s.el.style.zIndex = 2
					c.el.remove();
				},
				style: {
					float: "right",
					margin:4,
					position:"absolute"
				}
			}
		});
	}
	
	this.CobySocket = function(opts) {
		if (!opts) opts = {};
		var url = t(opts, String) ? opts : t(opts, Object) ? opts.url : null;
		this.onmessage = opts.onmessage || (() => {});
		this.onerror = opts.onerror || (() => {});
		this.onopen = opts.onopen || (() => {});
		var functionDataToDo = {},
			listeners = opts.listeners || {},
			Q = [];
		if (url) {
			this.ws = new WebSocket(url);
			if (t(opts, Object)) {
				for (var k in opts) {
					if (this[k]) this[k] = opts[k];
				}
			}

			this.ws.onopen = () => {
				this.onopen();
				Q.forEach(x => t(x, Function) && x());
				Q = [];
			};
			var onBinaryMsg = b => {
				
				if(t(opts.onBinaryMessage, Function)) {
					opts.onBinaryMessage(b);
				}
			};
			this.ws.onmessage = m => {
				this.onmessage(m);
				
				if (
				//	t(m.data, Object) &&
					isParseable(m.data)
				) {
					var j = JSON.parse(m.data);
					for (var k in j) {
						functionDataToDo[k] = j[k];
						if (t(listeners[k], Function)) {
							listeners[k](functionDataToDo[k]);
						}

					}

				} else {
					if(
						m. constructor.name.includes("Buffer") || 
						m. constructor.name.includes("Blob")
					)  {
						onBinaryMessage(msg);
					}
				}
			};
			
			
			this.ws.onerror = (err) => {
				switch (err.code) {
					case "ECONNREFUSED":
						mySocketReconnect(this.ws);
						break;
					default:
						this.onerror(err);
						break;
				}
			};

			this.on = (what, cb) => {
				
				if (t(cb, Function)) {

					listeners[what] = () => {
						if (functionDataToDo[what]) {
							cb(functionDataToDo[what]);
						} else {
							cb(0);
						}
					};
				}
			

			};

			this.send = msg => {
				var func = () => {
					var sendMsg = msg;
					if(
						msg. constructor.name.includes("Buffer") || 
						msg. constructor.name.includes("Blob")
					)  {
						
					} else {
						sendMsg = tryToStringify(msg);
					}
					this.ws.send(sendMsg);
				};
				if (this.ws.readyState == WebSocket.OPEN) {
					func();
				} else {
					Q.push(func);
				}
			};

		}
	};




	function randomID() {
		var str = "";


		var length = Math.floor(
			Math.random() * 255 + 170
		)

		for (var i = 0; i < length; i++) {
			var index = Math.floor(
				Math.random() * possibilities.length
			)
			str += possibilities[index]
		}

		return str;
	}

	function hide(str) {
		var el = iz(str);
		if(el) {
			el.style.display = "none";
		}
	}
	
	function show(str) {
		var el = iz(str);
		if(el) {
			el.style.display = "";
		}
	}

	function copy(obj) {
		var res = {};
		for (var k in obj) {
			res[k] = obj[k];
		}
		return res;
	}

	function extend(object1, object2) {
		for (var key in object2) {
			object1[key] = object2[key];
		}
	}

	function cobvaluate(func) {
		var result = func;
		var isNew = true;
		if(t(func, Function)) {
			var str = func.toString();
			var insertStr = '/*B"H*/';
			var cobIdentifierStart = "<?cob";
			cobIdentifierEnd = "?>";
			var indexOfCob = str.indexOf(cobIdentifierStart),
				endIndexOfCob = str.indexOf(cobIdentifierEnd);
			var isVal = false;
			if (indexOfCob > -1 && endIndexOfCob > -1) {
				var sub = str.substring(
					indexOfCob + cobIdentifierStart.length,
					endIndexOfCob);

				var results = cobLanguage(sub);

				//		console.log("LOL??", results);
				insertStr += cobify(results);
				

				var newStr = str.substring(
					0, str.indexOf("{") + 1
				) + "\n" + insertStr + "\n" + str.substring(
					str.indexOf("{") + 1
				);

				var newFunc;
				try {

					newFunc = eval("(" + newStr + ")");

				} catch (a) {

				}

				//	console.log(newFunc);
				if (newFunc) {
					result = newFunc;
					isNew = !isVal;
				}

			} else

			{
				//	console.log("NOPE");
			}

		}
		
		function cobify(results) {
			var rz = "";
			for (var k in results) {
				
				switch (k) {

					case "import":

						for (
							var i = 0; i < results[k].length; i++
						) {
							imports[results[k][i]] ? (
								rz += "\nvar " + (
									results[k][i]
									+
									" = " +

									"arguments[0][\"" +
									results[k][i] + "\"]"
									+
									";")
							) : "";
						}
					
						break;
					case "cob":
						rz += "\nconsole.log('LOL wow now')"
						break;
					case "val":
						isVal = true;
						break;
				}
			}
			rz += "\narguments[0] = null;";
			return rz;
		}
		
		function cobLanguage(code) {
			var cobLanguageCommands = {
				import: function(value) {
					return value.split(",").map(function(x) {
						return x.trim()
					})
				},

			};
			var data = {};
			var commands = getCommands(code);
			commands.forEach(function(x) {
				var words = x.split(" ");
				var first = words[0];
				var value = words.length > 0 ? x.substring(x.indexOf(first) + first.length + 1) : x;
				var cmd = cobLanguageCommands[first];
				if (t(cmd, Function)) {
					data[first] = cmd(value);
				} else {
					data[x] = x;
				}
				//				console.log("doing", x, words, first, value, cmd, data);
			});
			//			console.log(commands);

			function getCommands(mainCode) {
				return (
					mainCode
					.split(";")
					.map(function(x) {
						return x.split("\n")
					})
					.flatten()

					.map(function(x) {
						return x.trim()
					})
					.filter(function(x) {
						return (
							x &&
							x !== "\n" &&
							x !== " " &&
							x.length > 0
						)
					})
				)
			}

			function getCommand(keyword) {
				var value = null;
				var keyIndex = code.indexOf(keyword);
				if (keyIndex > -1) {
					var subst = code.substring(keyIndex + keyword.length);
					var endN = subst.indexOf("\n") > -1 ?
						subst.indexOf("\n") :
						subst.indexOf(";") > -1 ?
						subst.indexOf(";") : subst.length;
					if (endN > -1) {
						var valueStr = subst.substring(0, endN);
						value = valueStr.trim();
					}
				}

				return value;
			}

			return data;
		}
		console.log("LOL", result)
		return !isNew ? result(imports) : new result(imports);

	}
	var cobVars = {};

	this.var = function(name, func) {
		if (func == undefined) {
			return cobVars[name];
		} else if (t(name, String)) {
			var val;
			if (t(func, Function)) {
				val = cobvaluate(func);
			}
			cobVars[name] = val;
		}
	};

	function mySocketReconnect(ws) {
		if (t(ws, WebSocket)) {
			var oldURL = ws.url,
				oldOnMsg = ws.onmessage,
				oldOnError = ws.onerror;

			ws.close();
			ws = new WebSocket(oldURL);
			ws.onmessage = oldOnMsg;
			ws.onerror = oldOnError;
		}
	}

	this.scripts = (data, cb) => {
		var d =
			t(data, Array) ?
			data :
			t(data, String) ? [data] : [];
		this.loadScripts(d, () => {
			t(cb, Function) && cb();
		});
	};

	this.script = this.scripts;
	this.do = func => {
		t(func, Function) &&
			started ? func() :
			startFunctions.push(func);
			
	};
	this.go = opts => {
		var input, func;

		if (t(opts, Object)) {
			input = opts;
		} else if (t(opts, Function)) {
			func = opts;
			//	tt(opts(this), Object, oo => input = oo)
		}
		tt(opts, Function, oo => input = oo(this));
		var callbackFuncs = "scripts script",
			callback,
			chart = {
				css: self.css,
				elements: makeElements,
				events: data => self.events = data,
				scripts: function scripts(data) {
					self.scripts(data, () => callbacks.push(function() {}));
				},
				loaded: func => {
					fullyLoadedFuncs.push(func);
				}
			},
			order = "css scripts socketFunctionsToDo events elements loaded",
			keys = order.split(" "),
			optsThatHaveCallback = keys.filter(x => callbackFuncs.includes(x)),
			lengthOf,
			chartKeys = Object.keys(chart)
		opts = t(input, Object) ? input : {};

		var grandCallback = () => {
			Object.keys(opts).forEach((x, i) => {
				!callbackFuncs.includes(x) && 
				(() => {
				
					var temp = t(chart[x], Function) ? () => chart[x](opts[x]) :
						t(this[x], Function) ?
						() => this[x](opts[x]) :
						t(opts[x], Function) ? opts[x] :
						empty;
			
					self.do(temp)
	//			temp()
				})();
			});
		};

		optsThatHaveCallback.forEach((x, i) => {
			this[x](opts[x],
				() => (i >= optsThatHaveCallback.length - 1 && grandCallback()))
			
		});
		optsThatHaveCallback.length < 1 && grandCallback();
	
	}

	

	this.getKey = (index) => {
		return keyCodes[index];
	};

	this.loadScripts = (list, callback) => {
		
		if (list.length > 0) {
			var callback2 = (lastIndex) => {
				
				if (list.length > lastIndex + 1) {
					
					this.loadScript(list[lastIndex + 1], () => {
						callback2(lastIndex + 1);
					});
				} else {
					callback();
				
				}
			}

			this.loadScript(list[0], () => {
				callback2(0);
			});
		} else {
			callback();
		}
	}

	this.loadScript = (url, callback) => {
		var callback = !t(callback, Function) ?
			empty : callback;
		var temp = document.createElement("script");
		var head = document.getElementsByTagName("head")[0];
		var outerCallback = () => {
			callback();
			if (!scriptsLoaded.indexOf(url)) {
				scriptsLoaded.push(url);
			}
		};

		temp.type = "text/javascript";
		temp.src = url;
		temp.async = true;
		temp.defer = true;
		//    temp.onreadystatechange = outerCallback;
		temp.onload = outerCallback;
		temp.onerror = (e) => {
			console.log("there was some error or something", e);
			outerCallback();
		};
		head.appendChild(temp);
	}

	this.loadFile = (url, callback) => {
		if (!callback) {
			callback = () => {
			
			};
		}
		var outerCallback = () => {
			callback();
		};
		var temp = document.createElement("script");
		var head = document.getElementsByTagName("head")[0];
		temp.type = "text/javascript";
		temp.src = url;
		temp.onreadystatechange = outerCallback;
		temp.onload = outerCallback;
		temp.onerror = (e) => {
			//  console.log("there was some error or something", e);
			outerCallback();
		};
		head.appendChild(temp);
	}


	this.Iz = function(data) {
		if (!data) {
			data = {};
		}
		this.sheim = data["sheim"];
		this.el =
			IzList.push(this);
	}

	this.element = function(x) {
		
		
		this.el;
		try {
			this.el = document.createElement(x["tag"] || "div");
		} catch(e) {
			this.el = document.createElement("div");
		}
		var identifier = null,
			el = this.el,
			eventtypes =
			t(x["eventtypes"], String) ?
			x["eventtypes"].split(" ") :
			t(x["eventtypes"], Array) ?
			x["eventtypes"] : [],
			events = t(x["events"], Object) ? x["events"] : {},
			attributes = x["attributes"] || {},
			style = x["style"] || {},
			exclusions = "parent attributes sheim eventtypes events style",
			potentialParent =
			x["elParent"] ||
			c$("#" + x["parent"])[0] ||
			IzList.find(xx =>
				t(xx.data.sheim, String) &&
				xx.data.sheim == x["parent"]
			) ||
			document.body,
			appender =
			t(potentialParent, self.element) && potentialParent.el ?
			potentialParent.el :
			potentialParent



		Object.keys(x).forEach(v => {
			!exclusions.split(" ").includes(v) && (this.el[v] = x[v]);
		});

		Object.keys(events).forEach(ev => {
			var es = ev.split(" ");
			es.forEach(e => {
				t(events[ev], Function) &&
					t(e, String) &&
					this.el.addEventListener(e, events[ev]);

			});
		});

		for (att in attributes) {
			this.el.setAttribute(att, attributes[att]);
		}

		if (t(style, Object)) {
			Object.keys(style).forEach(x => {
				this.el.style[x] = style[x];
			});
		} else if (t(style, String)) {
			this.el.style.cssText = style;
		}

		identifier = attributes["id"] || x["sheim"];
		identifier ? eventtypes.forEach(k => addEvent(this.el, identifier, k)) : 0;

		appender.appendChild(this.el);
		
		
		this.append = function (htmlEl) {
			if (!htmlEl) htmlEl = {};
			var resultEl;

			if (t(htmlEl.tagName, String)) {
			resultEl = htmlEl;
			} else {
			var newEl = new self.element(htmlEl);
			resultEl = newEl.el;

			this.elements.push(newEl);
			}

			this.el && this.el.appendChild(resultEl);
		};

		this.appendTo = function (parentEl) {
			if (t(parentEl.appendChild, Function)) {
				this.el && parentEl.appendChild(this.el);
			}
		};

		this.makeElements = function (elz) {
			var templ = {
				elParent: this.el
			},
			  rez = [];

			(function eleRate(elar) {
				if (t(elar, Array)) {
				  elar.forEach(function (ele) {
					if (t(ele, Object)) {
					  rez.push({
						 ...templ, 
						 ...ele  
					  });
					} else if (t(ele, Array)) {
					  eleRate(ele);
					} else {
					  rez.push({
						...templ, 
						...(analyzeX(ele))
					  });
					}
				  });
				} else if (t(elar, Object)) {
				  rez.push({
					...templ, 
					...elar  
				  });
				}
			})(elz);
			
			function analyzeX(elH) {
				var rezultH = elH
					tagName = "div";
				if(t(elH, String)) {
					var startTag = elH.indexOf("<");
					var endTag = elH.indexOf(">");
					if(startTag < endTag) {
						tagName = elH.substring(startTag + 1, endTag);
						var restOfStr = elH.substring(endTag + 1, elH.length);
						if(elH.length > endTag + 1) {
							
							var endTag = "</" + tagName + ">"
							
							if(restOfStr.indexOf(endTag)) {
								restOfStr = restOfStr.replace(endTag, "");
							}
							rezultH = restOfStr;
							console.log(restOfStr);
							
						}
						console.log(tagName);
						tagName = tagName.split("/").join("");
					}
				}
				return {
					innerHTML:rezultH,
					tag:tagName
				}
			}
			
			rez.forEach(function (x) {
				return new self.element(x);
			}); //	console.log(elz);
			//	var newEl = new self.element(elz);
			//	this.append(newEl);
			//		this.elements.push(newEl);
			//	newEl.append
		};

		if(x.elements) {
			this.makeElements(x.elements);
			/*if(!t(x.elements, Array)) {
				x.elements = [x.elements]
			}
			t(x.elements, Array) &&
				x.elements.forEach(o => {
					t(o, Object) && (new self.element(addToObj(o, {
						elParent: this.el
					})));
				});*/
		}
		x["after"] && (() => {
		//	appender.innerHTML += x.after;
			appender.appendChild((document.createElement(x["after"])));
		})()

		this.data = x;
		IzList.push(this);
		if(t(x.added, Function)) x.added(this)
	};

	this.getIzs = () => {
		return IzList;
	}
	this.getIz = (name) => {
		var found = IzList.find(x => x.data.sheim === name || name === x.data.id);
		if(found) {
			return found.el
		}
	}

	
	this.css = (...args) => {

		var styler = document.createElement("style");
		styler.type = "text/css";
		var innerHTML = "";

		args.forEach(function(x) {
			if (t(x, String)) {
				innerHTML += x;
			}

			if (t(x, Object)) {
				for (var k in x) {
					innerHTML += k + "{";

					if (t(x[k], String)) {
						innerHTML += x[k];
					}

					if (t(x[k], Object)) {
						for (var kk in x[k]) {
							innerHTML += kk + ":" + x[k][kk] + ";";
						}
					}

					innerHTML += "}";
				}
			}


		});
		styler.innerHTML = innerHTML;
		document.head.appendChild(styler);


	};

	function makeElements(els) {
	/*	if(!els) els = []
		if(!t(els, Array)) {
			els = [els];
		}
		els.forEach(x => new self.element(x, document.body))
	*/
		var main = new self.element(
			{
				tag:"span"
			},
			document.body
		)
		main.makeElements(els);
	}

	function addEvent(el, id, type) {
		el.addEventListener(type, (e) => {
			var ev = self.events[id];
			t(ev, Function) && ev(e);
		});
	}

	function addOtherElements() {
		var head = document.getElementsByTagName("head")[0];
		if (head) {
			console.log("added head");
			head.innerHTML += `<meta charset="utf-8"/>`;
		} else {
			console.log("where is the ", document);
		}
	}

	function customSocketFunctions(msg) {
		if (isParseable(msg["data"])) {
			var json = JSON.parse(msg["data"]);
			for (var k in json) {
				if (self.socketFunctionsToDo && self.socketFunctionsToDo[k]) {
					self.socketFunctionsToDo[k](json[k]);
				}
			}
		}
	}

	function socketReconnect() {
		if (self.cobysSocket) {
			console.log("connected to websocket with socket:", self.cobysSocket);
			//    self.cobysSocket.removeAllListeners();
			setTimeout(() => {
				self.startWebsocket();
			}, self.reconnectInterval || 100);
		}
	}

	function setupEventListeners() {
		document.body.addEventListener("keydown", (e) => {
			if (!keyCodes[e.keyCode]) {
				keyCodes[e.keyCode] = true;
			}
		});
		document.body.addEventListener("keyup", (e) => {
			keyCodes[e.keyCode] = false;
		});

	}
	//helper functions


	function c$(string) {
		return document.querySelectorAll(string);
	}

	function id(str) {
		return document.getElementById(str);
	}

	function deepSearch() {
		var els, str, child, func;

		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		if (args.length > 1) {
			els = tt(args[0], Array) || [], property = "tag", str = tt(args[1], String) || "", child = tt(args[2], String) || "", func = args[3];
			els.forEach(function(el, i) {
				if (el[property] == str) {
					tt(func, Function, function(f) {
						var r;

						try {
							r = f(el);
						} catch (_unused) {}

						return r;
					});
				} else if (t(el[child], Array)) {
					deepSearch(el[child], str, child, func);
				}
			});
		} else if (t(args[0], Object)) {
			var o = args[0];
			els = tt(o.array, Array) || [];
			func = tt(o.onfind || o.func, Function);
			var anything = tt(o.anything, Function);

			if (anything) {
				(function findIt(entry) {
					var array = tt(entry, Array),
						obj = tt(entry, Object),
						found = false;

					if (array) {
						array.forEach(function(x, i) {
							if (!found) {
								if (anything(x, array, i)) {
									func(x, array, i);
									found = true;
								} else {
									findIt(x);
								}
							}
						});
					} else if (obj) {
						Object.keys(obj).forEach(function(x) {
							if (!found) {
								if (anything(obj[x], obj, x)) {
									func(obj, obj[x], x);
									found = true;
								} else {
									findIt(obj[x]);
								}
							}
						});
					}
				})(els);

				if (t(args[0].array, Array)) {
					args[0].array = els;
				}
			}
		}
	}

	function f$(string) {
		var result = c$(string)[0];

		if (!result) {
			//    result = document.createElement("div"); //     console.log("cloudn't find " + string, " so making new thing");
		}

		return result;
	}

	function isIteratable(obj) {
		return obj != null && typeof obj[Symbol.iterator] == "function" || _typeof(obj) == "object";
	}

	function tryToStringify(obj) {
		var result = "";

		try {
			result = JSON.stringify(obj);
		} catch (e) {
			console.log(e);
			result = obj;
		}

		return result;
	}

	function strOrObj(str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	}

	function stringifyEntireObject(temp) {
		var obj = {};

		for (var k in temp) {
			var value = obj[k];

			if (isStringable(temp[k])) {
				value = JSON.stringify(temp[k]);
			}

			obj[k] = value;
		}

		return JSON.stringify(obj);
	}

	function isParseable(string) {
		try {
			JSON.parse(string);
			return true;
		} catch (e) {
			return false;
		}
	}

	function objSize(obj) {
		var s = 0;

		for (var k in obj) {
			s++;
		}

		return s;
	}

	function isArray(obj) {
		return !!obj && obj.constructor == Array;
	}

	function findObjPropInArray(objPropKey, objPropValue, arr) {
		var index = null;

		for (var i = 0; i < arr.length; i++) {
			if (arr[i][objPropKey] == objPropValue) {
				index = i;
				break;
			}
		}

		return index;
	}

	function isStringable(json) {
		try {
			JSON.stringify(json);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	function daysInMonth(month, year) {
		return new Date(tt(year, Number) || new Date().getYear() + 1900, tt(month + 1, Number) || new Date().getMonth() + 1, 0).getDate();
	}

	function applyCustomCSSruleListToExistingCSSruleList(customRuleList, existingRuleList, cb) {
		var err = null; // console.log("trying to apply ", customRuleList, " to ", existingRuleList);

		if (customRuleList && customRuleList.constructor == Object && existingRuleList && existingRuleList.constructor == CSSStyleRule) {
			for (var k in customRuleList) {
				existingRuleList["style"][k] = customRuleList[k];
			}
		} else {
			err = "provide first argument as an object containing the selectors for the keys, and the second argument is the CSSRuleList to modify";
		}

		if (cb) {
			cb(err);
		}
	}

	function tt(item, cons, cond) {
		return t(item, cons) ? t(cond, Function) ? cond(item) : item : null;
	}

	function t(item, cons) {
		return item || item === 0 || item === false || item === "" ? cons && cons.constructor === Function ? item.constructor == cons : cons && cons.constructor === String ? item.constructor.name.includes(cons) : item.constructor.name || item.constructor : item;
	}

	function obj(item) {
		return item || {};
	}

	function flatten(array) {
		array.reduce(function(flatResult, next) {
			return flatResult.concat(next);
		}, []);
	}

	function addToObj(base, addition) {
		return Object.fromEntries(Object.entries(tt(base, Object) || {}).concat(Object.entries(tt(addition, Object) || {})));
	}

	function range(min, max) {
		min = t(min, Number) ? min : 0;
		!(t(max, Number) && max > min) && (max = min) & (min = 0);

		for (var i = 0, arr = new(max < 128 ? Int8Array : max < 256 ? Uint8Array : max < 32768 ? Int16Array : max < 65536 ? Uint16Array : max < 2147483648 ? Int32Array : max < 4294967296 ? Uint32Array : Array)(max - min); i < arr.length; i++) {
			arr[i] = i + min;
		}

		return arr;
	}

	function getId(urlS) {
		return urlS.between("https://docs.google.com/document/d/", "/") || urlS.after("https://drive.google.com/open?id=") || urlS.replace("http://localhost:8000/file/", "");
	}

	function iz(str) {
		return self.getIz(str)
	}


	function define() {
		//custom property definitions
		
		var oldR = HTMLElement.prototype.remove;
		HTMLElement.prototype.remove = function() {
			
			if(!this.cobified) {
				if(t(oldR, Function)) { 
					var _k = randomID();
					this[_k] = oldR;
					this[_k]();
					delete this[_k]
				}
			} else {
				console.log("LOL");
			}
		};
		window.rr = oldR
		
		var oldRc = HTMLElement.prototype.removeChild;
		HTMLElement.prototype.removeChild = function(c) {
			if(!c.cobified) {
				if(t(oldRc, Function)) { 
					var _k = randomID();
					this[_k] = oldRc;
					this[_k]();
					delete this[_k]
				}
			} else {
				console.log("LOL YOU THINK YOU CAN REMOVE ME?");
			}
		};
		Object.defineProperty(Array.prototype, 'flatten', {
			value: function(r) {
				for (var a = this, i = 0, r = r || []; i < a.length; ++i)
					if (a[i] != null) a[i] instanceof Array ? a[i].flatten(r) : r.push(a[i]);
				return r
			}
		});


		Object.defineProperties(String.prototype, {
			/*trim: {
				value() {
					return this.filter(x => x!== " " || x!== "	")
				}
			},*/
			at: {
				value(other) {
					var i = this.indexOf(other);
					return i > -1 ? this.substring(i) : null;
				}
			},
			between: {
				value(s, e) {
					return this.indexOf(s) > -1 && this.indexOf(e) > this.indexOf(s) ? this.substring(this.indexOf(s) + 1, this.indexOf(e)) : null
				}
			},
			after: {
				value(a) {
					return this.indexOf(a) > -1 ? this.substring(this.indexOf(a) + 1) : null
				}
			},
			before: {
				value(a) {
					return this.indexOf(a) > -1 ? this.substring(0, this.indexOf(a)) : null
				}
			},
			remove: {
				value(...args) {
					var result = this;
					(t(args[0], Array) ? args[0] : args).forEach(x => {
						result = result.split(x).join("");
					});
					return result;
				}
			},
			includes: {
				value(otherStr) {
					return this.indexOf(otherStr) > -1
				}
			}

		});

		if (!"".includes) {
			Object.defineProperty(String.prototype, "includes", {
				value: function value(r) {
					return this.indexOf(r) > -1;
				}
			});
		}

		if (![].includes) {
			Object.defineProperty(Array.prototype, "includes", {
				value: function value(r) {
					return this.indexOf(r) > -1;
				}
			});
		}


		if (!Object.entries) {
			Object.defineProperty(Object, "entries", {
				value: function value(obj) {
					var result = [];

					for (var k in obj) {
						result.push([k, obj[k]]);
					}

					return result;
				}
			});
		}

		if (!Object.keys) {
			Object.defineProperty(Object, "keys", {
				value: function value(obj) {
					var result = [];

					for (var k in obj) {
						result.push(k);
					}

					return result;
				}
			});
		}

		if (![].keys) {
			Object.defineProperty(Array.prototype, "keys", {
				value: function value() {
					var result = [];

					for (var k in this) {
						result.push(k);
					}

					return result;
				}
			});
		}

		if (!Object.values) {
			Object.defineProperty(Object, "values", {
				value: function value(obj) {
					var result = [];

					for (var k in obj) {
						result.push(obj[k]);
					}

					return result;
				}
			});
		}

		if (!Object.fromEntries) {
			Object.defineProperty(Object, "fromEntries", {
				value: function value(array2D) {
					var result = {};
					array2D.forEach(function(x) {
						result[x[0]] = x[1];
					});
					return result;
				}
			});
		}

		if (![].find) {
			Object.defineProperty(Array.prototype, "find", {
				value: function value(r) {
					var result;

					for (var i = 0; i < this.length; i++) {
						if (this[i] === r) {
							result = r;
							break;
						}
					}

					return result;
				}
			});
		}

		if (![].filter) {
			Object.defineProperty(Array.prototype, "filter", {
				value: function value(r) {
					var result = [];

					for (var i = 0; i < this.length; i++) {
						if (r(this[i])) {
							result.push(this[i]);
						}
					}

					return result;
				}
			});
		}
	}
})();

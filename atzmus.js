var COBY = new(function () {
    //https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js
    var self = this,
        empty = (() => {}),
        keyCodes = [],
        moving = false,
        started = false,
        IzList = [],
		queue = [],
		
		tempTafs = [],
        startFunctions = [],
        fullyLoadedFuncs = [],
        scriptsLoaded = [],
        onStartedEvents = () => {
           
            startFunctions.forEach(x => {
				
                t(x, Function) && x();
				
            });
           
            startFunctions = [];
        },
		doWaitQueue = () => {
			queue.forEach(x => tt(x, Function, y=> y()));
		};
    this.cobysSocket = null,
    this.onready = (f) => {t(f, Function) && f()};
    this.onfullyloaded = () => {
        fullyLoadedFuncs.forEach(x => {
            if(t(x, Function)) {
             x();
             console.log(x);
         }
        });
        fullyLoadedFuncs = [];
    };
	this.addToQueue = (func) => {
		tt(func, Function, x => {
			queue.push(x);
		});
	};
    this.onsocketmessage = empty;
    this.onsocketerror = empty;
    this.onsocketclose = empty;
    this.socketURL = null;
    this.socketFunctionsToDo = null;
    this.scriptsToLoad = [];
	this.makeElements = makeElements;
    this.elements = [];
    this.events = {};
	this.mouseEvent = {};
    define();
	this.tt = tt;
	this.t = t;
	this.iz = iz;
	this.id = id;
	this.c$ = c$;
	this.daysInMonth = daysInMonth;
	this.range = range;
	this.deepSearch = deepSearch;
	
    this.start = (callback) => {
        if(!started) {
            makeElements(self.elements);
 
            this.loadScripts(this.scriptsToLoad, () => {
                this.startWebsocket(() => {
                    if (callback) {
                        callback();
                    }
                });
            });
            started = true;
        }
    };
    
	document.addEventListener("mousemove", e => {
		self.mouseEvent = e;
	});
 
    document.addEventListener("readystatechange", e => {
        if(e.target.readyState === "interactive") {
            self.onready();
            self.start();
            onStartedEvents();
			doWaitQueue();
        }
        if(e.target.readyState === "complete") {
            self.onfullyloaded();
        }
    });
 
    this.CobySocket = function(opts) {
        if (!opts) opts = {};
        var url = t(opts, String) ? opts : t(opts, Object) ? opts.url : null;
        this.onmessage = opts.onmessage || (() => {});
        this.onerror = opts.onerror || (() => {});
        this.onopen = opts.onopen || (() => {});
        var functionDataToDo = {},
            listeners = opts.listeners || {},
            Q = [];
        console.log(url);
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

            this.ws.onmessage = m => {
                this.onmessage(m);
                
                if (isParseable(m.data)) {
                    var j = JSON.parse(m.data);
                    for (var k in j) {
                        functionDataToDo[k] = j[k];
                        if (t(listeners[k], Function)) {
                            listeners[k](functionDataToDo[k]);
                        }
                        
                    }
   
                } else {

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
                    this.ws.send(tryToStringify(msg));
                };
                if(this.ws.readyState == WebSocket.OPEN) {
                    func();
                } else {
                    Q.push(func);
                }
            };
   
        }
    };

    this.googleLogin = cb => {

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
                data
            : t(data,String) ?
                [data]
            : [];
        this.loadScripts(d, () => {
            t(cb, Function) && cb();
        });
    };
 
    this.script = this.scripts;
	/*this.Mouse = new function() {
		this.screenX = 0;
		this.screenY = 0;
		this.clientX = 0;
		this.clientY = 0;
	}();*/
    this.go = (opts) => {
		var input,
			func;
		if(t(opts, Object)) {
			input = opts;
		} else if(t(opts, Function)) {
			func = opts;
			tt(opts(this), Object, oo => input = oo);
		}
		
		self.tafkids = {
			...self.tafkids,
			...({
				test(d){return {innerHTML:"testing"}}
			})
		};

		Object.entries(tt(input["tafkids"], Object) || {}).forEach(x => {
			self.setTafkid(x[0], x[1]);
		//	console.log(x[0], x[1]);
		});
		
		tt(opts, Function, oo => input = oo(this));
		
        var callbackFuncs = "scripts script",
        callback,
        chart = {
			tafkids(data) {
				/*
				if(t(data, Object)) {
				
					self.tafkids = {
						...self.tafkids,
						...data
					};
					
				}
				
				tempTafs.forEach(x=>x.activate());*/
				
			},
			css: self.css,
            elements: makeElements,
            socketFunctionsToDo: data => {
                self.socketFunctionsToDo = addToObj(self.socketFunctionsToDo,data)
            },
            events: data => {
                (self.events = data);
            },
			
            scripts: data => {
                self.scripts(data, () => {
                    callbacks.push(() => {
 
                    });
                });
            },
            loaded: func => {
                fullyLoadedFuncs.push(func);
            }
        },
        order = "css scripts socketFunctionsToDo events elements loaded",
        keys = order.split(" "),
        optsThatHaveCallback = keys.filter(x=>callbackFuncs.includes(x)),
        lengthOf;
 
       
       opts = t(input, Object) ? input : {};
       
 
        var grandCallback = () => {
            keys.forEach((x, i) => {
                !callbackFuncs.includes(x) && (() => {
                    var temp =
                    t(chart[x], Function) ?
                        () => chart[x](opts[x])
                    : t(this[x], Function) ?
                        () => this[x](opts[x])
                    : t(opts[x], Function) ?
                        opts[x]
                    :
                        empty;
				/*	if(keys.indexOf("elements") == i + 1) {
						console.log("L O MENTO", i, opts = func(this), opts);
					}*/
                    started ? temp() : startFunctions.push(temp);
					
                })();
               
            });
        };
 
        optsThatHaveCallback.forEach((x,i)=> {
            this[x](opts[x], () => {
              
                i >= optsThatHaveCallback.length - 1 && (
                    grandCallback()
                );
            });
        });
 
        optsThatHaveCallback.length < 1 && grandCallback();
 
 
    };
 
    this.do = func => {
        t(func, Function) ?
            started && func()
        :
            startFunctions.push(func);
    };
 
    this.getKey = (index) => {
        return keyCodes[index];
    };
 
    this.loadScripts = (list, callback) => {
        //console.log("did it");
        if (list.length > 0) {
            var callback2 = (lastIndex) => {
                //  console.log("yay?");
                if (list.length > lastIndex + 1) {
                    //      console.log("still got more");
                    this.loadScript(list[lastIndex + 1], () => {
                        callback2(lastIndex + 1);
                    });
                } else {
                    callback();
                    //      console.log("oy");
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
        var callback =
            !t(callback, Function) ?
                empty : callback;
        var temp = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        var outerCallback = () => {
            callback();
            if(!scriptsLoaded.indexOf(url)) {
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
                //      console.log("hi");
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
 
    this.startWebsocket = (callback) => {
        if (this.socketURL != null) {
            console.log("just starte!");
 
            this.cobysSocket = new WebSocket(this.socketURL);
            this.cobysSocket.onopen = function (msg) {
 
                if (callback) {
                    callback(msg);
                }
            };
            this.cobysSocket.binaryType = "blob";
            this.cobysSocket.onerror = (err) => {
                switch (err.code) {
                    case "ECONNREFUSED":
                        socketReconnect();
                        break;
                    default:
                        this.onsocketerror(err);
                        break;
                }
            };
 
            this.cobysSocket.onmessage = (msg) => {
                if (this.socketFunctionsToDo) {
                    customSocketFunctions(msg);
 
                }
                this.onsocketmessage(msg);
            };
 
            this.cobysSocket.onclose = (maybe) => {
                switch (maybe.code) {
                    case 1000:
                        break;
                    default:
                        this.onsocketclose(maybe);
                        socketReconnect();
                        break;
                }
            };
 
        } else {
            if (callback) callback("No socket URL specified, so not making a socket.");
        }
    }
 
 
    this.alert = (cb, data) => {
 
        var div = document.createElement("div");
 
        if (!data) {
            data = {};
        }
        var elsData = data["elements"] || [];
        var els = [];
        var sub = null;
        for (var i = 0; i < elsData.length; i++) {
            var elData = {
                elParent: div,
                attributes: {},
                newlineAfter: true
            };
            var d = {};
            var c = elsData[i];
            if (c["label"]) {
                elData.tag = "span";
                elData.innerHTML = c["label"];
                elData.attributes["class"] = "alertInput";
            } else if (c["input"]) {
                elData.tag = "input";
                elData.attributes["class"] = "alertInput";
            } else if (c["submit"]) {
 
                elData.innerHTML = c["submit"]
                elData.tag = "button";
                elData.attributes["class"] = "alertBtn";
            }
 
            var myEl = new self.element(elData);
            myEl.el.className = "test";
            els.push({
                data: elsData[i],
                el: myEl
            });
        }
 
 
        var submit = document.createElement("button");
        var user = document.createElement("input");
        var pass = document.createElement("input");
        div.appendChild(user);
        div.appendChild(pass);
        div.appendChild(submit);
        submit.innerHTML = typeof data["submitText"] == "string" ? submitText : "Ok";
        submit.onclick = () => {
 
            var userVal = user.value,
                passVal = pass.value;
            if (cb) {
                cb({
                    username: userVal,
                    password: passVal
                });
            }
            div.parentNode.removeChild(div);
        }
        els.forEach(x => {
            if (x["data"]["submit"]) {
                //   x["el"].addEvent = "asodk";
                // console.log(x);
                sub = x["el"];
            }
        });
        if (sub) {
            sub.innerHTML = "asdfg";
            sub["el"].onclick = () => {
                //  console.log("click");
                var values = [];
                for (var i = 0; i < els.length; i++) {
                    var c = els[i];
                    if (c["data"]["input"]) {
                        values.push({
                            input: c["data"]["input"],
                            value: c["el"]["el"].value
                        });
                    }
                }
                if (cb) {
                    cb(values);
                }
 
            };
 
 
        }
 
        div.className = data["custom class"] || "alerter";
        document.body.appendChild(div);
 
    }
 
    this.socketSend = (msg) => {
        if (this.cobysSocket) {
 
 
            var s = tryToStringify(msg);
            if(this.cobysSocket.readyState == WebSocket.OPEN) {
                this.cobysSocket.send(s);
            } else {
                console.log("the state of this socket is ", this.cobysSocket.readyState);
            }
        }
    };
 
    this.Iz = function(data) {
        if(!data) {
            data = {};
        }
        this.sheim = data["sheim"];
        this.el =
        IzList.push(this);
    }
	
	var allEvents = "click blur input keyup keydown keypress change focus mouseup mousedown",
		changeEvent = new Event("change");
	
    this.element = function (x, mainAppender) {
		if(!mainAppender) mainAppender = {};
		var thatEl = this;
		this.elements = [];
		this.append = (htmlEl) => {
			if(!htmlEl) htmlEl = {};
			var resultEl;
			if(t(htmlEl.tagName, String)) {
				resultEl = htmlEl;
			} else {
				var newEl = new self.element(htmlEl);
				resultEl = newEl.el;
				this.elements.push(newEl);
			}
			this.el && this.el.appendChild(resultEl);
		};
		this.appendTo = (parentEl) => {
			if(t(parentEl.appendChild, Function)) {
				this.el && parentEl.appendChild(this.el);
			}
		};
		
		this.makeElements = elz => {
			
			var templ = {
				elParent:this.el
			}, rez = [];
			(function eleRate(elar) {
				if(t(elar, Array)) {
					elar.forEach(ele => {
						if(t(ele, Object)) {
							rez.push({
								...templ,
								...ele
							});
						} else if(t(ele, Array)) {
							eleRate(ele);
						} else {
							rez.push({
								...templ,
								innerHTML: ele
							})
						}
					});
				} else if(t(elar, Object)) {
					rez.push({
						...templ,
						...elar
					});
				}
			})(elz);
			rez.forEach(x => new self.element(x));
		//	console.log(elz);
		//	var newEl = new self.element(elz);
		//	this.append(newEl);
			
	//		this.elements.push(newEl);
		//	newEl.append
		};
		if(t(x, Array)) {
			x = x.flatten();
			x = {
				elements: x
			};
		}
		if(!t(x, Object)) {
			if(x !== undefined && x !== null) {
				x = {
					innerHTML: x
				};
			} else {
				x = {
				
				};
			}
		} 
		thatEl.el = document.createElement(x["tag"] || "div");
		var identifier = null,
			el = thatEl.el,
			eventtypes =
				t(x["eventtypes"],String) ?
					x["eventtypes"].split(" ")
				:
					t(x["eventtypes"],Array) ?
						x["eventtypes"]
				:
					[],
			events = t(x["events"], Object) ? x["events"] : {},
			attributes = x["attributes"] || {},
			style = x["style"] || {},
			exclusions = "parent attributes sheim eventtypes events style",
			valued = "textarea input",
			validation = tt(x.validation, Object),
			ons = [],
			
			potentialParent =
				x["elParent"] ||
				c$("#" + x["parent"])[0] ||
				IzList.find(xx =>
					xx.data && t(xx.data.sheim, String) &&
					xx.data.sheim == x["parent"]
				) ||
				mainAppender,
			appender =
				t(potentialParent,self.element) && potentialParent.el ?
					potentialParent.el
				:
					potentialParent
 
	   
		
		
		Object.keys(x).forEach(v => {
			
			if(t(v, String) && v.length > 2 && v.slice(0,2) === "on") {
				var onevents = v.split(" ");
				onevents.forEach(ov => {
					if(t(x[v], Function))
						ons.push({
							name:ov,
							func:x[v]
						});
				});
			}
			
			
		});
		
		if(t(x.tag, String) && valued.split(" ").includes(x.tag)) {
		//	console.log(el);
			Object.defineProperty(el, "value", {
				get: () => el.getAttribute("value"),
				set(newValue) {
					el.setAttribute("value", newValue);
					el.dispatchEvent(new Event("change"));
				}
			});
		}
		
		ons.forEach(o => {
			var xo = o.func;
			x[o.name] = validate(xo);
		});
		
		if(validation) {
			var list = "keydown input change";
			list.split(" ").forEach(l => {
				var k = "on" + l,
					old = x[k];
				x[k] = validate(old);
			});
		}

		var oldSel=thatEl.el.selectionStart;
		var oldVal = "";
		function validate(rest) {
			return function(e) {
				if(validation) {
					
					
					var voa=tt(validation.only, "Array") || tt(validation.only, String, s=> s.split("")),
						voe=tt(validation.exclude, "Array") || tt(validation.exclude, String, s=> s.split("")),
						cond=tt(validation.condition, Function) || (()=>true);
					
					var v = e.target && e.target.value || "",
						newv="",
						invalid=false;
					if(cond(v)) oldVal = v;
					for(var i = 0; i < v.length; i++) {
					
						if(
							voa && voa.includes(v[i]) && 
							voe && !voe.includes(v[i]) &&
							cond(v)
						) {
							newv += v[i];
						}
						else {
							invalid=true;
							if(!cond(v)) {
								newv = oldVal;
							}
						//	newv = e.target.value;
						};
							
					}
					
					//, s=> console.log(s,oldSel,s(0,0)))
					if(invalid) {
						e.target.value=newv;
						if(t(thatEl.el.setSelectionRange, Function))
							thatEl.el.setSelectionRange(oldSel,oldSel);
					} else {
						oldSel=thatEl.el.selectionStart
					}
			//		console.log(newv);
	
				}
				t(rest, Function) && rest(e);
				
			}
		}
		Object.keys(x).forEach(v => {
			!exclusions.split(" ").includes(v) && (thatEl.el[v] = x[v]);
		});
		
		Object.keys(events).forEach(ev => {
			var es = ev.split(" ");
			es.forEach(e => {
				t(events[ev], Function) &&
				t(e, String) &&
				thatEl.el.addEventListener(e, validate(
						events[ev]
					)
				);
				
			});
		});
 
		for (att in attributes) {
			thatEl.el.setAttribute(att, attributes[att]);
		}
		
		if(t(style, Object)) {
			Object.keys(style).forEach(x => {
				thatEl.el.style[x] = style[x];
			});
		} else if(t(style, String)) {
			thatEl.el.style.cssText = style;
		}
 
		identifier = attributes["id"] || x["sheim"];
		identifier ? eventtypes.forEach(k => addEvent(thatEl.el, identifier, k)) : 0;
	
		var elz = x.elements || x.element;
		
		tt(elz, Array, ea => (this.elements = this.elements.concat(ea)));
		if(elz) {
			this.makeElements(elz);
		}   
	   
		x["newlineAfter"] && appender.appendChild((document.createElement("br")));
		
		this.data = x;
		this.htmlify = () => {
			return this.el.outerHTML;
		};
		
		if(t(appender.appendChild, Function)) {
			appender.appendChild(thatEl.el);
			tt(x.added || x.onadded || x.appended || x.onadd || x.onappend || x.onappended, Function, f => f(this,thatEl.el));
			IzList.push(this);
		}
		
		
    };
	
	this.htmlify = elementData => {
		var els = [],	
			rez = "";
		if(t(elementData, Array)) {
			var a = elementData.flatten();
			a.forEach(x => {
				els.push(x);
			});
		} else {
			els.push(elementData);
		}
		els.forEach(x => {
			var myEl = !t(x, self.element) ? new self.element(x) : x,	
				el = myEl.el;
			
			if(el) {
				
				rez += el.outerHTML;
			} else {
				console.log("NOOO",x, elementData, myEl);
			}
		});
	
		return rez;
	};

    this.getIzs = () => {
        return IzList;
    }
	this.getIz = (name) => {
        return IzList.find(x => x && x.data && x.data.sheim === name || name === x.data.id);
    }
 
    this.displayJSON = (json, options) => {
        var opts = options || {
 
        };
        var cEl = new this.element({
            "parent": opts["holder"] || null
        });
        var el = cEl["el"];
        if (el) {
            //   console.log("found element ", el);
            if (isArray(json)) {
                var a = json;
                a.forEach(x => {
                    var node = this.jsonNodeElement(x);
                    el.appendChild(node);
                });
            }
 
        }
    }
 
    this.jsonNodeElement = (jsonNode) => {
        var holder = new this.element({
            "don't add": true
        });
        var nodeSize = objSize(jsonNode);
        //       console.log("node size:", nodeSize);
        var index = 0;
        for (var k in jsonNode) {
            var fieldName = k;
            var field = jsonNode[k];
            var needsComma = (nodeSize > index + 1);
            //           console.log("need it? ", needsComma);
            var fieldEl = new this.element({
                parentEl: holder.el,
                tag: "span",
                innerHTML: fieldName + ":" + field + (needsComma ? "," : "")
            });
            index++;
        }
        return holder.el;
    }
 
    this.css = (...args) => {
  
		var styler = document.createElement("style");
		styler.type = "text/css";
		var innerHTML = "";

		args.forEach(function (x) {
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
	}	
 
    function makeElements(els) {
		
        els.forEach(x => new self.element(x, document.body));
    }
 
    function addEvent(el, id, type) {
        el.addEventListener(type, (e) => {
            var ev = self.events[id];
            t(ev,Function) && ev(e);
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
 
 
    //threeJS
    this.world = {};
 
 
    var s, c, r, interval;
 
 
    this.startTHREEjsScene = () => {
        setupEventListeners();
        this.world.scene = new THREE.Scene();
        this.world.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.world.renderer = new THREE.WebGLRenderer();
        r = this.world.renderer;
        s = this.world.scene;
        c = this.world.camera;
 
        var resizeRenderer = () => {
            c.aspect = window.innerWidth / window.innerHeight;
            c.updateProjectionMatrix();
            this.world.renderer.setSize(window.innerWidth, window.innerHeight);
        }
 
        window.addEventListener("resize", resizeRenderer);
        resizeRenderer();
 
        document.body.appendChild(this.world.renderer.domElement);
        var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
            color: "blue"
        }));
        s.add(cube);
 
 
        r.gammeOutput = true;
        r.gammaFactor = 2.2;
 
        var light = new THREE.DirectionalLight(0xffffff, 1);
        s.add(light);
        light.position.x = 4;
 
        var light1 = new THREE.DirectionalLight(0xffffff, 1);
        s.add(light1);
 
        var light2 = new THREE.DirectionalLight(0xffffff, 1);
        s.add(light2);
        light2.position.y = -4;
 
        var light3 = new THREE.DirectionalLight(0xffffff, 1);
        s.add(light3);
        light3.position.y = 4;
        var loader = new THREE.GLTFLoader(),
            mixer;
        var clock = new THREE.Clock();
        loader.load(
            "models/cubed.glb",
            (cube) => {
                automaticallyAddLightsTo(cube.scene);
                s.add(cube.scene);
 
                var thingy = cube.scene;
                mixer = new THREE.AnimationMixer(thingy);
                this.cobysMixer = mixer;
                var clips = cube.animations;
                var update = () => {
 
                    //  var dt = clock.getDelta();
                    mixer.update(clock.getDelta());
                    requestAnimationFrame(update);
                    //console.log("updateing");
                }
                update();
                clips.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
 
                //console.log(cube);
            }
        );
        var controls = new THREE.OrbitControls(c, r.domElement);
        c.position.z = 5;
        var frameCount = 0;
        var renderLoop = () => {
            requestAnimationFrame(renderLoop);
 
            r.render(s, c);
 
            //  var data = {"frameCount":frameCount,"dataURL":r.domElement.toDataURL()};
            if (keyCodes[39]) {
                cube.position.x += 0.3;
            }
 
            if (keyCodes[38]) {
                cube.position.z += 0.3;
            }
 
            if (keyCodes[37]) {
                cube.position.x -= 0.3;
            }
 
            if (keyCodes[40]) {
                cube.position.z -= 0.3;
            }
 
            if (keyCodes[13]) {
                cube.position.y -= 0.3;
            }
            if (moving) {
                var position = {
                    "x": cube.position.x,
                    "y": cube.position.y,
                    "z": cube.position.z
                };
            }
 
        }
        renderLoop();
 
        function findMonkey(inputScene) {
            var result = null;
            inputScene.children.forEach((x) => {
                if (x.name.includes("Armature")) {
 
                    if (x.children.length > 1) {
                        result = x.children[1];
                    }
                }
            });
            return result;
        }
 
        function automaticallyAddLightsTo(inputScene) {
            inputScene.children.forEach((x) => {
                var light = new THREE.DirectionalLight(0xffffff, 0), //placeholder
                    isActuallyALight = false;
                if (x.name.includes("Sun")) {
                    light = new THREE.DirectionalLight(0xffffff, 1);
                    isActuallyALight = true;
                } else if (x.name.includes("Point")) {
                    light = new THREE.PointLight(0xffffff, 1, 100);
                    isActuallyALight = true;
                } //etc for other lights
                light.position.copy(x.position);
                light.rotation.copy(x.rotation);
                light.scale.copy(x.scale);
                light.quaternion.copy(x.quaternion);
                if (isActuallyALight)
                    s.add(light);
            });
        }
    };
	
	
	 //helper functions

	 function c$(string) {
		return document.querySelectorAll(string);
	 }
	 
	 function id(str) {
		return document.getElementById(str);
	 }
	 
	function deepSearch(...args) {
		var els, str, child, func;
		if(args.length > 1) {
			els = tt(args[0], Array) || [],
			property = "tag",
			str = tt(args[1], String) || "",
			child = tt(args[2], String) || "",
			func = args[3];
			els.forEach((el, i) => {
				if(el[property] == str) {
					tt(func, Function, f => {
						var r;
						try {
							r = f(el)
						} catch {
						
						}
						return r;
					});
				} else if(t(el[child], Array)){
					deepSearch(el[child], str, child, func);
				}
				
			});
		} else if(t(args[0], Object)) {
			var o = args[0];
			els = tt(o.array, Array) || [];
			func = tt((o.onfind || o.func), Function);
			var anything = tt(o.anything, Function);
			if(anything) {
				(function findIt(entry) {
					var array = tt(entry, Array),
						obj = tt(entry, Object),
						found = false;
					if(array) {
						array.forEach((x, i) => {
							if(!found) {
								if(anything(x,array,i)) {
									func(x, array, i);
									found = true;
								} else {
									findIt(x);
								}
							}
						});
					} else if(obj) {
						Object.keys(obj).forEach(x => {
							if(!found) {
								if(anything(obj[x], obj, x)) {
									func(obj, obj[x], x);
									found = true;
								} else {
									findIt(obj[x]);
								}
							}
						});
					}
				})(els);
				if(t(args[0].array, Array)) {
					args[0].array = els;
				}
			}
		}
		
	}
	 
	 function f$(string) {
		var result = c$(string)[0];
		if (!result) {
			result = document.createElement("div");
			//     console.log("cloudn't find " + string, " so making new thing");
		}
		return result;
	 }
	 
	 function isIteratable(obj) {
		return (obj != null && typeof obj[Symbol.iterator] == "function") || typeof obj == "object";
	 }
	 
	 function tryToStringify(obj) {
		var result = "";
		try {
			result = JSON.stringify(obj);
		} catch (e) {
			console.log(e);
			result = obj
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
		return new Date(
			tt(year, Number) || (new Date()).getYear() + 1900, 
			tt(month + 1, Number) || (new Date()).getMonth() + 1, 0
		).getDate();
	}
	
	 function applyCustomCSSruleListToExistingCSSruleList(customRuleList, existingRuleList, cb) {
		var err = null;
		// console.log("trying to apply ", customRuleList, " to ", existingRuleList);
		if (customRuleList && customRuleList.constructor == Object && existingRuleList && existingRuleList.constructor == CSSStyleRule) {
			for (var k in customRuleList) {
				existingRuleList["style"][k] = customRuleList[k];
			}
	 
		} else {
			err = ("provide first argument as an object containing the selectors for the keys, and the second argument is the CSSRuleList to modify");
		}
		if (cb) {
			cb(err);
		}
	 }
	 
	 function tt(item, cons, cond) {
		return t(item, cons) ? t(cond,Function) ? cond(item) : item : null;
	 }

	 function t(item, cons) {
		return (item || item === 0 || item === false || item === "") ?
				(cons && cons.constructor === Function) ?
					item.constructor == cons
				: 
				(cons && cons.constructor === String) ?
					item.constructor.name.includes(cons)
				:
					item.constructor.name || item.constructor
			:
				item
	 }
	 
	 function obj(item) {
		return item || {};
	 }
	 
	 function flatten(array) {
		array.reduce((flatResult, next) => flatResult.concat(next), []);
	 }
	 
	 function addToObj(base, addition) {
		return Object.fromEntries(
					Object.entries(tt(base, Object) || {})
					.concat(
						Object.entries(
							tt(addition, Object) || {}
						)
					)
				)
	 }
	 
	 
	 function range(min,max) {
		min = t(min, Number) ? min : 0;
		!(t(max, Number) && max > min) && (
			(max = min) & (min = 0)
		);
		for(var i = 0, arr = new (
			max < 128 ? Int8Array :
			max < 256 ? Uint8Array :
			max < 32768 ? Int16Array :
			max < 65536 ? Uint16Array :
			max < 2147483648 ? Int32Array :
			max < 4294967296 ? Uint32Array :
			Array
		)(max - min); i <  arr.length; i++) arr[i] = i + min;
		return arr;
	 }
	 
	 function getId(urlS) {
		return (
			urlS.between("https://docs.google.com/document/d/","/") ||
			urlS.after("https://drive.google.com/open?id=") ||
		  urlS.replace("http://localhost:8000/file/", "")
		);
	 }
	 function iz(str) {
		var rez = COBY.getIz(str);
		return rez ? rez.el : document.createElement("div");
	} 

	function define() {
		//custom property definitions
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
				value(s,e) {
					return this.indexOf(s) > -1 &&  this.indexOf(e) > this.indexOf(s) ? this.substring(this.indexOf(s) + 1,this.indexOf(e)) : null
				}
			},
			after: {
				value(a) {
					return this.indexOf(a) > -1 ? this.substring(this.indexOf(a) + 1) : null
				}
			},
			before: {
				value(a) {
					return this.indexOf(a) > -1 ? this.substring(0,this.indexOf(a)) : null
				}
			},
			remove: {
				value(...args) {
					var result = this;
					(t(args[0], Array) ? args[0] : args).forEach(x=> {
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
			  array2D.forEach(function (x) {
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
		var arrs=[
			Int8Array,
			Uint8Array,
			Int16Array,
			Uint16Array,
			Int32Array
			
		];
		arrs.forEach(x=>{
			Object.defineProperty(x.prototype, "map", {
				value: function value(r) {
				  var result = [];

				  for (var i = 0; i < this.length; i++) {
					  result.push(r(this[i], i));
				  }

				  return result;
				}
			});
		});
		
	}
	
	this.Tafkid = function(opts) {
		if(!opts) opts = {};
		this.name = tt(opts.name, String);
	};
	
	this.getTafkid = (...args) => {
		var str = tt(args[0], String),
			arr = tt(args[0], Array),
			obj = tt(args[0], Object);
		if(obj) arr = [obj];
		var rez,
			arrayRez;
		function tafin(str, ...myArgs) {
		
			var func = self.tafkids[str],
				tmpRez = {};
			if(t(func, Function)) {
				var newArgs = myArgs.splice(1);
				tmpRez = newArgs.length > 0 ? func(...newArgs) : func;
			}
			return tmpRez;
		}
		var time = 0;
		function objectify(ob) {
			if(!t(ob, Object)) ob = {};
			/*var rez = Object.entries(ob).map(x => {
				var value = x[1];
				
				if(!t(value, Array)) {
			//		console.log(value, x);
					value = ["", value];
		//	var newArray = [value];
			//		result = tafin(x[0], value)
				} else {
					value = [""].concat(value);
				}
			//	console.log("doing", time++);
				var result = tafin(x[0], value);
				
				return result;
			});*/
			var rez = [];
			Object.keys(ob).forEach(x => {
	
				rez.push(tafin(x, x,ob[x]));
			});
			
			return rez;
		}
		
		if(str) {
			rez = tafin(str, ...args);
		}
		
		if(arr) {
			arrayRez = [];
			arr.forEach(x => {
				if(t(x, Array)) {
					var key = tt(x[0], String);
					if(key) {
						arrayRez.push(tafin(key, x));
					}
				} else if(t(x, Object)) {
					arrayRez.push(objectify(x));
				}
			});
		}
		//console.log(arrayRez);
		return arrayRez || rez;
	};
	
	this.setTafkid = (...args) => {
		var str = tt(args[0], String);
		var rez;
		if(str && args.length > 1) {
			self.tafkids[str] = args[1];
		}
		rez = self.tafkids[str];
		return rez;
	};
	
	this.taf = this.getTafkid;
	//tafkids
	this.tafkids = {
		contains(rect2,rect1) {
			return (
				rect1.x > rect2.x &&
				rect1.x <= rect2.x + rect2.width &&
				rect1.y > rect2.y &&
				rect1.y <= rect2.y + rect2.height
			)
		},
		
		boundsOf(element) {
			if(!element) element = {};
			var result = {
				x:element.offsetLeft || element.x,
				y:element.offsetTop || element.y + 
					(document.body ? document.body.scrollTop : 0),
				width:element.offsetWidth || 0,
				height:element.offsetHeight || 0,
			};
			return result;
		},
		select(op) {
			var options = op.options || {},
				result = {
					...(op),
					tag:"select",
					elements: Object.keys(options).map(x => ({
						tag:"option",
						value: options[x],
						innerHTML: x
					}))
				};
			
			return result;
		},
		btn(data) {
			var rez = "",
				exclusions = "hoverAmount activeAmount rgbBase rgbHover rgbActive selector";
				hoverAmount = data.hoverAmount || 50,
				activeAmount = data.activeAmount || 50,
				
				rgbBase = data.rgbBase || [0,0,0],
				rgbHover = rgbBase.map(x => 
					x < 256 + hoverAmount ? x + hoverAmount : x
				),
				rgbActive = rgbBase.map(x => 
					x - activeAmount > 0  ? x - activeAmount : x
				);
				
			const txtColor = rgb => (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 125 ? "black" : "white";
			if(data.selector) {
				rez = `
					${data.selector} {
						user-select:none;
						background-color: rgb(${rgbBase.join(",")});
						color:${txtColor(rgbBase)};
						`;
				for(var k in data) {
					if(!exclusions.split(" ").includes(k)) {
						rez += k+":"+data[k]+";";
						console.log("ya", k, data[k]);
					}
				}
				rez += `
					}
					
					${data.selector}:hover {
						background-color: rgb(${rgbHover.join(",")});
						cursor: pointer;
						color: ${txtColor(rgbHover)};
					}
					
					${data.selector}:active {
						background-color: rgb(${rgbActive.join(",")});
						color: ${txtColor(rgbActive)};
					}
				`;
			}
			return rez;
		},
		wors: a =>  "hi",
		table: data => range(0,tt(data.rows, Number) || 1).map((x,i) => ({
				innerHTML:tt(data.row, Function, f => f(i)) || "",
				className:data.rowClass || "" + " cob_row",
				elements: range(0, tt(data.columns, Number) || 1).map((x,u) => {
					var rez = ({
						tag:"span",
						className:data.columnClass || "" + " cob_col"
					});
					tt(data.column, Function, f => {
						var column = f(i,u);
						if(!(t(column, String) || t(column, Number))) {
							rez.elements = column;
						} else {
							
							rez.innerHTML = column;
							console.log("elemental?", column, rez);
						}
					});
					
					return rez;
				})
			})),	
		datePicker(data) {
			var clicked = false;
			var myId = Date.now();
			var date,
				today = new Date(),
				originalDate,
				datePickerEl,
				currentMonthName,
				currentYear/* = today.getYear() + 1900*/,
				daysOfMonth,
				monthName,
				dd,
				input,
				shown = false,
				days = "Su Mo Tu We Th Fr Sa",
				x = 0,
				y = 0,
				width = 0,
				height = 0,
				monthListHolder,
				monthList = "January Februrary March April May June July August September October November December";
			
			var result = {
				
				tag:"span",
				onclick() {
					if(input) {
				//		input.focus();
					}
				},
				elements: [
					{
						tag:"input",
						name: data.name,
						sheim:"input"+myId,
						type:"hidden",
					},
					{
						sheim:"dateDisplay"+myId,
						className:"dateDisplay",
						innerHTML:data.placeholder || "Click here",
						"onblur onclick ondragend": (e) => {
							var izzer = iz("input"+myId);
							if(!shown) {
								
								if(izzer) {
									e.type != "blur" && showCalender(izzer.value);
								}
								console.log("lol");
								shown = true;
							} else {
								if(datePickerEl) {
									var bounds = self.taf("boundsOf", datePickerEl);
									
									var domBounds = datePickerEl.getBoundingClientRect();
									domBounds["y"] = domBounds["y"] + document.body.scrollTop;
									
									var mouseBounds = self.taf("boundsOf", self.mouseEvent);
									var contains = self.taf("contains", domBounds, mouseBounds);
								
									var val = "";
									
									!contains && hideCalender();
								}
							}
						},
						/*onchange(e) {
							var parsed = Date.parse(e.target.value);
							console.log(e.target.value);
							if(!isNaN(parsed)) {
								var newDate = new Date(parsed);
								changeMonth(newDate);
							}
						}*/
					},
					{
						className: "datePickerBox",
						sheim:"data_picker"+myId,
						style: {
							display:"none"
						},
						elements: [
							
							
							{
								className:"arrowHolders",
								elements: [
									{
										innerHTML:"Previous", tag:"span",
										className:"btnL",
										onclick() {
											date.setMonth(date.getMonth() - 1);
											changeMonth(date);
										}
									},
									{
										
										tag:"span",
										sheim:"monthListHolder" + myId,
										elements: monthListEl()
									},
									{
										
										tag:"span",
										
										elements: self.taf("select", {
											className:"yearName",
											sheim:"yearName"+myId,
											options: Object.fromEntries(
												range(0,7).map(x => 
													(new Date()).getYear() + 1900 + x
												).map((x,i) => 
													[
														x,
														x
													]
												)
											),
											onchange(e) {
												var newChangeDatge = new Date(
													parseInt(e.target.value), currentMonthName
												);
												console.log(parseInt(e.target.value), currentMonthName,newChangeDatge);
												changeMonth(newChangeDatge);
											}
										})
									},
									{
										innerHTML:"Next", tag:"span",
										className:"btnR",
										onclick() {
											date.setMonth(date.getMonth() + 1);
										
											changeMonth(date);
										}
									},
									/*{
										innerHTML:"X", tag:"span",
										className:"cancelX",
										onclick() {
											hideCalender();
										}
									},*/
									
								]
							},
							{
								tag:"br"
							},
							{
								sheim:"months"+myId,
								elements: []
							},
						]
					}
				]
			};
			
			function monthListEl(data) {
				if(!t(data, Object)) data = {};
				var monthIndex = 0,
					startAt = tt(data.startAt, Number) || 0;
				return self.taf("select", {
					className:"monthName",
					id:"monthName"+myId,
					options: Object.fromEntries(
						monthList.split(" ")
						.filter((x, i) => {
						/*	t(data.startAt, Number) ? 
								i >= data.startAt ? true : false
							:*/
							if(i < startAt) {
								monthIndex++;
							} else {
								return true;
							}
						})
						.map((x,i) => 
							[
								x,
								monthIndex + i
							]
						)
					),
					onchange(e) {
						var newChangeDatge = new Date(
							currentYear, parseInt(e.target.value)
						);
				
						changeMonth(newChangeDatge);
					}
				})
			}
			
			
			
			function copyDate(d) {
				return new Date(d);
			}
			
			function totalDays(date) {
				if(t(date, Date)) {
					return new Date(
						date.getYear() + 1900, 
						date.getMonth() + 1, 0
					).getDate();
				}
			}
			
			function hideCalender() {
			
				if(shown) {
					if(datePickerEl) {
						datePickerEl.style.display = "none";
					//	datePickerEl.innerHTML = "";
						if(daysOfMonth) {
							daysOfMonth.innerHTML = "";
							shown = false;
						}
					}
				}
			}
			
			function showCalender(value) {
				console.log("sho");
				
				var possibleDate,
					parsed = Date.parse(value);
				if(!isNaN(parsed)) {
					possibleDate = new Date(parsed);
				} else {
					possibleDate = new Date();
				}
				date = possibleDate;
				originalDate = copyDate(date);
			
				
				if(!shown) {
					daysOfMonth = iz("months"+myId);
					monthName = id("monthName"+myId);
					yearName = iz("yearName"+myId);
					datePickerEl = iz("data_picker"+myId);
					input = iz("input"+myId);
					dd = iz("dateDisplay"+myId);
					if(datePickerEl) {
						datePickerEl.style.display = "";
						
						
						changeMonth(date);
					//	datePickerEl.style.left = (dd.offsetLeft - datePickerEl.offsetWidth) + "px";
					//	datePickerEl.style.top = (dd.offsetTop - datePickerEl.offsetHeight) + "px";
						
					}
					shown = true;
					
				}
			}
			
			function pickDate(datePicked) {
				tt(data.onpick, Function, x => x(datePicked, getDateDifference(datePicked, (new Date()))));
				if(input) {
					var d = {
						month:datePicked.getMonth() + 1,
						year: datePicked.getYear() + 1900,
						day: datePicked.getDate()
					};
					input.value = d.month + "/" + 
								  d.day + "/" + 
								  d.year;
					
					if(dd) {
						dd.innerHTML = input.value;
					}
				}
				hideCalender();
			}
			
			function getDateDifference(later, earlier) {
				return Math.ceil(
					(
						later.getTime() - earlier.getTime()
					) / (1000 * 60 * 60 * 24)
				);
			}
			
			function changeMonth(myDate) {
				var month = myDate.getMonth(),
					year = myDate.getYear() + 1900,
					currentMonth = new Date(year, month),
					currentDayOfMonth = myDate.getDate(),
					numberOfDays = totalDays(myDate);
				if(!monthListHolder) monthListHolder = iz("monthListHolder" + myId);
				if(monthListHolder) {
				
					monthListHolder.innerHTML = "";
					monthListHolder.appendChild(
						(new COBY.element(monthListEl({
							startAt: data.limit == "future" ?
								today.getMonth() <= month && 
								today.getYear() + 1900 >= year ?
									today.getMonth()
								:
									0
							:
								0
						}))).el
					);
					monthName = id("monthName"+myId);
				}
				currentYear = year;
				currentMonthName = month;
				
				var cobEl = self.tafkids["table"]({
					rows:7,
					columns:7,
					column: (r,c) => {
						var resultEl = {};
						if(r > 0) {
							var startDay = currentMonth.getDay(),
								index = (r - 1) * 7 + c,
								day = index - startDay + 1,
								selectedMonth,
								lastMonth = new Date(copyDate(myDate).setMonth(myDate.getMonth() - 1)),
								nextMonth = new Date(copyDate(myDate).setMonth(myDate.getMonth() + 1));
								
							
							var lastMonthMaxDay = totalDays(lastMonth);
							if(day < 1) {
								day = lastMonthMaxDay + day;
								selectedMonth = lastMonth.getMonth();
							} else if(day > numberOfDays) {
								
								day = index - numberOfDays - startDay + 1;
								selectedMonth = nextMonth.getMonth();
								
							} else {
								selectedMonth = month;
							}
							
							var officialDate = new Date(year, selectedMonth, day),
								selected =  originalDate.getDate() == day && 
											originalDate.getMonth() == month && 
											originalDate.getYear() + 1900 == year,
								isToday =	today.getDate() == day && 
											today.getMonth() == month && 
											today.getYear() + 1900 == year,
								isAfterToday = getDateDifference(officialDate, today) > 0;
							console.log(getDateDifference(officialDate, today), officialDate, today);
							resultEl = {
								className:"cob_cal_internal cob_cal_" + (
									isAfterToday ? 
										selectedMonth == month ? 
											selected ? 
													"current"
												:
													isToday ?
														"today"
													:
														"select" 
											: 
												"passive"
									:
										"inactive"
								),
								innerHTML:day/* + (isToday ? `<div class="dateTxt">Today<div>` : "")*/,
								onclick(e) {
									isAfterToday && pickDate(officialDate);
								}
							};
						} else {
							resultEl = {
								className: "cob_cal_internal cob_cal_days",
								innerHTML: days.split(" ")[c]
							};
						}
						return resultEl;
					}
				});
				var htmlTest = "<br>"+self.htmlify(cobEl);
				var actEl = new self.element(cobEl);
			//	console.log("YAAAA",cobEl, actEl);
				daysOfMonth.innerHTML = "";
				actEl.appendTo(daysOfMonth);
			//	daysOfMonth.innerHTML = htmlTest;
		//		monthName.innerHTML = myDate.toLocaleString("default", {month:"long"}) + ": " + year;
				if(monthName) monthName.value = myDate.getMonth().toString();
				if(yearName) yearName.value = myDate.getYear() + 1900;
			}
			
			
			
			return result;
		}
	};
 })();
 
 

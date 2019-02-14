var COBY = new (function() {
	
	var self = this;
    
	
	
	this.cobysSocket = null;
	this.onsocketmessage = (m) => {};
	this.onsocketerror = (er) => {};
	this.onsocketclose = (er) => {};
	this.socketURL = null;
	this.socketFunctionsToDo = null;
    this.scriptsToLoad = [];
    this.elements = [];
    this.events = {};
    
    var keyCodes = [];
    var moving = false;
	this.start = (callback) => {
        makeElements();
        
		this.loadScripts(this.scriptsToLoad, () => {
			this.startWebsocket(() => {
				if(callback) {
					callback();
				}
			});
		});
	};
    
    this.getKey = (index) => {
        return keyCodes[index];
    };
    
    this.loadScripts = (list, callback) => {
		//console.log("did it");
		if(list.length > 0) {
			var callback2 = (lastIndex) => {
				console.log("yay?");
				if(list.length > lastIndex + 1) {
					console.log("still got more");
					this.loadScript(list[lastIndex + 1], () => {
						callback2(lastIndex + 1);
					});
				}  else {
					callback();
					console.log("oy");
				}
			}
			
			this.loadScript(list[0],  () => {
				callback2(0);
			});
		} else {
			callback();
		}
	}
	
	this.loadScript = (url, callback) => {
		if(!callback) {
			callback = () => {
				console.log("hi");
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
			console.log("there was some error or something", e);
			outerCallback();
		};
		head.appendChild(temp);
	}
	
	this.loadFile = (url, callback) => {
		if(!callback) {
			callback = () => {
				console.log("hi");
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
			console.log("there was some error or something", e);
			outerCallback();
		};
		head.appendChild(temp);
	}
    
	this.startWebsocket = (callback) => {
		if(this.socketURL != null) {
            
            
			this.cobysSocket = new WebSocket(this.socketURL);
			this.cobysSocket.onopen = function(msg) {
				
				if(callback) {
					callback(msg);
				}
			};
			
            this.cobysSocket.onerror = (err) => {
                switch(err.code) {
                    case "ECONNREFUSED":
                        socketReconnect();
                        break;
                    default:
                        this.onsocketerror(err);
                        break;
                }
            };
            
			this.cobysSocket.onmessage = (msg) => {
                if(this.socketFunctionsToDo) {
                    customSocketFunctions(msg);
                    
                }
                this.onsocketmessage(msg);
            };
            
            this.cobysSocket.onclose = (maybe) => {
                switch(maybe.code) {
                    case 1000:
                        break;
                    default:
                        this.onsocketclose(maybe);
                        socketReconnect();
                        break;
                } 
            };
			
		} else {
			if(callback) callback("No socket URL specified, so not making a socket.");
		}
	}
    
    
    
    this.alert = (cb, data) => {
        
        var div = document.createElement("div");
   
        if(!data) {
            data = {};
        }
        var elsData = data["elements"] || [];
        var els = [];
        var sub = null;
        for(var i = 0; i < elsData.length; i++) {
            var elData = {
                elParent:div,
                attributes:{},
                newlineAfter:true
            };
            var d = {};
            var c = elsData[i];
            if(c["label"]) {
                elData.tag = "span";
                elData.innerHTML = c["label"];
                elData.attributes["class"] = "alertInput";
            } else if(c["input"]) {
                elData.tag = "input";
                elData.attributes["class"] = "alertInput";
            } else if(c["submit"]) {
                
                elData.innerHTML = c["submit"]
                elData.tag = "button";
                elData.attributes["class"] = "alertBtn";
            }
            
            var myEl = new self.element(elData);
            myEl.el.className = "test";
            els.push({data: elsData[i],el:myEl});
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
            if(cb) {
                cb({
                    username:userVal,
                    password:passVal
                });
            }
            div.parentNode.removeChild(div);
        }
        els.forEach(x => {
           if(x["data"]["submit"]) {
            //   x["el"].addEvent = "asodk";
               console.log(x);
                sub = x["el"];
           }               
        });
        if(sub) {
            sub.innerHTML = "asdfg";
            sub["el"].onclick = () => {
                console.log("click");
                var values = [];
                for(var i = 0; i < els.length; i++) {
                    var c = els[i];
                    if(c["data"]["input"]) {
                        values.push({input:c["data"]["input"], value:c["el"]["el"].value});
                    }
                }
                if(cb) {
                    cb(values);
                }

            };
            
        
        }
        
        div.className = data["custom class"] || "alerter";
        document.body.appendChild(div);
        
    }
	
	this.socketSend = (msg) => {
		if(this.cobysSocket) {
         
            
            var s = tryToStringify(msg);
           
			this.cobysSocket.send(s);
		}
	};
	
    
    
    this.element = function(data){
        this.el = document.createElement(data["tag"] || "div");
        var x = data;
        var el = this.el;
        if(isIteratable(x["attributes"])) {
           for(att in x["attributes"]) {
                el.setAttribute(att, x["attributes"][att]);
           }
           if(self.events[x["attributes"]["id"]]) {
                for(var k = 0; k < x["eventtypes"].length; k++) {
                    addEvent(el, x["attributes"]["id"], x["eventtypes"][k]);
                }
            } else {
            
            }
        }
        el.innerHTML = x["innerHTML"] || "";
        var appender = null;
        if(x["parent"]) {
            var potentialParent = c$("#" + x["parent"])[0];
            if(potentialParent) {
                appender = potentialParent;
            }
        } else if(x["elParent"]) {
            var px = x["elParent"];
            appender = px;
        } else {
            if(!data["don't add"])
                appender = document.body;
        }
        
        if(appender && appender["appendChild"]) {
            appender.appendChild(this.el);
            if(x["newlineAfter"]) {
                appender.appendChild((document.createElement("br")));
            }
        }
        this.addEventListener = (type, func) => {
            console.log(123);
            this.el.addEventListener(type, func);
        };
       this.data = data;
    };
    
    this.displayJSON = (json, options) => {
        var opts = options || {
           
        };
        var cEl = new this.element({
            "parent":opts["holder"] || null
        });
        var el = cEl["el"];
        if(el) {
            console.log("found element ", el);
            if(isArray(json)) {
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
            "don't add":true
        });
        var nodeSize = objSize(jsonNode);
        console.log("node size:", nodeSize);
        var index = 0;
        for(var k in jsonNode) {
            var fieldName = k;
            var field = jsonNode[k];
            var needsComma = (nodeSize > index + 1);
            console.log("need it? ", needsComma);
            var fieldEl = new this.element({
                parentEl: holder.el,
                tag:"span",
                innerHTML:fieldName + ":"+field + (needsComma ? "," : "")
            });
            index++;
        }
        return holder.el;
    }
    
this.css = (data) => {
    var head = document.head || document.getElementsByTagName("head")[0];
    if(head) {
        if(data && data.constructor == Object) {
            for(var k in data) {
                var selector = k;
                var rules = data[k];
                
                var allSheets = document.styleSheets;
                var cur = null;
                
                var indexOfPossibleRule = null,
                    indexOfSheet = null;
                var selectorToModify = null;
                for(var i = 0; i < allSheets.length; i++) {
                    indexOfPossibleRule = findObjPropInArray("selectorText",selector,allSheets[i].cssRules);
                    if(indexOfPossibleRule != null) {
                        indexOfSheet = i;
                        break;
                    }
                }
                
                var ruleToEdit = null;
                if(indexOfSheet != null) {
               
                    ruleToEdit = allSheets[indexOfSheet].cssRules[indexOfPossibleRule];
                    
                } else {
                    cur = document.createElement("style");
                    cur.type =  "text/css";
                    head.appendChild(cur);
                    cur.sheet.addRule(selector,"");
                    ruleToEdit = cur.sheet.cssRules[0];
                    console.log("NOPE, but here's a new one:", cur);
                }
                applyCustomCSSruleListToExistingCSSruleList(rules, ruleToEdit, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("successfully added ", rules, " to ", ruleToEdit);
                    }
                });
            }
        } else {
            console.log("provide one paramter as an object containing the cssStyles, like: {\"#myID\":{position:\"5px\"}, \".myClass\":{background:\"red\"}}, etc...");
        }
    } else {
        console.log("run this after the page loads");
    }
    
};  
    
    function makeElements() {
        var madeElements = [];
        for(var i = 0; i < self.elements.length; i++) {
            var x = new self.element(self.elements[i]);
            
            madeElements.push({"data":x["data"],"element":x["el"]});
        }
        console.log(madeElements);
        madeElements.forEach((x, i) => {
            var parentEl = document.body;
            var p = x["data"]["parent"];
            if(p) {
                var temp = madeElements.find(z => {
                    
                    if(z["data"]["attributes"]) return z["data"]["attributes"]["id"] == p;
                    else return null;
                });
               
                if(temp) {
                    parentEl = temp["element"];
                }
            }
            parentEl.appendChild(x["element"]);
        });
    }
    
	function addEvent(el, id, type) {
        el.addEventListener(type, (e) => {
            self.events[id](e);
        });
    }
    
    function customSocketFunctions(msg) {
        if(isParseable(msg["data"])) {
            var json = JSON.parse(msg["data"]);
            for(var k in json) {
                if(self.socketFunctionsToDo && self.socketFunctionsToDo[k]) {
                    self.socketFunctionsToDo[k](json[k]);
                }
            }
        }    
    }
    
    function socketReconnect() {
        if(self.cobysSocket) {
            console.log(self.cobysSocket);
        //    self.cobysSocket.removeAllListeners();
            setTimeout(() => {
                self.startWebsocket();
            }, self.reconnectInterval || 100);
        }
    }
    
    function setupEventListeners() {
        document.body.addEventListener("keydown", (e) => {
           if(!keyCodes[e.keyCode]) {
               keyCodes[e.keyCode] = true;
           }
        });
        document.body.addEventListener("keyup", (e) => {
           keyCodes[e.keyCode] = false;
        });
            
    }
    
    
    //threeJS
	this.world = {};
    
    
	var s,c,r, interval;
    
    
	this.startTHREEjsScene = () => {
        setupEventListeners();
		this.world.scene = new THREE.Scene();
		this.world.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
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
		var cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), new THREE.MeshBasicMaterial({color:"blue"}));
		s.add(cube);
		

		r.gammeOutput = true;
		r.gammaFactor = 2.2;
		
		var light = new THREE.DirectionalLight( 0xffffff, 1);
		s.add(light);
		light.position.x = 4;
		
		var light1 = new THREE.DirectionalLight( 0xffffff, 1);
		s.add(light1);
		
		var light2 = new THREE.DirectionalLight( 0xffffff, 1);
		s.add(light2);
		light2.position.y = -4;
		
		var light3 = new THREE.DirectionalLight( 0xffffff, 1);
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
					
				//	var dt = clock.getDelta();
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
		var controls = new THREE.OrbitControls(c,r.domElement); 
		c.position.z = 5;
		var frameCount = 0;
		var renderLoop = () => {
			requestAnimationFrame(renderLoop);
            
			r.render(s,c);
			
			//	var data = {"frameCount":frameCount,"dataURL":r.domElement.toDataURL()};
            if(keyCodes[39]) {
                cube.position.x += 0.3;
            }
            
            if(keyCodes[38]) {
                cube.position.z += 0.3;
            }
            
            if(keyCodes[37]) {
                cube.position.x -= 0.3;
            }
            
            if(keyCodes[40]) {
                cube.position.z -= 0.3;
            }
            
            if(keyCodes[13]) {
                cube.position.y -= 0.3;
            }
            if(moving) {
                var position = {"x":cube.position.x,"y":cube.position.y,"z":cube.position.z};
            }
			
		}
		renderLoop();
		function findMonkey(inputScene) {
			var result = null;
			inputScene.children.forEach((x) => {
				if(x.name.includes("Armature")) {

					if(x.children.length > 1) {
						result = x.children[1];
					}
				}
			});
			return result;
		}
		
		function automaticallyAddLightsTo(inputScene) {
			inputScene.children.forEach((x) => {
				var light = new THREE.DirectionalLight( 0xffffff, 0),//placeholder
					isActuallyALight = false;
				if(x.name.includes("Sun")) {
					light = new THREE.DirectionalLight( 0xffffff, 1);
					isActuallyALight = true;
				} else if(x.name.includes("Point")) {
					light = new THREE.PointLight( 0xffffff, 1, 100);
					isActuallyALight = true;
				} //etc for other lights
				light.position.copy(x.position);
				light.rotation.copy(x.rotation);
				light.scale.copy(x.scale);
				light.quaternion.copy(x.quaternion);
				if(isActuallyALight)	
					s.add(light);
			});
		}
	};	
})();

//helper functions
function c$(string) {
    return document.querySelectorAll(string);
}

function f$(string) {
    var result = c$(string)[0];
    if(!result) {
        result = document.createElement("div");
        console.log("cloudn't find " + string, " so making new thing");
    }
    return result;
}

function isIteratable(obj) {
    return (obj != null && typeof obj[Symbol.iterator] == "function") || typeof obj == "object";
}

function tryToStringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch(e) {
        throw e;
        return "{\"data\":\"this is empty!!\"}";
    }
}

function strOrObj(str) {
    try {
        return JSON.parse(str);
    } catch(e) {
        return str;
    }
}
 
function stringifyEntireObject(temp) {
    var obj = {};
    for(var k in temp) {
        var value = obj[k];
        if(isStringable(temp[k])) {
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
    } catch(e) {
        return false;
    }
}

function objSize(obj) {
    var s = 0;
    for(var k in obj) {
        s++;
    }
    return s;
}

function isArray(obj) {
    return !!obj && obj.constructor == Array;
}

function findObjPropInArray(objPropKey, objPropValue, arr) {
    var index = null;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][objPropKey] == objPropValue) {
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
    } catch(e) {
        console.log(e);
        return false;
    }
}

function applyCustomCSSruleListToExistingCSSruleList(customRuleList, existingRuleList, cb) {
    var err = null;
    console.log("trying to apply ", customRuleList, " to ", existingRuleList);
    if(customRuleList && customRuleList.constructor == Object && existingRuleList && existingRuleList.constructor == CSSStyleRule) {
        for(var k in customRuleList) {
            existingRuleList["style"][k] = customRuleList[k];
        }
        
    } else {
        err = ("provide first argument as an object containing the selectors for the keys, and the second argument is the CSSRuleList to modify");
    }
    if(cb) {
        cb(err);
    }
}

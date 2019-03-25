
var COBY = new(function () {
    //https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js
    var self = this,
        empty = (() => {}),
        keyCodes = [],
        moving = false, 
        started = false,
        IzList = [],
        startFunctions = [],
        onStartedEvents = () => {
            startFunctions.forEach(x => t(x, Function) && x());
            startFunctions = [];
        };
    this.cobysSocket = null,
    this.onready = empty;
    this.onfullyloaded = empty;
    this.onsocketmessage = empty;
    this.onsocketerror = empty;
    this.onsocketclose = empty;
    this.socketURL = null;
    this.socketFunctionsToDo = null;
    this.scriptsToLoad = [];
    this.elements = [];
    this.events = {};

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

    //custom property definitions
    Object.defineProperty(Array.prototype, 'flatten', {
        value: function(r) {
            for (var a = this, i = 0, r = r || []; i < a.length; ++i)
                if (a[i] != null) a[i] instanceof Array ? a[i].flatten(r) : r.push(a[i]);
            return r
        }
    });

    document.addEventListener("readystatechange", e => {
        if(e.target.readyState === "interactive") {
            self.onready();
            self.start();
            onStartedEvents();
        }
        if(e.target.readyState === "complete") {
            self.onfullyloaded();
        }
    });
    
    this.go = (opts) => {
        !opts && (opts = {});
        var chart = {
            elements: makeElements,
            css: this.css,
            socketFunctionsToDo: (data) => {
                this.socketFunctionsToDo = addToObj(this.socketFunctionsToDo,data)
            },
            events: (data) => {
                (this.events = data);
            }
        }
        Object.keys(opts).forEach(x => {
            var temp = () => t(chart[x], Function) && chart[x](opts[x]);
            started ? temp() : startFunctions.push(temp);
           
        });
    };

    this.getKey = (index) => {
        return keyCodes[index];
    };

    this.loadScripts = (list, callback) => {
        //console.log("did it");
        if (list.length > 0) {
            var callback2 = (lastIndex) => {
                //	console.log("yay?");
                if (list.length > lastIndex + 1) {
                    //		console.log("still got more");
                    this.loadScript(list[lastIndex + 1], () => {
                        callback2(lastIndex + 1);
                    });
                } else {
                    callback();
                    //		console.log("oy");
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
        if (!callback) {
            callback = () => {
                //	console.log("hi");
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
	
    this.get = (url, callback) => {
  		
    };
  	
  	this.CobySocket = function(opts) {
      	if(!opts) opts = {};
      	var url = t(opts, String) ? opts : t(opts, Object) ? opts.url || null;
    	if(url) {
        	this.ws = new WebSocket(opts.url);
          	this.ws.onmessage = m => {
            	t(opts.onmessage,Function) && opts.onmessage(m);
            };
          
          	this.ws.onerror = (err) => {
                switch (err.code) {
                    case "ECONNREFUSED":
                        mySocketReconnect(this.ws);
                        break;
                    default:
                        this.onsocketerror(err);
                        break;
                }
            };
          
            this.send = msg => {
              this.ws.send(msg);
          	};
        }
    };
  
  	function mySocketReconnect(ws) {
      	if(t(ws, WebSocket)) {
        	var oldURL = ws.url,
                oldOnMsg = ws.onmessage,
                oldOnError = ws.onerror;
                
          	ws.close();
          	ws = new WebSocket(oldURL);
          	ws.onmessage = oldOnMsg;
          	ws.onerror = oldOnError;
        }
    }
  
    this.loadFile = (url, callback) => {
        if (!callback) {
            callback = () => {
                //		console.log("hi");
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
            //	console.log("there was some error or something", e);
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

    this.element = function (x) {
        
        this.el = document.createElement(x["tag"] || "div");
        var identifier = null,
            el = this.el,
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
            exclusions = "parent attributes sheim eventtypes events",
            potentialParent = 
                x["elParent"] || 
                c$("#" + x["parent"])[0] || 
                IzList.find(xx => 
                    t(xx.data.sheim, String) && 
                    xx.data.sheim == x["parent"]
                ) || 
                document.body,
            appender = 
                t(potentialParent,self.element) && potentialParent.el ? 
                    potentialParent.el
                :
                    potentialParent

        

        Object.keys(x).forEach(v => {
            !exclusions.split(" ").includes(v) && (() => {
              	if(t(x[v], Object)) {
                  	this.el[v] = {};
                	Object.keys(x[v]).forEach(k => {
                    	this.el[v][k] = x[v][k];
                    });
                } else {
                	this.el[v] = x[v];
                }
            	
            })();
        });

        Object.keys(events).forEach(e => {
            t(events[e], Function) && 
            t(e, String) && 
            this.el.addEventListener(e, events[e]);
        });

        for (att in attributes) {
            this.el.setAttribute(att, attributes[att]);
        }

        identifier = attributes["id"] || x["sheim"];
        identifier ? eventtypes.forEach(k => addEvent(this.el, identifier, k)) : 0;

        appender.appendChild(this.el);
        t(x.elements,Array) && 
        x.elements.forEach(o => {
            t(o,Object) && (new self.element(addToObj(o, {
                    elParent:this.el
                })
            ));
        });
            
        
        x["newlineAfter"] && appender.appendChild((document.createElement("br")));

        this.data = x;
        IzList.push(this);
    };

    this.getIzs = () => {
        return IzList;
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

    this.css = (data) => {
        (!t(data, Object)) && (data = {});

        var head = document.head || document.getElementsByTagName("head")[0],
            onError = t(data.onError, Function) ? data["onError"] : empty,
            onSuccess = t(data.onSuccess, Function) ? data["onSuccess"] : empty,
            allSheets = [].slice.call(document.styleSheets),
            sheetsToWorkWith = 
                (
                    allSheets.length > 0 ?
                        allSheets
                    :
                        [(() => {
                            var style = head.appendChild(document.createElement("style"));
                            style.type = "text/css";
                            return style.sheet;
                        })()]
                ),
            existingRulesToWorkWith = 
                sheetsToWorkWith
                    .filter(x => x && x.cssRules)
                    .map(x=>x.cssRules)
                    .map(x=>[].slice.call(x))
                    .flatten()
        head ? 
            (() => {
                
                

                Object.keys(data).forEach(x => {
                    !(existingRulesToWorkWith.map(x => x.selectorText).includes(x)) && (() => {
                        var sheet = (existingRulesToWorkWith.pop() || {}).parentStyleSheet || sheetsToWorkWith[0];
                        sheet && (() => {
                            sheet["addRule"] && sheet.addRule(x, "");
                            sheet["insertRule"] && sheet.insertRule(x + "{}");
                        })();

                    })();
                    
                })

                sheetsToWorkWith.map(x => 
                        [].slice.apply(x.cssRules)
                    )
                    .flatten()
                    .filter(x => 
                        Object.keys(data).includes(x.selectorText)
                    ).forEach(x => {
                        var currentProperty = data[x.selectorText];
                        t(currentProperty, Object) ? 
                            Object.keys(currentProperty).forEach(y => {
                                x.style[y] = currentProperty[y];
                            })
                        :
                            0
                        
                    });
                console.log(sheetsToWorkWith);
                

                /*
                
                

                sheetsToWorkWith = [].slice.call(allSheets)
                .filter(x => 
                    x.cssRules && [].slice.call(x.cssRules).filter(y => 
                        Object.keys(data).includes(y.selectorText)
                    ).length > 0
                )
            
                
                /*var sheetToWorkWith = allSheets.length > 0 ?
                        allSheets
                        .map(x => 
                            [].slice.call(x.cssRules)
                        )
                        .filter(x =>
                            Object.keys(data).includes(x.selectorText)
                        )[0]
                    :
                        (() => {
                            var rulesList;

                            return rulesList;
                        })()
                var rulesToWorkWith = allSheets.length > 0 ? 
                        allSheets
                        .map(x => //cssRules
                            [].slice.call(x.cssRules)
                        )
                        .filter(x =>
                            Object.keys(data).includes(x.selectorText)
                        )
                    :
                        (() => {
                            var rulesList;

                            return rulesList;
                        })()

                Object.keys(data).forEach(selector => {
                    var rulesToMake = data[selector];
                //    var 
                });
                */
            })():0
            
            /*Object.keys(data).forEach(selector => {
                var rules = data[selector],
                    
                    currentSheet = 
                        allSheets.length > 0 ? 
                            [].slice.call(allSheets).
                        :
                            3

            })
        :
            onError({
                type:"headError"
            });/*
        var tmp = (() => {
            var head = document.head || document.getElementsByTagName("head")[0],
                onError = t(data.onError, Function) ? data["onError"] : empty,
                onSuccess = t(data.onSuccess, Function) ? data["onSuccess"] : empty;
            if (head) {
                if (t(data,Object)) {
                    for (selector in data) {
                            rules = data[selector],

                            allSheets = document.styleSheets,
                            cur = null,
                            selectorToModify = null,
                            ruleToEdit = null;
                        
                        console.log(Array.prototype.filter.call(
                            allSheets,
                            x=>Array.prototype.find.call(x.cssRules, y => y.selectorText == "button")
                        ));

                        for (var i = 0; i < allSheets.length; i++) {
                            selectorToModify = (Array.prototype.find.call(allSheets[i].cssRules, x=>x.selectorText == selector));
                            if(selectorToModify) break;
                        }
    
                        
                        if (selectorToModify != null) {
                            console.log(selectorToModify)
                            ruleToEdit = selectorToModify;

                        } else {
                            cur = document.createElement("style");
                            cur.type = "text/css";
                            head.appendChild(cur);
                            if (cur.sheet["addRule"])
                                cur.sheet.addRule(selector, "");
                            else if (cur.sheet["insertRule"])
                                cur.sheet.insertRule(selector + "{}");
                            else {
                                onSuccess({
                                    type:"cssRule",
                                    defaultMsg:"added new rule"
                                });
                            }
                            cur.sheet.cssRules.length > 0
                            ruleToEdit = cur.sheet.cssRules[0];
                            onSuccess({
                                type:"newSheet",
                                defaultMsg:"Was there an existing style sheet before? NOPE, but here's a new one!"
                            });
                        }
                        applyCustomCSSruleListToExistingCSSruleList(rules, ruleToEdit, (err) => {
                            if (err) {
                                onError({
                                    type:"cssRuleError",
                                    defualtMsg:err
                                });
                            } else {
                                onSuccess({
                                    type:"completion",
                                    defaultMsg:"successfully added the new style properties to ruleToEdit"
                                })
                                
                            }
                        });
                    }
                } else {
                    onError({
                        type:"wrongArgument",
                        defualtMsg:"provide one paramter as an object containing the cssStyles, like: {\"#myID\":{position:\"5px\"}, \".myClass\":{background:\"red\"}}, etc..."
                    });
                }
            } else {
                onError({
                    type:"preloadError"
                });
            }
        });

        !started ? startEvents.push(tmp) : tmp();*/

    };

   /*this.go = (opts) => {
        var valToFuncDict = {
            events: addNewEvents,
            elements: makeElements
        };
        opts && opts.constructor == Object ? 
            Object.keys(opts).forEach(k => {
                this[k] && this[k].constructor == Function ?
                    this[k](opts[k])
                : 0
            })
        : 0
    };*/

    function makeElements(els) {
        els.forEach(x => new self.element(x));
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
        var controls = new THREE.OrbitControls(c, r.domElement);
        c.position.z = 5;
        var frameCount = 0;
        var renderLoop = () => {
            requestAnimationFrame(renderLoop);

            r.render(s, c);

            //	var data = {"frameCount":frameCount,"dataURL":r.domElement.toDataURL()};
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
})();

//helper functions
function c$(string) {
    return document.querySelectorAll(string);
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
        result = "{\"data\":\"this is empty!!\"}";
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

function t(item, cons) {
    return (item || item == 0 || item == false || item == "") ? 
            (cons && cons.constructor == Function) ? 
                item.constructor == cons
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
                Object.entries(base)
                .concat(
                    Object.entries(
                        addition
                    )
                )
            )
}

/*
 Highcharts Gantt JS v7.2.0 (2019-09-03)

 (c) 2017-2018 Lars Cabrera, Torstein Honsi, Jon Arild Nygard & Oystein Moseng

 License: www.highcharts.com/license
*/
(function (Q, K) {
    "object" === typeof module && module.exports ? (K["default"] = K, module.exports = Q.document ? K(Q) : K) : "function" === typeof define && define.amd ? define("highcharts/highcharts-gantt", function () {
        return K(Q)
    }) : (Q.Highcharts && Q.Highcharts.error(16, !0), Q.Highcharts = K(Q))
})("undefined" !== typeof window ? window : this, function (Q) {
    function K(c, g, y, E) {
        c.hasOwnProperty(g) || (c[g] = E.apply(null, y))
    }
    var B = {};
    K(B, "parts/Globals.js", [], function () {
        var c = "undefined" !== typeof Q ? Q : "undefined" !== typeof window ? window : {}, g =
                c.document, y = c.navigator && c.navigator.userAgent || "",
            E = g && g.createElementNS && !!g.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            F = /(edge|msie|trident)/i.test(y) && !c.opera, I = -1 !== y.indexOf("Firefox"),
            C = -1 !== y.indexOf("Chrome"), A = I && 4 > parseInt(y.split("Firefox/")[1], 10);
        return {
            product: "Highcharts",
            version: "7.2.0",
            deg2rad: 2 * Math.PI / 360,
            doc: g,
            hasBidiBug: A,
            hasTouch: !!c.TouchEvent,
            isMS: F,
            isWebKit: -1 !== y.indexOf("AppleWebKit"),
            isFirefox: I,
            isChrome: C,
            isSafari: !C && -1 !== y.indexOf("Safari"),
            isTouchDevice: /(Mobile|Android|Windows Phone)/.test(y),
            SVG_NS: "http://www.w3.org/2000/svg",
            chartCount: 0,
            seriesTypes: {},
            symbolSizes: {},
            svg: E,
            win: c,
            marginNames: ["plotTop", "marginRight", "marginBottom", "plotLeft"],
            noop: function () {
            },
            charts: [],
            dateFormats: {}
        }
    });
    K(B, "parts/Utilities.js", [B["parts/Globals.js"]], function (c) {
        function g(b, a) {
            return parseInt(b, a || 10)
        }

        function y(b) {
            return "string" === typeof b
        }

        function E(b) {
            b = Object.prototype.toString.call(b);
            return "[object Array]" === b || "[object Array Iterator]" ===
                b
        }

        function F(b, a) {
            return !!b && "object" === typeof b && (!a || !E(b))
        }

        function I(b) {
            return F(b) && "number" === typeof b.nodeType
        }

        function C(b) {
            var a = b && b.constructor;
            return !(!F(b, !0) || I(b) || !a || !a.name || "Object" === a.name)
        }

        function A(b) {
            return "number" === typeof b && !isNaN(b) && Infinity > b && -Infinity < b
        }

        function u(b) {
            return "undefined" !== typeof b && null !== b
        }

        function z(b, a, e) {
            var h;
            y(a) ? u(e) ? b.setAttribute(a, e) : b && b.getAttribute && ((h = b.getAttribute(a)) || "class" !== a || (h = b.getAttribute(a + "Name"))) : r(a, function (a, f) {
                b.setAttribute(f,
                    a)
            });
            return h
        }

        function r(b, a, e) {
            for (var h in b) Object.hasOwnProperty.call(b, h) && a.call(e || b[h], b[h], h, b)
        }

        c.timers = [];
        var k = c.charts, q = c.doc, w = c.win;
        c.error = function (b, a, e) {
            var h = A(b) ? "Highcharts error #" + b + ": www.highcharts.com/errors/" + b : b, d = function () {
                if (a) throw Error(h);
                w.console && console.log(h)
            };
            e ? c.fireEvent(e, "displayError", {code: b, message: h}, d) : d()
        };
        c.Fx = function (b, a, e) {
            this.options = a;
            this.elem = b;
            this.prop = e
        };
        c.Fx.prototype = {
            dSetter: function () {
                var b = this.paths[0], a = this.paths[1], e = [], h = this.now,
                    d = b.length;
                if (1 === h) e = this.toD; else if (d === a.length && 1 > h) for (; d--;) {
                    var f = parseFloat(b[d]);
                    e[d] = isNaN(f) ? a[d] : h * parseFloat("" + (a[d] - f)) + f
                } else e = a;
                this.elem.attr("d", e, null, !0)
            }, update: function () {
                var b = this.elem, a = this.prop, e = this.now, h = this.options.step;
                if (this[a + "Setter"]) this[a + "Setter"](); else b.attr ? b.element && b.attr(a, e, null, !0) : b.style[a] = e + this.unit;
                h && h.call(b, e, this)
            }, run: function (b, a, e) {
                var h = this, d = h.options, f = function (a) {
                    return f.stopped ? !1 : h.step(a)
                }, n = w.requestAnimationFrame || function (a) {
                    setTimeout(a,
                        13)
                }, x = function () {
                    for (var a = 0; a < c.timers.length; a++) c.timers[a]() || c.timers.splice(a--, 1);
                    c.timers.length && n(x)
                };
                b !== a || this.elem["forceAnimate:" + this.prop] ? (this.startTime = +new Date, this.start = b, this.end = a, this.unit = e, this.now = this.start, this.pos = 0, f.elem = this.elem, f.prop = this.prop, f() && 1 === c.timers.push(f) && n(x)) : (delete d.curAnim[this.prop], d.complete && 0 === Object.keys(d.curAnim).length && d.complete.call(this.elem))
            }, step: function (b) {
                var a = +new Date, e = this.options, h = this.elem, d = e.complete, f = e.duration,
                    n = e.curAnim;
                if (h.attr && !h.element) b = !1; else if (b || a >= f + this.startTime) {
                    this.now = this.end;
                    this.pos = 1;
                    this.update();
                    var c = n[this.prop] = !0;
                    r(n, function (a) {
                        !0 !== a && (c = !1)
                    });
                    c && d && d.call(h);
                    b = !1
                } else this.pos = e.easing((a - this.startTime) / f), this.now = this.start + (this.end - this.start) * this.pos, this.update(), b = !0;
                return b
            }, initPath: function (b, a, e) {
                function h(a) {
                    for (t = a.length; t--;) {
                        var d = "M" === a[t] || "L" === a[t];
                        var p = /[a-zA-Z]/.test(a[t + 3]);
                        d && p && a.splice(t + 1, 0, a[t + 1], a[t + 2], a[t + 1], a[t + 2])
                    }
                }

                function d(a, d) {
                    for (; a.length <
                           J;) {
                        a[0] = d[J - a.length];
                        var p = a.slice(0, m);
                        [].splice.apply(a, [0, 0].concat(p));
                        G && (p = a.slice(a.length - m), [].splice.apply(a, [a.length, 0].concat(p)), t--)
                    }
                    a[0] = "M"
                }

                function f(a, d) {
                    for (var p = (J - a.length) / m; 0 < p && p--;) l = a.slice().splice(a.length / D - m, m * D), l[0] = d[J - m - p * m], v && (l[m - 6] = l[m - 2], l[m - 5] = l[m - 1]), [].splice.apply(a, [a.length / D, 0].concat(l)), G && p--
                }

                a = a || "";
                var n = b.startX, c = b.endX, v = -1 < a.indexOf("C"), m = v ? 7 : 3, l, t;
                a = a.split(" ");
                e = e.slice();
                var G = b.isArea, D = G ? 2 : 1;
                v && (h(a), h(e));
                if (n && c) {
                    for (t = 0; t < n.length; t++) if (n[t] ===
                        c[0]) {
                        var p = t;
                        break
                    } else if (n[0] === c[c.length - n.length + t]) {
                        p = t;
                        var H = !0;
                        break
                    } else if (n[n.length - 1] === c[c.length - n.length + t]) {
                        p = n.length - t;
                        break
                    }
                    "undefined" === typeof p && (a = [])
                }
                if (a.length && A(p)) {
                    var J = e.length + p * D * m;
                    H ? (d(a, e), f(e, a)) : (d(e, a), f(a, e))
                }
                return [a, e]
            }, fillSetter: function () {
                c.Fx.prototype.strokeSetter.apply(this, arguments)
            }, strokeSetter: function () {
                this.elem.attr(this.prop, c.color(this.start).tweenTo(c.color(this.end), this.pos), null, !0)
            }
        };
        c.merge = function () {
            var b, a = arguments, e = {}, h = function (a,
                                                        d) {
                "object" !== typeof a && (a = {});
                r(d, function (b, f) {
                    !F(b, !0) || C(b) || I(b) ? a[f] = d[f] : a[f] = h(a[f] || {}, b)
                });
                return a
            };
            !0 === a[0] && (e = a[1], a = Array.prototype.slice.call(a, 2));
            var d = a.length;
            for (b = 0; b < d; b++) e = h(e, a[b]);
            return e
        };
        c.syncTimeout = function (b, a, e) {
            if (a) return setTimeout(b, a, e);
            b.call(0, e)
        };
        c.clearTimeout = function (b) {
            u(b) && clearTimeout(b)
        };
        c.extend = function (b, a) {
            var e;
            b || (b = {});
            for (e in a) b[e] = a[e];
            return b
        };
        c.pick = function () {
            var b = arguments, a, e = b.length;
            for (a = 0; a < e; a++) {
                var h = b[a];
                if ("undefined" !==
                    typeof h && null !== h) return h
            }
        };
        c.css = function (b, a) {
            c.isMS && !c.svg && a && "undefined" !== typeof a.opacity && (a.filter = "alpha(opacity=" + 100 * a.opacity + ")");
            c.extend(b.style, a)
        };
        c.createElement = function (b, a, e, h, d) {
            b = q.createElement(b);
            var f = c.css;
            a && c.extend(b, a);
            d && f(b, {padding: "0", border: "none", margin: "0"});
            e && f(b, e);
            h && h.appendChild(b);
            return b
        };
        c.extendClass = function (b, a) {
            var e = function () {
            };
            e.prototype = new b;
            c.extend(e.prototype, a);
            return e
        };
        c.pad = function (b, a, e) {
            return Array((a || 2) + 1 - String(b).replace("-",
                "").length).join(e || "0") + b
        };
        c.relativeLength = function (b, a, e) {
            return /%$/.test(b) ? a * parseFloat(b) / 100 + (e || 0) : parseFloat(b)
        };
        c.wrap = function (b, a, e) {
            var h = b[a];
            b[a] = function () {
                var a = Array.prototype.slice.call(arguments), b = arguments, n = this;
                n.proceed = function () {
                    h.apply(n, arguments.length ? arguments : b)
                };
                a.unshift(h);
                a = e.apply(this, a);
                n.proceed = null;
                return a
            }
        };
        c.datePropsToTimestamps = function (b) {
            r(b, function (a, e) {
                F(a) && "function" === typeof a.getTime ? b[e] = a.getTime() : (F(a) || E(a)) && c.datePropsToTimestamps(a)
            })
        };
        c.formatSingle = function (b, a, e) {
            var h = /\.([0-9])/, d = c.defaultOptions.lang;
            /f$/.test(b) ? (e = (e = b.match(h)) ? e[1] : -1, null !== a && (a = c.numberFormat(a, e, d.decimalPoint, -1 < b.indexOf(",") ? d.thousandsSep : ""))) : a = (e || c.time).dateFormat(b, a);
            return a
        };
        c.format = function (b, a, e) {
            for (var h = "{", d = !1, f, n, x, v, m = [], l; b;) {
                h = b.indexOf(h);
                if (-1 === h) break;
                f = b.slice(0, h);
                if (d) {
                    f = f.split(":");
                    n = f.shift().split(".");
                    v = n.length;
                    l = a;
                    for (x = 0; x < v; x++) l && (l = l[n[x]]);
                    f.length && (l = c.formatSingle(f.join(":"), l, e));
                    m.push(l)
                } else m.push(f);
                b = b.slice(h + 1);
                h = (d = !d) ? "}" : "{"
            }
            m.push(b);
            return m.join("")
        };
        c.getMagnitude = function (b) {
            return Math.pow(10, Math.floor(Math.log(b) / Math.LN10))
        };
        c.normalizeTickInterval = function (b, a, e, h, d) {
            var f = b;
            e = c.pick(e, 1);
            var n = b / e;
            a || (a = d ? [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10] : [1, 2, 2.5, 5, 10], !1 === h && (1 === e ? a = a.filter(function (a) {
                return 0 === a % 1
            }) : .1 >= e && (a = [1 / e])));
            for (h = 0; h < a.length && !(f = a[h], d && f * e >= b || !d && n <= (a[h] + (a[h + 1] || a[h])) / 2); h++) ;
            return f = c.correctFloat(f * e, -Math.round(Math.log(.001) / Math.LN10))
        };
        c.stableSort =
            function (b, a) {
                var e = b.length, h, d;
                for (d = 0; d < e; d++) b[d].safeI = d;
                b.sort(function (d, b) {
                    h = a(d, b);
                    return 0 === h ? d.safeI - b.safeI : h
                });
                for (d = 0; d < e; d++) delete b[d].safeI
            };
        c.arrayMin = function (b) {
            for (var a = b.length, e = b[0]; a--;) b[a] < e && (e = b[a]);
            return e
        };
        c.arrayMax = function (b) {
            for (var a = b.length, e = b[0]; a--;) b[a] > e && (e = b[a]);
            return e
        };
        c.destroyObjectProperties = function (b, a) {
            r(b, function (e, h) {
                e && e !== a && e.destroy && e.destroy();
                delete b[h]
            })
        };
        c.discardElement = function (b) {
            var a = c.garbageBin;
            a || (a = c.createElement("div"));
            b && a.appendChild(b);
            a.innerHTML = ""
        };
        c.correctFloat = function (b, a) {
            return parseFloat(b.toPrecision(a || 14))
        };
        c.setAnimation = function (b, a) {
            a.renderer.globalAnimation = c.pick(b, a.options.chart.animation, !0)
        };
        c.animObject = function (b) {
            return F(b) ? c.merge(b) : {duration: b ? 500 : 0}
        };
        c.timeUnits = {
            millisecond: 1,
            second: 1E3,
            minute: 6E4,
            hour: 36E5,
            day: 864E5,
            week: 6048E5,
            month: 24192E5,
            year: 314496E5
        };
        c.numberFormat = function (b, a, e, h) {
            b = +b || 0;
            a = +a;
            var d = c.defaultOptions.lang, f = (b.toString().split(".")[1] || "").split("e")[0].length,
                n = b.toString().split("e");
            if (-1 === a) a = Math.min(f, 20); else if (!A(a)) a = 2; else if (a && n[1] && 0 > n[1]) {
                var x = a + +n[1];
                0 <= x ? (n[0] = (+n[0]).toExponential(x).split("e")[0], a = x) : (n[0] = n[0].split(".")[0] || 0, b = 20 > a ? (n[0] * Math.pow(10, n[1])).toFixed(a) : 0, n[1] = 0)
            }
            var v = (Math.abs(n[1] ? n[0] : b) + Math.pow(10, -Math.max(a, f) - 1)).toFixed(a);
            f = String(g(v));
            x = 3 < f.length ? f.length % 3 : 0;
            e = c.pick(e, d.decimalPoint);
            h = c.pick(h, d.thousandsSep);
            b = (0 > b ? "-" : "") + (x ? f.substr(0, x) + h : "");
            b += f.substr(x).replace(/(\d{3})(?=\d)/g, "$1" + h);
            a &&
            (b += e + v.slice(-a));
            n[1] && 0 !== +b && (b += "e" + n[1]);
            return b
        };
        Math.easeInOutSine = function (b) {
            return -.5 * (Math.cos(Math.PI * b) - 1)
        };
        c.getStyle = function (b, a, e) {
            if ("width" === a) return a = Math.min(b.offsetWidth, b.scrollWidth), e = b.getBoundingClientRect && b.getBoundingClientRect().width, e < a && e >= a - 1 && (a = Math.floor(e)), Math.max(0, a - c.getStyle(b, "padding-left") - c.getStyle(b, "padding-right"));
            if ("height" === a) return Math.max(0, Math.min(b.offsetHeight, b.scrollHeight) - c.getStyle(b, "padding-top") - c.getStyle(b, "padding-bottom"));
            w.getComputedStyle || c.error(27, !0);
            if (b = w.getComputedStyle(b, void 0)) b = b.getPropertyValue(a), c.pick(e, "opacity" !== a) && (b = g(b));
            return b
        };
        c.inArray = function (b, a, e) {
            return a.indexOf(b, e)
        };
        c.find = Array.prototype.find ? function (b, a) {
            return b.find(a)
        } : function (b, a) {
            var e, h = b.length;
            for (e = 0; e < h; e++) if (a(b[e], e)) return b[e]
        };
        c.keys = Object.keys;
        c.offset = function (b) {
            var a = q.documentElement;
            b = b.parentElement || b.parentNode ? b.getBoundingClientRect() : {top: 0, left: 0};
            return {
                top: b.top + (w.pageYOffset || a.scrollTop) -
                (a.clientTop || 0), left: b.left + (w.pageXOffset || a.scrollLeft) - (a.clientLeft || 0)
            }
        };
        c.stop = function (b, a) {
            for (var e = c.timers.length; e--;) c.timers[e].elem !== b || a && a !== c.timers[e].prop || (c.timers[e].stopped = !0)
        };
        r({map: "map", each: "forEach", grep: "filter", reduce: "reduce", some: "some"}, function (b, a) {
            c[a] = function (a) {
                return Array.prototype[b].apply(a, [].slice.call(arguments, 1))
            }
        });
        c.addEvent = function (b, a, e, h) {
            void 0 === h && (h = {});
            var d = b.addEventListener || c.addEventListenerPolyfill;
            var f = "function" === typeof b &&
            b.prototype ? b.prototype.protoEvents = b.prototype.protoEvents || {} : b.hcEvents = b.hcEvents || {};
            c.Point && b instanceof c.Point && b.series && b.series.chart && (b.series.chart.runTrackerClick = !0);
            d && d.call(b, a, e, !1);
            f[a] || (f[a] = []);
            f[a].push({fn: e, order: "number" === typeof h.order ? h.order : Infinity});
            f[a].sort(function (a, d) {
                return a.order - d.order
            });
            return function () {
                c.removeEvent(b, a, e)
            }
        };
        c.removeEvent = function (b, a, e) {
            function h(a, d) {
                var f = b.removeEventListener || c.removeEventListenerPolyfill;
                f && f.call(b, a, d, !1)
            }

            function d(d) {
                var f;
                if (b.nodeName) {
                    if (a) {
                        var e = {};
                        e[a] = !0
                    } else e = d;
                    r(e, function (a, b) {
                        if (d[b]) for (f = d[b].length; f--;) h(b, d[b][f].fn)
                    })
                }
            }

            var f;
            ["protoEvents", "hcEvents"].forEach(function (n) {
                var c = b[n];
                c && (a ? (f = c[a] || [], e ? (c[a] = f.filter(function (a) {
                    return e !== a.fn
                }), h(a, e)) : (d(c), c[a] = [])) : (d(c), b[n] = {}))
            })
        };
        c.fireEvent = function (b, a, e, h) {
            var d;
            e = e || {};
            if (q.createEvent && (b.dispatchEvent || b.fireEvent)) {
                var f = q.createEvent("Events");
                f.initEvent(a, !0, !0);
                c.extend(f, e);
                b.dispatchEvent ? b.dispatchEvent(f) :
                    b.fireEvent(a, f)
            } else e.target || c.extend(e, {
                preventDefault: function () {
                    e.defaultPrevented = !0
                }, target: b, type: a
            }), function (a, f) {
                void 0 === a && (a = []);
                void 0 === f && (f = []);
                var h = 0, m = 0, l = a.length + f.length;
                for (d = 0; d < l; d++) !1 === (a[h] ? f[m] ? a[h].order <= f[m].order ? a[h++] : f[m++] : a[h++] : f[m++]).fn.call(b, e) && e.preventDefault()
            }(b.protoEvents && b.protoEvents[a], b.hcEvents && b.hcEvents[a]);
            h && !e.defaultPrevented && h.call(b, e)
        };
        c.animate = function (b, a, e) {
            var h, d = "", f, n;
            if (!F(e)) {
                var x = arguments;
                e = {
                    duration: x[2], easing: x[3],
                    complete: x[4]
                }
            }
            A(e.duration) || (e.duration = 400);
            e.easing = "function" === typeof e.easing ? e.easing : Math[e.easing] || Math.easeInOutSine;
            e.curAnim = c.merge(a);
            r(a, function (v, m) {
                c.stop(b, m);
                n = new c.Fx(b, e, m);
                f = null;
                "d" === m ? (n.paths = n.initPath(b, b.d, a.d), n.toD = a.d, h = 0, f = 1) : b.attr ? h = b.attr(m) : (h = parseFloat(c.getStyle(b, m)) || 0, "opacity" !== m && (d = "px"));
                f || (f = v);
                f && f.match && f.match("px") && (f = f.replace(/px/g, ""));
                n.run(h, f, d)
            })
        };
        c.seriesType = function (b, a, e, h, d) {
            var f = c.getOptions(), n = c.seriesTypes;
            f.plotOptions[b] =
                c.merge(f.plotOptions[a], e);
            n[b] = c.extendClass(n[a] || function () {
            }, h);
            n[b].prototype.type = b;
            d && (n[b].prototype.pointClass = c.extendClass(c.Point, d));
            return n[b]
        };
        c.uniqueKey = function () {
            var b = Math.random().toString(36).substring(2, 9), a = 0;
            return function () {
                return "highcharts-" + b + "-" + a++
            }
        }();
        c.isFunction = function (b) {
            return "function" === typeof b
        };
        w.jQuery && (w.jQuery.fn.highcharts = function () {
            var b = [].slice.call(arguments);
            if (this[0]) return b[0] ? (new (c[y(b[0]) ? b.shift() : "Chart"])(this[0], b[0], b[1]), this) :
                k[z(this[0], "data-highcharts-chart")]
        });
        return {
            attr: z,
            defined: u,
            erase: function (b, a) {
                for (var e = b.length; e--;) if (b[e] === a) {
                    b.splice(e, 1);
                    break
                }
            },
            isArray: E,
            isClass: C,
            isDOMElement: I,
            isNumber: A,
            isObject: F,
            isString: y,
            objectEach: r,
            pInt: g,
            splat: function (b) {
                return E(b) ? b : [b]
            }
        }
    });
    K(B, "parts/Color.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isNumber, E = g.pInt, F = c.merge;
        c.Color = function (g) {
            if (!(this instanceof c.Color)) return new c.Color(g);
            this.init(g)
        };
        c.Color.prototype = {
            parsers: [{
                regex: /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
                parse: function (c) {
                    return [E(c[1]), E(c[2]), E(c[3]), parseFloat(c[4], 10)]
                }
            }, {
                regex: /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/, parse: function (c) {
                    return [E(c[1]), E(c[2]), E(c[3]), 1]
                }
            }], names: {white: "#ffffff", black: "#000000"}, init: function (g) {
                var C, A;
                if ((this.input = g = this.names[g && g.toLowerCase ? g.toLowerCase() : ""] || g) && g.stops) this.stops = g.stops.map(function (r) {
                    return new c.Color(r[1])
                }); else {
                    if (g && g.charAt && "#" === g.charAt()) {
                        var u = g.length;
                        g = parseInt(g.substr(1), 16);
                        7 === u ? C = [(g & 16711680) >>
                        16, (g & 65280) >> 8, g & 255, 1] : 4 === u && (C = [(g & 3840) >> 4 | (g & 3840) >> 8, (g & 240) >> 4 | g & 240, (g & 15) << 4 | g & 15, 1])
                    }
                    if (!C) for (A = this.parsers.length; A-- && !C;) {
                        var z = this.parsers[A];
                        (u = z.regex.exec(g)) && (C = z.parse(u))
                    }
                }
                this.rgba = C || []
            }, get: function (c) {
                var g = this.input, A = this.rgba;
                if (this.stops) {
                    var u = F(g);
                    u.stops = [].concat(u.stops);
                    this.stops.forEach(function (g, r) {
                        u.stops[r] = [u.stops[r][0], g.get(c)]
                    })
                } else u = A && y(A[0]) ? "rgb" === c || !c && 1 === A[3] ? "rgb(" + A[0] + "," + A[1] + "," + A[2] + ")" : "a" === c ? A[3] : "rgba(" + A.join(",") + ")" : g;
                return u
            },
            brighten: function (c) {
                var g, A = this.rgba;
                if (this.stops) this.stops.forEach(function (u) {
                    u.brighten(c)
                }); else if (y(c) && 0 !== c) for (g = 0; 3 > g; g++) A[g] += E(255 * c), 0 > A[g] && (A[g] = 0), 255 < A[g] && (A[g] = 255);
                return this
            }, setOpacity: function (c) {
                this.rgba[3] = c;
                return this
            }, tweenTo: function (c, g) {
                var C = this.rgba, u = c.rgba;
                u.length && C && C.length ? (c = 1 !== u[3] || 1 !== C[3], g = (c ? "rgba(" : "rgb(") + Math.round(u[0] + (C[0] - u[0]) * (1 - g)) + "," + Math.round(u[1] + (C[1] - u[1]) * (1 - g)) + "," + Math.round(u[2] + (C[2] - u[2]) * (1 - g)) + (c ? "," + (u[3] + (C[3] - u[3]) *
                    (1 - g)) : "") + ")") : g = c.input || "none";
                return g
            }
        };
        c.color = function (g) {
            return new c.Color(g)
        }
    });
    K(B, "parts/SvgRenderer.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.attr, E = g.defined, F = g.erase, I = g.isArray, C = g.isNumber, A = g.isObject, u = g.isString,
            z = g.objectEach, r = g.pInt, k = g.splat, q = c.addEvent, w = c.animate, b = c.charts, a = c.color,
            e = c.css, h = c.createElement, d = c.deg2rad, f = c.destroyObjectProperties, n = c.doc, x = c.extend,
            v = c.hasTouch, m = c.isFirefox, l = c.isMS, t = c.isWebKit, G = c.merge, D = c.noop, p = c.pick,
            H = c.removeEvent, J = c.stop, M = c.svg, S = c.SVG_NS, P = c.symbolSizes, R = c.win;
        var L = c.SVGElement = function () {
            return this
        };
        x(L.prototype, {
            opacity: 1,
            SVG_NS: S,
            textProps: "direction fontSize fontWeight fontFamily fontStyle color lineHeight width textAlign textDecoration textOverflow textOutline cursor".split(" "),
            init: function (a, d) {
                this.element = "span" === d ? h(d) : n.createElementNS(this.SVG_NS, d);
                this.renderer = a;
                c.fireEvent(this, "afterInit")
            },
            animate: function (a, d, b) {
                var f = c.animObject(p(d, this.renderer.globalAnimation,
                    !0));
                p(n.hidden, n.msHidden, n.webkitHidden, !1) && (f.duration = 0);
                0 !== f.duration ? (b && (f.complete = b), w(this, a, f)) : (this.attr(a, void 0, b), z(a, function (a, d) {
                    f.step && f.step.call(this, a, {prop: d, pos: 1})
                }, this));
                return this
            },
            complexColor: function (a, d, p) {
                var b = this.renderer, f, l, e, h, H, N, t, m, n, D, J, v = [], O;
                c.fireEvent(this.renderer, "complexColor", {args: arguments}, function () {
                    a.radialGradient ? l = "radialGradient" : a.linearGradient && (l = "linearGradient");
                    l && (e = a[l], H = b.gradients, t = a.stops, D = p.radialReference, I(e) && (a[l] =
                        e = {
                            x1: e[0],
                            y1: e[1],
                            x2: e[2],
                            y2: e[3],
                            gradientUnits: "userSpaceOnUse"
                        }), "radialGradient" === l && D && !E(e.gradientUnits) && (h = e, e = G(e, b.getRadialAttr(D, h), {gradientUnits: "userSpaceOnUse"})), z(e, function (a, d) {
                        "id" !== d && v.push(d, a)
                    }), z(t, function (a) {
                        v.push(a)
                    }), v = v.join(","), H[v] ? J = H[v].attr("id") : (e.id = J = c.uniqueKey(), H[v] = N = b.createElement(l).attr(e).add(b.defs), N.radAttr = h, N.stops = [], t.forEach(function (a) {
                        0 === a[1].indexOf("rgba") ? (f = c.color(a[1]), m = f.get("rgb"), n = f.get("a")) : (m = a[1], n = 1);
                        a = b.createElement("stop").attr({
                            offset: a[0],
                            "stop-color": m, "stop-opacity": n
                        }).add(N);
                        N.stops.push(a)
                    })), O = "url(" + b.url + "#" + J + ")", p.setAttribute(d, O), p.gradient = v, a.toString = function () {
                        return O
                    })
                })
            },
            applyTextOutline: function (a) {
                var d = this.element, p;
                -1 !== a.indexOf("contrast") && (a = a.replace(/contrast/g, this.renderer.getContrast(d.style.fill)));
                a = a.split(" ");
                var b = a[a.length - 1];
                if ((p = a[0]) && "none" !== p && c.svg) {
                    this.fakeTS = !0;
                    a = [].slice.call(d.getElementsByTagName("tspan"));
                    this.ySetter = this.xSetter;
                    p = p.replace(/(^[\d\.]+)(.*?)$/g, function (a, d,
                                                                 p) {
                        return 2 * d + p
                    });
                    this.removeTextOutline(a);
                    var f = d.firstChild;
                    a.forEach(function (a, e) {
                        0 === e && (a.setAttribute("x", d.getAttribute("x")), e = d.getAttribute("y"), a.setAttribute("y", e || 0), null === e && d.setAttribute("y", 0));
                        a = a.cloneNode(1);
                        y(a, {
                            "class": "highcharts-text-outline",
                            fill: b,
                            stroke: b,
                            "stroke-width": p,
                            "stroke-linejoin": "round"
                        });
                        d.insertBefore(a, f)
                    })
                }
            },
            removeTextOutline: function (a) {
                for (var d = a.length, p; d--;) p = a[d], "highcharts-text-outline" === p.getAttribute("class") && F(a, this.element.removeChild(p))
            },
            symbolCustomAttribs: "x y width height r start end innerR anchorX anchorY rounded".split(" "),
            attr: function (a, d, p, b) {
                var f = this.element, e, l = this, h, H, N = this.symbolCustomAttribs;
                if ("string" === typeof a && void 0 !== d) {
                    var t = a;
                    a = {};
                    a[t] = d
                }
                "string" === typeof a ? l = (this[a + "Getter"] || this._defaultGetter).call(this, a, f) : (z(a, function (d, p) {
                    h = !1;
                    b || J(this, p);
                    this.symbolName && -1 !== c.inArray(p, N) && (e || (this.symbolAttr(a), e = !0), h = !0);
                    !this.rotation || "x" !== p && "y" !== p || (this.doTransform = !0);
                    h || (H = this[p + "Setter"] || this._defaultSetter,
                        H.call(this, d, p, f), !this.styledMode && this.shadows && /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(p) && this.updateShadows(p, d, H))
                }, this), this.afterSetters());
                p && p.call(this);
                return l
            },
            afterSetters: function () {
                this.doTransform && (this.updateTransform(), this.doTransform = !1)
            },
            updateShadows: function (a, d, p) {
                for (var b = this.shadows, f = b.length; f--;) p.call(b[f], "height" === a ? Math.max(d - (b[f].cutHeight || 0), 0) : "d" === a ? this.d : d, a, b[f])
            },
            addClass: function (a, d) {
                var p = this.attr("class") || "";
                d || (a = (a || "").split(/ /g).reduce(function (a,
                                                                 d) {
                    -1 === p.indexOf(d) && a.push(d);
                    return a
                }, p ? [p] : []).join(" "));
                a !== p && this.attr("class", a);
                return this
            },
            hasClass: function (a) {
                return -1 !== (this.attr("class") || "").split(" ").indexOf(a)
            },
            removeClass: function (a) {
                return this.attr("class", (this.attr("class") || "").replace(a, ""))
            },
            symbolAttr: function (a) {
                var d = this;
                "x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function (b) {
                    d[b] = p(a[b], d[b])
                });
                d.attr({d: d.renderer.symbols[d.symbolName](d.x, d.y, d.width, d.height, d)})
            },
            clip: function (a) {
                return this.attr("clip-path",
                    a ? "url(" + this.renderer.url + "#" + a.id + ")" : "none")
            },
            crisp: function (a, d) {
                d = d || a.strokeWidth || 0;
                var p = Math.round(d) % 2 / 2;
                a.x = Math.floor(a.x || this.x || 0) + p;
                a.y = Math.floor(a.y || this.y || 0) + p;
                a.width = Math.floor((a.width || this.width || 0) - 2 * p);
                a.height = Math.floor((a.height || this.height || 0) - 2 * p);
                E(a.strokeWidth) && (a.strokeWidth = d);
                return a
            },
            css: function (a) {
                var d = this.styles, p = {}, b = this.element, f = "", l = !d,
                    h = ["textOutline", "textOverflow", "width"];
                a && a.color && (a.fill = a.color);
                d && z(a, function (a, b) {
                    a !== d[b] && (p[b] = a,
                        l = !0)
                });
                if (l) {
                    d && (a = x(d, p));
                    if (a) if (null === a.width || "auto" === a.width) delete this.textWidth; else if ("text" === b.nodeName.toLowerCase() && a.width) var H = this.textWidth = r(a.width);
                    this.styles = a;
                    H && !M && this.renderer.forExport && delete a.width;
                    if (b.namespaceURI === this.SVG_NS) {
                        var t = function (a, d) {
                            return "-" + d.toLowerCase()
                        };
                        z(a, function (a, d) {
                            -1 === h.indexOf(d) && (f += d.replace(/([A-Z])/g, t) + ":" + a + ";")
                        });
                        f && y(b, "style", f)
                    } else e(b, a);
                    this.added && ("text" === this.element.nodeName && this.renderer.buildText(this), a &&
                    a.textOutline && this.applyTextOutline(a.textOutline))
                }
                return this
            },
            getStyle: function (a) {
                return R.getComputedStyle(this.element || this, "").getPropertyValue(a)
            },
            strokeWidth: function () {
                if (!this.renderer.styledMode) return this["stroke-width"] || 0;
                var a = this.getStyle("stroke-width");
                if (a.indexOf("px") === a.length - 2) a = r(a); else {
                    var d = n.createElementNS(S, "rect");
                    y(d, {width: a, "stroke-width": 0});
                    this.element.parentNode.appendChild(d);
                    a = d.getBBox().width;
                    d.parentNode.removeChild(d)
                }
                return a
            },
            on: function (a, d) {
                var p =
                    this, b = p.element;
                v && "click" === a ? (b.ontouchstart = function (a) {
                    p.touchEventFired = Date.now();
                    a.preventDefault();
                    d.call(b, a)
                }, b.onclick = function (a) {
                    (-1 === R.navigator.userAgent.indexOf("Android") || 1100 < Date.now() - (p.touchEventFired || 0)) && d.call(b, a)
                }) : b["on" + a] = d;
                return this
            },
            setRadialReference: function (a) {
                var d = this.renderer.gradients[this.element.gradient];
                this.element.radialReference = a;
                d && d.radAttr && d.animate(this.renderer.getRadialAttr(a, d.radAttr));
                return this
            },
            translate: function (a, d) {
                return this.attr({
                    translateX: a,
                    translateY: d
                })
            },
            invert: function (a) {
                this.inverted = a;
                this.updateTransform();
                return this
            },
            updateTransform: function () {
                var a = this.translateX || 0, d = this.translateY || 0, b = this.scaleX, f = this.scaleY,
                    e = this.inverted, l = this.rotation, h = this.matrix, H = this.element;
                e && (a += this.width, d += this.height);
                a = ["translate(" + a + "," + d + ")"];
                E(h) && a.push("matrix(" + h.join(",") + ")");
                e ? a.push("rotate(90) scale(-1,1)") : l && a.push("rotate(" + l + " " + p(this.rotationOriginX, H.getAttribute("x"), 0) + " " + p(this.rotationOriginY, H.getAttribute("y") ||
                    0) + ")");
                (E(b) || E(f)) && a.push("scale(" + p(b, 1) + " " + p(f, 1) + ")");
                a.length && H.setAttribute("transform", a.join(" "))
            },
            toFront: function () {
                var a = this.element;
                a.parentNode.appendChild(a);
                return this
            },
            align: function (a, d, b) {
                var f, e = {};
                var l = this.renderer;
                var h = l.alignedObjects;
                var H, t;
                if (a) {
                    if (this.alignOptions = a, this.alignByTranslate = d, !b || u(b)) this.alignTo = f = b || "renderer", F(h, this), h.push(this), b = null
                } else a = this.alignOptions, d = this.alignByTranslate, f = this.alignTo;
                b = p(b, l[f], l);
                f = a.align;
                l = a.verticalAlign;
                h = (b.x || 0) + (a.x || 0);
                var m = (b.y || 0) + (a.y || 0);
                "right" === f ? H = 1 : "center" === f && (H = 2);
                H && (h += (b.width - (a.width || 0)) / H);
                e[d ? "translateX" : "x"] = Math.round(h);
                "bottom" === l ? t = 1 : "middle" === l && (t = 2);
                t && (m += (b.height - (a.height || 0)) / t);
                e[d ? "translateY" : "y"] = Math.round(m);
                this[this.placed ? "animate" : "attr"](e);
                this.placed = !0;
                this.alignAttr = e;
                return this
            },
            getBBox: function (a, b) {
                var f, e = this.renderer, l = this.element, h = this.styles, H = this.textStr, t, m = e.cache,
                    c = e.cacheKeys, n = l.namespaceURI === this.SVG_NS;
                b = p(b, this.rotation);
                var N = b * d;
                var G = e.styledMode ? l && L.prototype.getStyle.call(l, "font-size") : h && h.fontSize;
                if (E(H)) {
                    var D = H.toString();
                    -1 === D.indexOf("<") && (D = D.replace(/[0-9]/g, "0"));
                    D += ["", b || 0, G, this.textWidth, h && h.textOverflow].join()
                }
                D && !a && (f = m[D]);
                if (!f) {
                    if (n || e.forExport) {
                        try {
                            (t = this.fakeTS && function (a) {
                                [].forEach.call(l.querySelectorAll(".highcharts-text-outline"), function (d) {
                                    d.style.display = a
                                })
                            }) && t("none"), f = l.getBBox ? x({}, l.getBBox()) : {
                                width: l.offsetWidth,
                                height: l.offsetHeight
                            }, t && t("")
                        } catch (ea) {
                            ""
                        }
                        if (!f ||
                            0 > f.width) f = {width: 0, height: 0}
                    } else f = this.htmlGetBBox();
                    e.isSVG && (a = f.width, e = f.height, n && (f.height = e = {
                        "11px,17": 14,
                        "13px,20": 16
                    }[h && h.fontSize + "," + Math.round(e)] || e), b && (f.width = Math.abs(e * Math.sin(N)) + Math.abs(a * Math.cos(N)), f.height = Math.abs(e * Math.cos(N)) + Math.abs(a * Math.sin(N))));
                    if (D && 0 < f.height) {
                        for (; 250 < c.length;) delete m[c.shift()];
                        m[D] || c.push(D);
                        m[D] = f
                    }
                }
                return f
            },
            show: function (a) {
                return this.attr({visibility: a ? "inherit" : "visible"})
            },
            hide: function (a) {
                a ? this.attr({y: -9999}) : this.attr({visibility: "hidden"});
                return this
            },
            fadeOut: function (a) {
                var d = this;
                d.animate({opacity: 0}, {
                    duration: a || 150, complete: function () {
                        d.attr({y: -9999})
                    }
                })
            },
            add: function (a) {
                var d = this.renderer, p = this.element;
                a && (this.parentGroup = a);
                this.parentInverted = a && a.inverted;
                void 0 !== this.textStr && d.buildText(this);
                this.added = !0;
                if (!a || a.handleZ || this.zIndex) var b = this.zIndexSetter();
                b || (a ? a.element : d.box).appendChild(p);
                if (this.onAdd) this.onAdd();
                return this
            },
            safeRemoveChild: function (a) {
                var d = a.parentNode;
                d && d.removeChild(a)
            },
            destroy: function () {
                var a =
                        this, d = a.element || {}, p = a.renderer, b = p.isSVG && "SPAN" === d.nodeName && a.parentGroup,
                    f = d.ownerSVGElement, e = a.clipPath;
                d.onclick = d.onmouseout = d.onmouseover = d.onmousemove = d.point = null;
                J(a);
                e && f && ([].forEach.call(f.querySelectorAll("[clip-path],[CLIP-PATH]"), function (a) {
                    -1 < a.getAttribute("clip-path").indexOf(e.element.id) && a.removeAttribute("clip-path")
                }), a.clipPath = e.destroy());
                if (a.stops) {
                    for (f = 0; f < a.stops.length; f++) a.stops[f] = a.stops[f].destroy();
                    a.stops = null
                }
                a.safeRemoveChild(d);
                for (p.styledMode || a.destroyShadows(); b &&
                b.div && 0 === b.div.childNodes.length;) d = b.parentGroup, a.safeRemoveChild(b.div), delete b.div, b = d;
                a.alignTo && F(p.alignedObjects, a);
                z(a, function (d, p) {
                    a[p] && a[p].parentGroup === a && a[p].destroy && a[p].destroy();
                    delete a[p]
                })
            },
            shadow: function (a, d, b) {
                var f = [], e, l = this.element;
                if (!a) this.destroyShadows(); else if (!this.shadows) {
                    var h = p(a.width, 3);
                    var H = (a.opacity || .15) / h;
                    var t = this.parentInverted ? "(-1,-1)" : "(" + p(a.offsetX, 1) + ", " + p(a.offsetY, 1) + ")";
                    for (e = 1; e <= h; e++) {
                        var m = l.cloneNode(0);
                        var c = 2 * h + 1 - 2 * e;
                        y(m, {
                            stroke: a.color ||
                            "#000000",
                            "stroke-opacity": H * e,
                            "stroke-width": c,
                            transform: "translate" + t,
                            fill: "none"
                        });
                        m.setAttribute("class", (m.getAttribute("class") || "") + " highcharts-shadow");
                        b && (y(m, "height", Math.max(y(m, "height") - c, 0)), m.cutHeight = c);
                        d ? d.element.appendChild(m) : l.parentNode && l.parentNode.insertBefore(m, l);
                        f.push(m)
                    }
                    this.shadows = f
                }
                return this
            },
            destroyShadows: function () {
                (this.shadows || []).forEach(function (a) {
                    this.safeRemoveChild(a)
                }, this);
                this.shadows = void 0
            },
            xGetter: function (a) {
                "circle" === this.element.nodeName &&
                ("x" === a ? a = "cx" : "y" === a && (a = "cy"));
                return this._defaultGetter(a)
            },
            _defaultGetter: function (a) {
                a = p(this[a + "Value"], this[a], this.element ? this.element.getAttribute(a) : null, 0);
                /^[\-0-9\.]+$/.test(a) && (a = parseFloat(a));
                return a
            },
            dSetter: function (a, d, p) {
                a && a.join && (a = a.join(" "));
                /(NaN| {2}|^$)/.test(a) && (a = "M 0 0");
                this[d] !== a && (p.setAttribute(d, a), this[d] = a)
            },
            dashstyleSetter: function (a) {
                var d, p = this["stroke-width"];
                "inherit" === p && (p = 1);
                if (a = a && a.toLowerCase()) {
                    a = a.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot",
                        "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                    for (d = a.length; d--;) a[d] = r(a[d]) * p;
                    a = a.join(",").replace(/NaN/g, "none");
                    this.element.setAttribute("stroke-dasharray", a)
                }
            },
            alignSetter: function (a) {
                var d = {left: "start", center: "middle", right: "end"};
                d[a] && (this.alignValue = a, this.element.setAttribute("text-anchor", d[a]))
            },
            opacitySetter: function (a, d, p) {
                this[d] = a;
                p.setAttribute(d, a)
            },
            titleSetter: function (a) {
                var d =
                    this.element.getElementsByTagName("title")[0];
                d || (d = n.createElementNS(this.SVG_NS, "title"), this.element.appendChild(d));
                d.firstChild && d.removeChild(d.firstChild);
                d.appendChild(n.createTextNode(String(p(a, "")).replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">")))
            },
            textSetter: function (a) {
                a !== this.textStr && (delete this.bBox, delete this.textPxLength, this.textStr = a, this.added && this.renderer.buildText(this))
            },
            setTextPath: function (a, d) {
                var p = this.element, b = {textAnchor: "text-anchor"}, f = !1, e =
                    this.textPathWrapper, l = !e;
                d = G(!0, {enabled: !0, attributes: {dy: -5, startOffset: "50%", textAnchor: "middle"}}, d);
                var h = d.attributes;
                if (a && d && d.enabled) {
                    this.options && this.options.padding && (h.dx = -this.options.padding);
                    e || (this.textPathWrapper = e = this.renderer.createElement("textPath"), f = !0);
                    var H = e.element;
                    (d = a.element.getAttribute("id")) || a.element.setAttribute("id", d = c.uniqueKey());
                    if (l) for (a = p.getElementsByTagName("tspan"); a.length;) a[0].setAttribute("y", 0), H.appendChild(a[0]);
                    f && e.add({
                        element: this.text ?
                            this.text.element : p
                    });
                    H.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.renderer.url + "#" + d);
                    E(h.dy) && (H.parentNode.setAttribute("dy", h.dy), delete h.dy);
                    E(h.dx) && (H.parentNode.setAttribute("dx", h.dx), delete h.dx);
                    z(h, function (a, d) {
                        H.setAttribute(b[d] || d, a)
                    });
                    p.removeAttribute("transform");
                    this.removeTextOutline.call(e, [].slice.call(p.getElementsByTagName("tspan")));
                    this.text && !this.renderer.styledMode && this.attr({fill: "none", "stroke-width": 0});
                    this.applyTextOutline = this.updateTransform = D
                } else e &&
                (delete this.updateTransform, delete this.applyTextOutline, this.destroyTextPath(p, a));
                return this
            },
            destroyTextPath: function (a, d) {
                var p;
                d.element.setAttribute("id", "");
                for (p = this.textPathWrapper.element.childNodes; p.length;) a.firstChild.appendChild(p[0]);
                a.firstChild.removeChild(this.textPathWrapper.element);
                delete d.textPathWrapper
            },
            fillSetter: function (a, d, p) {
                "string" === typeof a ? p.setAttribute(d, a) : a && this.complexColor(a, d, p)
            },
            visibilitySetter: function (a, d, p) {
                "inherit" === a ? p.removeAttribute(d) : this[d] !==
                    a && p.setAttribute(d, a);
                this[d] = a
            },
            zIndexSetter: function (a, d) {
                var p = this.renderer, b = this.parentGroup, f = (b || p).element || p.box, e = this.element, l = !1;
                p = f === p.box;
                var h = this.added;
                var H;
                E(a) ? (e.setAttribute("data-z-index", a), a = +a, this[d] === a && (h = !1)) : E(this[d]) && e.removeAttribute("data-z-index");
                this[d] = a;
                if (h) {
                    (a = this.zIndex) && b && (b.handleZ = !0);
                    d = f.childNodes;
                    for (H = d.length - 1; 0 <= H && !l; H--) {
                        b = d[H];
                        h = b.getAttribute("data-z-index");
                        var t = !E(h);
                        if (b !== e) if (0 > a && t && !p && !H) f.insertBefore(e, d[H]), l = !0; else if (r(h) <=
                            a || t && (!E(a) || 0 <= a)) f.insertBefore(e, d[H + 1] || null), l = !0
                    }
                    l || (f.insertBefore(e, d[p ? 3 : 0] || null), l = !0)
                }
                return l
            },
            _defaultSetter: function (a, d, p) {
                p.setAttribute(d, a)
            }
        });
        L.prototype.yGetter = L.prototype.xGetter;
        L.prototype.translateXSetter = L.prototype.translateYSetter = L.prototype.rotationSetter = L.prototype.verticalAlignSetter = L.prototype.rotationOriginXSetter = L.prototype.rotationOriginYSetter = L.prototype.scaleXSetter = L.prototype.scaleYSetter = L.prototype.matrixSetter = function (a, d) {
            this[d] = a;
            this.doTransform =
                !0
        };
        L.prototype["stroke-widthSetter"] = L.prototype.strokeSetter = function (a, d, p) {
            this[d] = a;
            this.stroke && this["stroke-width"] ? (L.prototype.fillSetter.call(this, this.stroke, "stroke", p), p.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0) : "stroke-width" === d && 0 === a && this.hasStroke ? (p.removeAttribute("stroke"), this.hasStroke = !1) : this.renderer.styledMode && this["stroke-width"] && (p.setAttribute("stroke-width", this["stroke-width"]), this.hasStroke = !0)
        };
        g = c.SVGRenderer = function () {
            this.init.apply(this,
                arguments)
        };
        x(g.prototype, {
            Element: L, SVG_NS: S, init: function (a, d, p, b, f, l, h) {
                var H = this.createElement("svg").attr({version: "1.1", "class": "highcharts-root"});
                h || H.css(this.getStyle(b));
                b = H.element;
                a.appendChild(b);
                y(a, "dir", "ltr");
                -1 === a.innerHTML.indexOf("xmlns") && y(b, "xmlns", this.SVG_NS);
                this.isSVG = !0;
                this.box = b;
                this.boxWrapper = H;
                this.alignedObjects = [];
                this.url = (m || t) && n.getElementsByTagName("base").length ? R.location.href.split("#")[0].replace(/<[^>]*>/g, "").replace(/([\('\)])/g, "\\$1").replace(/ /g,
                    "%20") : "";
                this.createElement("desc").add().element.appendChild(n.createTextNode("Created with Highcharts 7.2.0"));
                this.defs = this.createElement("defs").add();
                this.allowHTML = l;
                this.forExport = f;
                this.styledMode = h;
                this.gradients = {};
                this.cache = {};
                this.cacheKeys = [];
                this.imgCount = 0;
                this.setSize(d, p, !1);
                var c;
                m && a.getBoundingClientRect && (d = function () {
                    e(a, {left: 0, top: 0});
                    c = a.getBoundingClientRect();
                    e(a, {left: Math.ceil(c.left) - c.left + "px", top: Math.ceil(c.top) - c.top + "px"})
                }, d(), this.unSubPixelFix = q(R, "resize",
                    d))
            }, definition: function (a) {
                function d(a, b) {
                    var f;
                    k(a).forEach(function (a) {
                        var e = p.createElement(a.tagName), l = {};
                        z(a, function (a, d) {
                            "tagName" !== d && "children" !== d && "textContent" !== d && (l[d] = a)
                        });
                        e.attr(l);
                        e.add(b || p.defs);
                        a.textContent && e.element.appendChild(n.createTextNode(a.textContent));
                        d(a.children || [], e);
                        f = e
                    });
                    return f
                }

                var p = this;
                return d(a)
            }, getStyle: function (a) {
                return this.style = x({
                    fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
                    fontSize: "12px"
                }, a)
            }, setStyle: function (a) {
                this.boxWrapper.css(this.getStyle(a))
            },
            isHidden: function () {
                return !this.boxWrapper.getBBox().width
            }, destroy: function () {
                var a = this.defs;
                this.box = null;
                this.boxWrapper = this.boxWrapper.destroy();
                f(this.gradients || {});
                this.gradients = null;
                a && (this.defs = a.destroy());
                this.unSubPixelFix && this.unSubPixelFix();
                return this.alignedObjects = null
            }, createElement: function (a) {
                var d = new this.Element;
                d.init(this, a);
                return d
            }, draw: D, getRadialAttr: function (a, d) {
                return {cx: a[0] - a[2] / 2 + d.cx * a[2], cy: a[1] - a[2] / 2 + d.cy * a[2], r: d.r * a[2]}
            }, truncate: function (a, d, p, b, f,
                                   e, l) {
                var h = this, H = a.rotation, t, m = b ? 1 : 0, c = (p || b).length, G = c, D = [], J = function (a) {
                    d.firstChild && d.removeChild(d.firstChild);
                    a && d.appendChild(n.createTextNode(a))
                }, v = function (e, H) {
                    H = H || e;
                    if (void 0 === D[H]) if (d.getSubStringLength) try {
                        D[H] = f + d.getSubStringLength(0, b ? H + 1 : H)
                    } catch (ha) {
                        ""
                    } else h.getSpanWidth && (J(l(p || b, e)), D[H] = f + h.getSpanWidth(a, d));
                    return D[H]
                }, x;
                a.rotation = 0;
                var M = v(d.textContent.length);
                if (x = f + M > e) {
                    for (; m <= c;) G = Math.ceil((m + c) / 2), b && (t = l(b, G)), M = v(G, t && t.length - 1), m === c ? m = c + 1 : M > e ? c = G - 1 :
                        m = G;
                    0 === c ? J("") : p && c === p.length - 1 || J(t || l(p || b, G))
                }
                b && b.splice(0, G);
                a.actualWidth = M;
                a.rotation = H;
                return x
            }, escapes: {"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"}, buildText: function (a) {
                var d = a.element, b = this, f = b.forExport, l = p(a.textStr, "").toString(),
                    h = -1 !== l.indexOf("<"), H = d.childNodes, t, m = y(d, "x"), c = a.styles, G = a.textWidth,
                    D = c && c.lineHeight, J = c && c.textOutline, v = c && "ellipsis" === c.textOverflow,
                    x = c && "nowrap" === c.whiteSpace, N = c && c.fontSize, L, k = H.length;
                c = G && !a.added && this.box;
                var w = function (a) {
                    var p;
                    b.styledMode || (p = /(px|em)$/.test(a && a.style.fontSize) ? a.style.fontSize : N || b.style.fontSize || 12);
                    return D ? r(D) : b.fontMetrics(p, a.getAttribute("style") ? a : d).h
                }, q = function (a, d) {
                    z(b.escapes, function (p, b) {
                        d && -1 !== d.indexOf(p) || (a = a.toString().replace(new RegExp(p, "g"), b))
                    });
                    return a
                }, P = function (a, d) {
                    var p = a.indexOf("<");
                    a = a.substring(p, a.indexOf(">") - p);
                    p = a.indexOf(d + "=");
                    if (-1 !== p && (p = p + d.length + 1, d = a.charAt(p), '"' === d || "'" === d)) return a = a.substring(p + 1), a.substring(0, a.indexOf(d))
                }, u = /<br.*?>/g;
                var R =
                    [l, v, x, D, J, N, G].join();
                if (R !== a.textCache) {
                    for (a.textCache = R; k--;) d.removeChild(H[k]);
                    h || J || v || G || -1 !== l.indexOf(" ") && (!x || u.test(l)) ? (c && c.appendChild(d), h ? (l = b.styledMode ? l.replace(/<(b|strong)>/g, '<span class="highcharts-strong">').replace(/<(i|em)>/g, '<span class="highcharts-emphasized">') : l.replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">'), l = l.replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(u)) : l = [l], l =
                        l.filter(function (a) {
                            return "" !== a
                        }), l.forEach(function (p, l) {
                        var h = 0, H = 0;
                        p = p.replace(/^\s+|\s+$/g, "").replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||");
                        var c = p.split("|||");
                        c.forEach(function (p) {
                            if ("" !== p || 1 === c.length) {
                                var D = {}, J = n.createElementNS(b.SVG_NS, "tspan"), k, O;
                                (k = P(p, "class")) && y(J, "class", k);
                                if (k = P(p, "style")) k = k.replace(/(;| |^)color([ :])/, "$1fill$2"), y(J, "style", k);
                                (O = P(p, "href")) && !f && (y(J, "onclick", 'location.href="' + O + '"'), y(J, "class", "highcharts-anchor"), b.styledMode ||
                                e(J, {cursor: "pointer"}));
                                p = q(p.replace(/<[a-zA-Z\/](.|\n)*?>/g, "") || " ");
                                if (" " !== p) {
                                    J.appendChild(n.createTextNode(p));
                                    h ? D.dx = 0 : l && null !== m && (D.x = m);
                                    y(J, D);
                                    d.appendChild(J);
                                    !h && L && (!M && f && e(J, {display: "block"}), y(J, "dy", w(J)));
                                    if (G) {
                                        var r = p.replace(/([^\^])-/g, "$1- ").split(" ");
                                        D = !x && (1 < c.length || l || 1 < r.length);
                                        O = 0;
                                        var u = w(J);
                                        if (v) t = b.truncate(a, J, p, void 0, 0, Math.max(0, G - parseInt(N || 12, 10)), function (a, d) {
                                            return a.substring(0, d) + "\u2026"
                                        }); else if (D) for (; r.length;) r.length && !x && 0 < O && (J = n.createElementNS(S,
                                            "tspan"), y(J, {
                                            dy: u,
                                            x: m
                                        }), k && y(J, "style", k), J.appendChild(n.createTextNode(r.join(" ").replace(/- /g, "-"))), d.appendChild(J)), b.truncate(a, J, null, r, 0 === O ? H : 0, G, function (a, d) {
                                            return r.slice(0, d).join(" ").replace(/- /g, "-")
                                        }), H = a.actualWidth, O++
                                    }
                                    h++
                                }
                            }
                        });
                        L = L || d.childNodes.length
                    }), v && t && a.attr("title", q(a.textStr, ["&lt;", "&gt;"])), c && c.removeChild(d), J && a.applyTextOutline && a.applyTextOutline(J)) : d.appendChild(n.createTextNode(q(l)))
                }
            }, getContrast: function (d) {
                d = a(d).rgba;
                d[0] *= 1;
                d[1] *= 1.2;
                d[2] *= .5;
                return 459 <
                d[0] + d[1] + d[2] ? "#000000" : "#FFFFFF"
            }, button: function (a, d, p, b, f, e, h, H, t, c) {
                var m = this.label(a, d, p, t, null, null, c, null, "button"), n = 0, D = this.styledMode;
                m.attr(G({padding: 8, r: 2}, f));
                if (!D) {
                    f = G({
                        fill: "#f7f7f7",
                        stroke: "#cccccc",
                        "stroke-width": 1,
                        style: {color: "#333333", cursor: "pointer", fontWeight: "normal"}
                    }, f);
                    var J = f.style;
                    delete f.style;
                    e = G(f, {fill: "#e6e6e6"}, e);
                    var v = e.style;
                    delete e.style;
                    h = G(f, {fill: "#e6ebf5", style: {color: "#000000", fontWeight: "bold"}}, h);
                    var M = h.style;
                    delete h.style;
                    H = G(f, {style: {color: "#cccccc"}},
                        H);
                    var N = H.style;
                    delete H.style
                }
                q(m.element, l ? "mouseover" : "mouseenter", function () {
                    3 !== n && m.setState(1)
                });
                q(m.element, l ? "mouseout" : "mouseleave", function () {
                    3 !== n && m.setState(n)
                });
                m.setState = function (a) {
                    1 !== a && (m.state = n = a);
                    m.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-" + ["normal", "hover", "pressed", "disabled"][a || 0]);
                    D || m.attr([f, e, h, H][a || 0]).css([J, v, M, N][a || 0])
                };
                D || m.attr(f).css(x({cursor: "default"}, J));
                return m.on("click", function (a) {
                    3 !== n && b.call(m,
                        a)
                })
            }, crispLine: function (a, d) {
                a[1] === a[4] && (a[1] = a[4] = Math.round(a[1]) - d % 2 / 2);
                a[2] === a[5] && (a[2] = a[5] = Math.round(a[2]) + d % 2 / 2);
                return a
            }, path: function (a) {
                var d = this.styledMode ? {} : {fill: "none"};
                I(a) ? d.d = a : A(a) && x(d, a);
                return this.createElement("path").attr(d)
            }, circle: function (a, d, p) {
                a = A(a) ? a : void 0 === a ? {} : {x: a, y: d, r: p};
                d = this.createElement("circle");
                d.xSetter = d.ySetter = function (a, d, p) {
                    p.setAttribute("c" + d, a)
                };
                return d.attr(a)
            }, arc: function (a, d, p, b, f, e) {
                A(a) ? (b = a, d = b.y, p = b.r, a = b.x) : b = {
                    innerR: b, start: f,
                    end: e
                };
                a = this.symbol("arc", a, d, p, p, b);
                a.r = p;
                return a
            }, rect: function (a, d, p, b, f, e) {
                f = A(a) ? a.r : f;
                var l = this.createElement("rect");
                a = A(a) ? a : void 0 === a ? {} : {x: a, y: d, width: Math.max(p, 0), height: Math.max(b, 0)};
                this.styledMode || (void 0 !== e && (a.strokeWidth = e, a = l.crisp(a)), a.fill = "none");
                f && (a.r = f);
                l.rSetter = function (a, d, p) {
                    l.r = a;
                    y(p, {rx: a, ry: a})
                };
                l.rGetter = function () {
                    return l.r
                };
                return l.attr(a)
            }, setSize: function (a, d, b) {
                var f = this.alignedObjects, e = f.length;
                this.width = a;
                this.height = d;
                for (this.boxWrapper.animate({
                    width: a,
                    height: d
                }, {
                    step: function () {
                        this.attr({viewBox: "0 0 " + this.attr("width") + " " + this.attr("height")})
                    }, duration: p(b, !0) ? void 0 : 0
                }); e--;) f[e].align()
            }, g: function (a) {
                var d = this.createElement("g");
                return a ? d.attr({"class": "highcharts-" + a}) : d
            }, image: function (a, d, p, b, f, e) {
                var l = {preserveAspectRatio: "none"}, h = function (a, d) {
                    a.setAttributeNS ? a.setAttributeNS("http://www.w3.org/1999/xlink", "href", d) : a.setAttribute("hc-svg-href", d)
                }, H = function (d) {
                    h(t.element, a);
                    e.call(t, d)
                };
                1 < arguments.length && x(l, {
                    x: d, y: p, width: b,
                    height: f
                });
                var t = this.createElement("image").attr(l);
                e ? (h(t.element, "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="), l = new R.Image, q(l, "load", H), l.src = a, l.complete && H({})) : h(t.element, a);
                return t
            }, symbol: function (a, d, f, l, H, t) {
                var m = this, c = /^url\((.*?)\)$/, G = c.test(a), D = !G && (this.symbols[a] ? a : "circle"),
                    J = D && this.symbols[D],
                    v = E(d) && J && J.call(this.symbols, Math.round(d), Math.round(f), l, H, t);
                if (J) {
                    var M = this.path(v);
                    m.styledMode || M.attr("fill", "none");
                    x(M, {
                        symbolName: D, x: d,
                        y: f, width: l, height: H
                    });
                    t && x(M, t)
                } else if (G) {
                    var L = a.match(c)[1];
                    M = this.image(L);
                    M.imgwidth = p(P[L] && P[L].width, t && t.width);
                    M.imgheight = p(P[L] && P[L].height, t && t.height);
                    var k = function () {
                        M.attr({width: M.width, height: M.height})
                    };
                    ["width", "height"].forEach(function (a) {
                        M[a + "Setter"] = function (a, d) {
                            var p = {}, b = this["img" + d], f = "width" === d ? "translateX" : "translateY";
                            this[d] = a;
                            E(b) && (t && "within" === t.backgroundSize && this.width && this.height && (b = Math.round(b * Math.min(this.width / this.imgwidth, this.height / this.imgheight))),
                            this.element && this.element.setAttribute(d, b), this.alignByTranslate || (p[f] = ((this[d] || 0) - b) / 2, this.attr(p)))
                        }
                    });
                    E(d) && M.attr({x: d, y: f});
                    M.isImg = !0;
                    E(M.imgwidth) && E(M.imgheight) ? k() : (M.attr({width: 0, height: 0}), h("img", {
                        onload: function () {
                            var a = b[m.chartIndex];
                            0 === this.width && (e(this, {
                                position: "absolute",
                                top: "-999em"
                            }), n.body.appendChild(this));
                            P[L] = {width: this.width, height: this.height};
                            M.imgwidth = this.width;
                            M.imgheight = this.height;
                            M.element && k();
                            this.parentNode && this.parentNode.removeChild(this);
                            m.imgCount--;
                            if (!m.imgCount && a && a.onload) a.onload()
                        }, src: L
                    }), this.imgCount++)
                }
                return M
            }, symbols: {
                circle: function (a, d, p, b) {
                    return this.arc(a + p / 2, d + b / 2, p / 2, b / 2, {
                        start: .5 * Math.PI,
                        end: 2.5 * Math.PI,
                        open: !1
                    })
                }, square: function (a, d, p, b) {
                    return ["M", a, d, "L", a + p, d, a + p, d + b, a, d + b, "Z"]
                }, triangle: function (a, d, p, b) {
                    return ["M", a + p / 2, d, "L", a + p, d + b, a, d + b, "Z"]
                }, "triangle-down": function (a, d, p, b) {
                    return ["M", a, d, "L", a + p, d, a + p / 2, d + b, "Z"]
                }, diamond: function (a, d, p, b) {
                    return ["M", a + p / 2, d, "L", a + p, d + b / 2, a + p / 2, d + b, a, d + b / 2, "Z"]
                }, arc: function (a,
                                  d, b, f, e) {
                    var l = e.start, h = e.r || b, H = e.r || f || b, t = e.end - .001;
                    b = e.innerR;
                    f = p(e.open, .001 > Math.abs(e.end - e.start - 2 * Math.PI));
                    var m = Math.cos(l), c = Math.sin(l), n = Math.cos(t);
                    t = Math.sin(t);
                    l = .001 > e.end - l - Math.PI ? 0 : 1;
                    e = ["M", a + h * m, d + H * c, "A", h, H, 0, l, p(e.clockwise, 1), a + h * n, d + H * t];
                    E(b) && e.push(f ? "M" : "L", a + b * n, d + b * t, "A", b, b, 0, l, 0, a + b * m, d + b * c);
                    e.push(f ? "" : "Z");
                    return e
                }, callout: function (a, d, p, b, f) {
                    var e = Math.min(f && f.r || 0, p, b), l = e + 6, h = f && f.anchorX;
                    f = f && f.anchorY;
                    var H = ["M", a + e, d, "L", a + p - e, d, "C", a + p, d, a + p, d, a + p, d +
                    e, "L", a + p, d + b - e, "C", a + p, d + b, a + p, d + b, a + p - e, d + b, "L", a + e, d + b, "C", a, d + b, a, d + b, a, d + b - e, "L", a, d + e, "C", a, d, a, d, a + e, d];
                    h && h > p ? f > d + l && f < d + b - l ? H.splice(13, 3, "L", a + p, f - 6, a + p + 6, f, a + p, f + 6, a + p, d + b - e) : H.splice(13, 3, "L", a + p, b / 2, h, f, a + p, b / 2, a + p, d + b - e) : h && 0 > h ? f > d + l && f < d + b - l ? H.splice(33, 3, "L", a, f + 6, a - 6, f, a, f - 6, a, d + e) : H.splice(33, 3, "L", a, b / 2, h, f, a, b / 2, a, d + e) : f && f > b && h > a + l && h < a + p - l ? H.splice(23, 3, "L", h + 6, d + b, h, d + b + 6, h - 6, d + b, a + e, d + b) : f && 0 > f && h > a + l && h < a + p - l && H.splice(3, 3, "L", h - 6, d, h, d - 6, h + 6, d, p - e, d);
                    return H
                }
            }, clipRect: function (a,
                                   d, p, b) {
                var f = c.uniqueKey() + "-", e = this.createElement("clipPath").attr({id: f}).add(this.defs);
                a = this.rect(a, d, p, b, 0).add(e);
                a.id = f;
                a.clipPath = e;
                a.count = 0;
                return a
            }, text: function (a, d, p, b) {
                var f = {};
                if (b && (this.allowHTML || !this.forExport)) return this.html(a, d, p);
                f.x = Math.round(d || 0);
                p && (f.y = Math.round(p));
                E(a) && (f.text = a);
                a = this.createElement("text").attr(f);
                b || (a.xSetter = function (a, d, p) {
                    var b = p.getElementsByTagName("tspan"), f = p.getAttribute(d), e;
                    for (e = 0; e < b.length; e++) {
                        var l = b[e];
                        l.getAttribute(d) ===
                        f && l.setAttribute(d, a)
                    }
                    p.setAttribute(d, a)
                });
                return a
            }, fontMetrics: function (a, d) {
                a = !this.styledMode && /px/.test(a) || !R.getComputedStyle ? a || d && d.style && d.style.fontSize || this.style && this.style.fontSize : d && L.prototype.getStyle.call(d, "font-size");
                a = /px/.test(a) ? r(a) : 12;
                d = 24 > a ? a + 3 : Math.round(1.2 * a);
                return {h: d, b: Math.round(.8 * d), f: a}
            }, rotCorr: function (a, p, b) {
                var f = a;
                p && b && (f = Math.max(f * Math.cos(p * d), 4));
                return {x: -a / 3 * Math.sin(p * d), y: f}
            }, label: function (a, d, p, b, f, e, l, h, t) {
                var m = this, c = m.styledMode, n = m.g("button" !==
                    t && "label"), D = n.text = m.text("", 0, 0, l).attr({zIndex: 1}), J, v, M = 0, k = 3, w = 0, q, r,
                    S, N, u, P = {}, O, R, g = /^url\((.*?)\)$/.test(b), z = c || g, fa = function () {
                        return c ? J.strokeWidth() % 2 / 2 : (O ? parseInt(O, 10) : 0) % 2 / 2
                    };
                t && n.addClass("highcharts-" + t);
                var A = function () {
                    var a = D.element.style, d = {};
                    v = (void 0 === q || void 0 === r || u) && E(D.textStr) && D.getBBox();
                    n.width = (q || v.width || 0) + 2 * k + w;
                    n.height = (r || v.height || 0) + 2 * k;
                    R = k + Math.min(m.fontMetrics(a && a.fontSize, D).b, v ? v.height : Infinity);
                    z && (J || (n.box = J = m.symbols[b] || g ? m.symbol(b) : m.rect(),
                        J.addClass(("button" === t ? "" : "highcharts-label-box") + (t ? " highcharts-" + t + "-box" : "")), J.add(n), a = fa(), d.x = a, d.y = (h ? -R : 0) + a), d.width = Math.round(n.width), d.height = Math.round(n.height), J.attr(x(d, P)), P = {})
                };
                var I = function () {
                    var a = w + k;
                    var d = h ? 0 : R;
                    E(q) && v && ("center" === u || "right" === u) && (a += {center: .5, right: 1}[u] * (q - v.width));
                    if (a !== D.x || d !== D.y) D.attr("x", a), D.hasBoxWidthChanged && (v = D.getBBox(!0), A()), void 0 !== d && D.attr("y", d);
                    D.x = a;
                    D.y = d
                };
                var y = function (a, d) {
                    J ? J.attr(a, d) : P[a] = d
                };
                n.onAdd = function () {
                    D.add(n);
                    n.attr({text: a || 0 === a ? a : "", x: d, y: p});
                    J && E(f) && n.attr({anchorX: f, anchorY: e})
                };
                n.widthSetter = function (a) {
                    q = C(a) ? a : null
                };
                n.heightSetter = function (a) {
                    r = a
                };
                n["text-alignSetter"] = function (a) {
                    u = a
                };
                n.paddingSetter = function (a) {
                    E(a) && a !== k && (k = n.padding = a, I())
                };
                n.paddingLeftSetter = function (a) {
                    E(a) && a !== w && (w = a, I())
                };
                n.alignSetter = function (a) {
                    a = {left: 0, center: .5, right: 1}[a];
                    a !== M && (M = a, v && n.attr({x: S}))
                };
                n.textSetter = function (a) {
                    void 0 !== a && D.attr({text: a});
                    A();
                    I()
                };
                n["stroke-widthSetter"] = function (a, d) {
                    a && (z =
                        !0);
                    O = this["stroke-width"] = a;
                    y(d, a)
                };
                c ? n.rSetter = function (a, d) {
                    y(d, a)
                } : n.strokeSetter = n.fillSetter = n.rSetter = function (a, d) {
                    "r" !== d && ("fill" === d && a && (z = !0), n[d] = a);
                    y(d, a)
                };
                n.anchorXSetter = function (a, d) {
                    f = n.anchorX = a;
                    y(d, Math.round(a) - fa() - S)
                };
                n.anchorYSetter = function (a, d) {
                    e = n.anchorY = a;
                    y(d, a - N)
                };
                n.xSetter = function (a) {
                    n.x = a;
                    M && (a -= M * ((q || v.width) + 2 * k), n["forceAnimate:x"] = !0);
                    S = Math.round(a);
                    n.attr("translateX", S)
                };
                n.ySetter = function (a) {
                    N = n.y = Math.round(a);
                    n.attr("translateY", N)
                };
                var F = n.css;
                l = {
                    css: function (a) {
                        if (a) {
                            var d =
                                {};
                            a = G(a);
                            n.textProps.forEach(function (p) {
                                void 0 !== a[p] && (d[p] = a[p], delete a[p])
                            });
                            D.css(d);
                            "width" in d && A();
                            "fontSize" in d && (A(), I())
                        }
                        return F.call(n, a)
                    }, getBBox: function () {
                        return {width: v.width + 2 * k, height: v.height + 2 * k, x: v.x - k, y: v.y - k}
                    }, destroy: function () {
                        H(n.element, "mouseenter");
                        H(n.element, "mouseleave");
                        D && (D = D.destroy());
                        J && (J = J.destroy());
                        L.prototype.destroy.call(n);
                        n = m = A = I = y = null
                    }
                };
                c || (l.shadow = function (a) {
                    a && (A(), J && J.shadow(a));
                    return n
                });
                return x(n, l)
            }
        });
        c.Renderer = g
    });
    K(B, "parts/Html.js",
        [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
            var y = g.attr, E = g.defined, F = g.pInt, I = c.createElement, C = c.css, A = c.extend, u = c.isFirefox,
                z = c.isMS, r = c.isWebKit, k = c.pick, q = c.SVGElement;
            g = c.SVGRenderer;
            var w = c.win;
            A(q.prototype, {
                htmlCss: function (b) {
                    var a = "SPAN" === this.element.tagName && b && "width" in b, e = k(a && b.width, void 0);
                    if (a) {
                        delete b.width;
                        this.textWidth = e;
                        var h = !0
                    }
                    b && "ellipsis" === b.textOverflow && (b.whiteSpace = "nowrap", b.overflow = "hidden");
                    this.styles = A(this.styles, b);
                    C(this.element, b);
                    h && this.htmlUpdateTransform();
                    return this
                }, htmlGetBBox: function () {
                    var b = this.element;
                    return {x: b.offsetLeft, y: b.offsetTop, width: b.offsetWidth, height: b.offsetHeight}
                }, htmlUpdateTransform: function () {
                    if (this.added) {
                        var b = this.renderer, a = this.element, e = this.translateX || 0, h = this.translateY || 0,
                            d = this.x || 0, f = this.y || 0, c = this.textAlign || "left",
                            x = {left: 0, center: .5, right: 1}[c], v = this.styles, m = v && v.whiteSpace;
                        C(a, {marginLeft: e, marginTop: h});
                        !b.styledMode && this.shadows && this.shadows.forEach(function (a) {
                            C(a, {
                                marginLeft: e +
                                1, marginTop: h + 1
                            })
                        });
                        this.inverted && [].forEach.call(a.childNodes, function (d) {
                            b.invertChild(d, a)
                        });
                        if ("SPAN" === a.tagName) {
                            v = this.rotation;
                            var l = this.textWidth && F(this.textWidth),
                                t = [v, c, a.innerHTML, this.textWidth, this.textAlign].join(), G;
                            (G = l !== this.oldTextWidth) && !(G = l > this.oldTextWidth) && ((G = this.textPxLength) || (C(a, {
                                width: "",
                                whiteSpace: m || "nowrap"
                            }), G = a.offsetWidth), G = G > l);
                            G && (/[ \-]/.test(a.textContent || a.innerText) || "ellipsis" === a.style.textOverflow) ? (C(a, {
                                width: l + "px", display: "block", whiteSpace: m ||
                                "normal"
                            }), this.oldTextWidth = l, this.hasBoxWidthChanged = !0) : this.hasBoxWidthChanged = !1;
                            t !== this.cTT && (m = b.fontMetrics(a.style.fontSize, a).b, !E(v) || v === (this.oldRotation || 0) && c === this.oldAlign || this.setSpanRotation(v, x, m), this.getSpanCorrection(!E(v) && this.textPxLength || a.offsetWidth, m, x, v, c));
                            C(a, {left: d + (this.xCorr || 0) + "px", top: f + (this.yCorr || 0) + "px"});
                            this.cTT = t;
                            this.oldRotation = v;
                            this.oldAlign = c
                        }
                    } else this.alignOnAdd = !0
                }, setSpanRotation: function (b, a, e) {
                    var h = {}, d = this.renderer.getTransformKey();
                    h[d] = h.transform = "rotate(" + b + "deg)";
                    h[d + (u ? "Origin" : "-origin")] = h.transformOrigin = 100 * a + "% " + e + "px";
                    C(this.element, h)
                }, getSpanCorrection: function (b, a, e) {
                    this.xCorr = -b * e;
                    this.yCorr = -a
                }
            });
            A(g.prototype, {
                getTransformKey: function () {
                    return z && !/Edge/.test(w.navigator.userAgent) ? "-ms-transform" : r ? "-webkit-transform" : u ? "MozTransform" : w.opera ? "-o-transform" : ""
                }, html: function (b, a, e) {
                    var h = this.createElement("span"), d = h.element, f = h.renderer, c = f.isSVG,
                        x = function (a, d) {
                            ["opacity", "visibility"].forEach(function (b) {
                                a[b +
                                "Setter"] = function (f, e, l) {
                                    var p = a.div ? a.div.style : d;
                                    q.prototype[b + "Setter"].call(this, f, e, l);
                                    p && (p[e] = f)
                                }
                            });
                            a.addedSetters = !0
                        };
                    h.textSetter = function (a) {
                        a !== d.innerHTML && (delete this.bBox, delete this.oldTextWidth);
                        this.textStr = a;
                        d.innerHTML = k(a, "");
                        h.doTransform = !0
                    };
                    c && x(h, h.element.style);
                    h.xSetter = h.ySetter = h.alignSetter = h.rotationSetter = function (a, d) {
                        "align" === d && (d = "textAlign");
                        h[d] = a;
                        h.doTransform = !0
                    };
                    h.afterSetters = function () {
                        this.doTransform && (this.htmlUpdateTransform(), this.doTransform = !1)
                    };
                    h.attr({text: b, x: Math.round(a), y: Math.round(e)}).css({position: "absolute"});
                    f.styledMode || h.css({fontFamily: this.style.fontFamily, fontSize: this.style.fontSize});
                    d.style.whiteSpace = "nowrap";
                    h.css = h.htmlCss;
                    c && (h.add = function (a) {
                        var b = f.box.parentNode, e = [];
                        if (this.parentGroup = a) {
                            var t = a.div;
                            if (!t) {
                                for (; a;) e.push(a), a = a.parentGroup;
                                e.reverse().forEach(function (a) {
                                    function d(d, p) {
                                        a[p] = d;
                                        "translateX" === p ? f.left = d + "px" : f.top = d + "px";
                                        a.doTransform = !0
                                    }

                                    var p = y(a.element, "class");
                                    t = a.div = a.div || I("div", p ? {className: p} :
                                        void 0, {
                                        position: "absolute",
                                        left: (a.translateX || 0) + "px",
                                        top: (a.translateY || 0) + "px",
                                        display: a.display,
                                        opacity: a.opacity,
                                        pointerEvents: a.styles && a.styles.pointerEvents
                                    }, t || b);
                                    var f = t.style;
                                    A(a, {
                                        classSetter: function (a) {
                                            return function (d) {
                                                this.element.setAttribute("class", d);
                                                a.className = d
                                            }
                                        }(t), on: function () {
                                            e[0].div && h.on.apply({element: e[0].div}, arguments);
                                            return a
                                        }, translateXSetter: d, translateYSetter: d
                                    });
                                    a.addedSetters || x(a)
                                })
                            }
                        } else t = b;
                        t.appendChild(d);
                        h.added = !0;
                        h.alignOnAdd && h.htmlUpdateTransform();
                        return h
                    });
                    return h
                }
            })
        });
    K(B, "parts/Time.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isObject, F = g.objectEach, I = g.splat, C = c.extend, A = c.merge, u = c.pick,
            z = c.timeUnits, r = c.win;
        c.Time = function (c) {
            this.update(c, !1)
        };
        c.Time.prototype = {
            defaultOptions: {}, update: function (c) {
                var k = u(c && c.useUTC, !0), w = this;
                this.options = c = A(!0, this.options || {}, c);
                this.Date = c.Date || r.Date || Date;
                this.timezoneOffset = (this.useUTC = k) && c.timezoneOffset;
                this.getTimezoneOffset = this.timezoneOffsetFunction();
                (this.variableTimezone = !(k && !c.getTimezoneOffset && !c.timezone)) || this.timezoneOffset ? (this.get = function (b, a) {
                    var e = a.getTime(), h = e - w.getTimezoneOffset(a);
                    a.setTime(h);
                    b = a["getUTC" + b]();
                    a.setTime(e);
                    return b
                }, this.set = function (b, a, e) {
                    if ("Milliseconds" === b || "Seconds" === b || "Minutes" === b && 0 === a.getTimezoneOffset() % 60) a["set" + b](e); else {
                        var h = w.getTimezoneOffset(a);
                        h = a.getTime() - h;
                        a.setTime(h);
                        a["setUTC" + b](e);
                        b = w.getTimezoneOffset(a);
                        h = a.getTime() + b;
                        a.setTime(h)
                    }
                }) : k ? (this.get = function (b, a) {
                    return a["getUTC" +
                    b]()
                }, this.set = function (b, a, e) {
                    return a["setUTC" + b](e)
                }) : (this.get = function (b, a) {
                    return a["get" + b]()
                }, this.set = function (b, a, e) {
                    return a["set" + b](e)
                })
            }, makeTime: function (k, q, w, b, a, e) {
                if (this.useUTC) {
                    var h = this.Date.UTC.apply(0, arguments);
                    var d = this.getTimezoneOffset(h);
                    h += d;
                    var f = this.getTimezoneOffset(h);
                    d !== f ? h += f - d : d - 36E5 !== this.getTimezoneOffset(h - 36E5) || c.isSafari || (h -= 36E5)
                } else h = (new this.Date(k, q, u(w, 1), u(b, 0), u(a, 0), u(e, 0))).getTime();
                return h
            }, timezoneOffsetFunction: function () {
                var k = this,
                    q = this.options, w = r.moment;
                if (!this.useUTC) return function (b) {
                    return 6E4 * (new Date(b)).getTimezoneOffset()
                };
                if (q.timezone) {
                    if (w) return function (b) {
                        return 6E4 * -w.tz(b, q.timezone).utcOffset()
                    };
                    c.error(25)
                }
                return this.useUTC && q.getTimezoneOffset ? function (b) {
                    return 6E4 * q.getTimezoneOffset(b)
                } : function () {
                    return 6E4 * (k.timezoneOffset || 0)
                }
            }, dateFormat: function (k, q, w) {
                if (!y(q) || isNaN(q)) return c.defaultOptions.lang.invalidDate || "";
                k = c.pick(k, "%Y-%m-%d %H:%M:%S");
                var b = this, a = new this.Date(q), e = this.get("Hours",
                    a), h = this.get("Day", a), d = this.get("Date", a), f = this.get("Month", a),
                    n = this.get("FullYear", a), x = c.defaultOptions.lang, v = x.weekdays, m = x.shortWeekdays,
                    l = c.pad;
                a = c.extend({
                    a: m ? m[h] : v[h].substr(0, 3),
                    A: v[h],
                    d: l(d),
                    e: l(d, 2, " "),
                    w: h,
                    b: x.shortMonths[f],
                    B: x.months[f],
                    m: l(f + 1),
                    o: f + 1,
                    y: n.toString().substr(2, 2),
                    Y: n,
                    H: l(e),
                    k: e,
                    I: l(e % 12 || 12),
                    l: e % 12 || 12,
                    M: l(b.get("Minutes", a)),
                    p: 12 > e ? "AM" : "PM",
                    P: 12 > e ? "am" : "pm",
                    S: l(a.getSeconds()),
                    L: l(Math.floor(q % 1E3), 3)
                }, c.dateFormats);
                F(a, function (a, d) {
                    for (; -1 !== k.indexOf("%" + d);) k =
                        k.replace("%" + d, "function" === typeof a ? a.call(b, q) : a)
                });
                return w ? k.substr(0, 1).toUpperCase() + k.substr(1) : k
            }, resolveDTLFormat: function (c) {
                return E(c, !0) ? c : (c = I(c), {main: c[0], from: c[1], to: c[2]})
            }, getTimeTicks: function (c, q, w, b) {
                var a = this, e = [], h = {};
                var d = new a.Date(q);
                var f = c.unitRange, n = c.count || 1, x;
                b = u(b, 1);
                if (y(q)) {
                    a.set("Milliseconds", d, f >= z.second ? 0 : n * Math.floor(a.get("Milliseconds", d) / n));
                    f >= z.second && a.set("Seconds", d, f >= z.minute ? 0 : n * Math.floor(a.get("Seconds", d) / n));
                    f >= z.minute && a.set("Minutes",
                        d, f >= z.hour ? 0 : n * Math.floor(a.get("Minutes", d) / n));
                    f >= z.hour && a.set("Hours", d, f >= z.day ? 0 : n * Math.floor(a.get("Hours", d) / n));
                    f >= z.day && a.set("Date", d, f >= z.month ? 1 : Math.max(1, n * Math.floor(a.get("Date", d) / n)));
                    if (f >= z.month) {
                        a.set("Month", d, f >= z.year ? 0 : n * Math.floor(a.get("Month", d) / n));
                        var v = a.get("FullYear", d)
                    }
                    f >= z.year && a.set("FullYear", d, v - v % n);
                    f === z.week && (v = a.get("Day", d), a.set("Date", d, a.get("Date", d) - v + b + (v < b ? -7 : 0)));
                    v = a.get("FullYear", d);
                    b = a.get("Month", d);
                    var m = a.get("Date", d), l = a.get("Hours",
                        d);
                    q = d.getTime();
                    a.variableTimezone && (x = w - q > 4 * z.month || a.getTimezoneOffset(q) !== a.getTimezoneOffset(w));
                    q = d.getTime();
                    for (d = 1; q < w;) e.push(q), q = f === z.year ? a.makeTime(v + d * n, 0) : f === z.month ? a.makeTime(v, b + d * n) : !x || f !== z.day && f !== z.week ? x && f === z.hour && 1 < n ? a.makeTime(v, b, m, l + d * n) : q + f * n : a.makeTime(v, b, m + d * n * (f === z.day ? 1 : 7)), d++;
                    e.push(q);
                    f <= z.hour && 1E4 > e.length && e.forEach(function (d) {
                        0 === d % 18E5 && "000000000" === a.dateFormat("%H%M%S%L", d) && (h[d] = "day")
                    })
                }
                e.info = C(c, {higherRanks: h, totalRange: f * n});
                return e
            }
        }
    });
    K(B, "parts/Options.js", [B["parts/Globals.js"]], function (c) {
        var g = c.color, y = c.merge;
        c.defaultOptions = {
            colors: "#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),
            symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
            lang: {
                loading: "Loading...",
                months: "January February March April May June July August September October November December".split(" "),
                shortMonths: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
                weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
                decimalPoint: ".",
                numericSymbols: "kMGTPE".split(""),
                resetZoom: "Reset zoom",
                resetZoomTitle: "Reset zoom level 1:1",
                thousandsSep: " "
            },
            global: {},
            time: c.Time.prototype.defaultOptions,
            chart: {
                styledMode: !1,
                borderRadius: 0,
                colorCount: 10,
                defaultSeriesType: "line",
                ignoreHiddenSeries: !0,
                spacing: [10, 10, 15, 10],
                resetZoomButton: {theme: {zIndex: 6}, position: {align: "right", x: -10, y: 10}},
                width: null,
                height: null,
                borderColor: "#335cad",
                backgroundColor: "#ffffff",
                plotBorderColor: "#cccccc"
            },
            title: {
                text: "Chart title", align: "center",
                margin: 15, widthAdjust: -44
            },
            subtitle: {text: "", align: "center", widthAdjust: -44},
            caption: {margin: 15, text: "", align: "left", verticalAlign: "bottom"},
            plotOptions: {},
            labels: {style: {position: "absolute", color: "#333333"}},
            legend: {
                enabled: !0,
                align: "center",
                alignColumns: !0,
                layout: "horizontal",
                labelFormatter: function () {
                    return this.name
                },
                borderColor: "#999999",
                borderRadius: 0,
                navigation: {activeColor: "#003399", inactiveColor: "#cccccc"},
                itemStyle: {
                    color: "#333333",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textOverflow: "ellipsis"
                },
                itemHoverStyle: {color: "#000000"},
                itemHiddenStyle: {color: "#cccccc"},
                shadow: !1,
                itemCheckboxStyle: {position: "absolute", width: "13px", height: "13px"},
                squareSymbol: !0,
                symbolPadding: 5,
                verticalAlign: "bottom",
                x: 0,
                y: 0,
                title: {style: {fontWeight: "bold"}}
            },
            loading: {
                labelStyle: {fontWeight: "bold", position: "relative", top: "45%"},
                style: {position: "absolute", backgroundColor: "#ffffff", opacity: .5, textAlign: "center"}
            },
            tooltip: {
                enabled: !0,
                animation: c.svg,
                borderRadius: 3,
                dateTimeLabelFormats: {
                    millisecond: "%A, %b %e, %H:%M:%S.%L",
                    second: "%A, %b %e, %H:%M:%S",
                    minute: "%A, %b %e, %H:%M",
                    hour: "%A, %b %e, %H:%M",
                    day: "%A, %b %e, %Y",
                    week: "Week from %A, %b %e, %Y",
                    month: "%B %Y",
                    year: "%Y"
                },
                footerFormat: "",
                padding: 8,
                snap: c.isTouchDevice ? 25 : 10,
                headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
                pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
                backgroundColor: g("#f7f7f7").setOpacity(.85).get(),
                borderWidth: 1,
                shadow: !0,
                style: {
                    color: "#333333", cursor: "default", fontSize: "12px",
                    pointerEvents: "none", whiteSpace: "nowrap"
                }
            },
            credits: {
                enabled: !0,
                href: "https://www.highcharts.com?credits",
                position: {align: "right", x: -10, verticalAlign: "bottom", y: -5},
                style: {cursor: "pointer", color: "#999999", fontSize: "9px"},
                text: "Highcharts.com"
            }
        };
        c.setOptions = function (g) {
            c.defaultOptions = y(!0, c.defaultOptions, g);
            c.time.update(y(c.defaultOptions.global, c.defaultOptions.time), !1);
            return c.defaultOptions
        };
        c.getOptions = function () {
            return c.defaultOptions
        };
        c.defaultPlotOptions = c.defaultOptions.plotOptions;
        c.time = new c.Time(y(c.defaultOptions.global, c.defaultOptions.time));
        c.dateFormat = function (g, y, I) {
            return c.time.dateFormat(g, y, I)
        };
        ""
    });
    K(B, "parts/Tick.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, F = c.correctFloat, I = c.destroyObjectProperties, C = c.fireEvent,
            A = c.merge, u = c.pick, z = c.deg2rad;
        c.Tick = function (c, k, q, w, b) {
            this.axis = c;
            this.pos = k;
            this.type = q || "";
            this.isNewLabel = this.isNew = !0;
            this.parameters = b || {};
            this.tickmarkOffset = this.parameters.tickmarkOffset;
            this.options = this.parameters.options;
            q || w || this.addLabel()
        };
        c.Tick.prototype = {
            addLabel: function () {
                var r = this, k = r.axis, q = k.options, w = k.chart, b = k.categories, a = k.names, e = r.pos,
                    h = u(r.options && r.options.labels, q.labels), d = k.tickPositions, f = e === d[0],
                    n = e === d[d.length - 1];
                b = this.parameters.category || (b ? u(b[e], a[e], e) : e);
                var x = r.label;
                d = d.info;
                var v, m;
                if (k.isDatetimeAxis && d) {
                    var l = w.time.resolveDTLFormat(q.dateTimeLabelFormats[!q.grid && d.higherRanks[e] || d.unitName]);
                    var t = l.main
                }
                r.isFirst = f;
                r.isLast = n;
                r.formatCtx =
                    {
                        axis: k,
                        chart: w,
                        isFirst: f,
                        isLast: n,
                        dateTimeLabelFormat: t,
                        tickPositionInfo: d,
                        value: k.isLog ? F(k.lin2log(b)) : b,
                        pos: e
                    };
                q = k.labelFormatter.call(r.formatCtx, this.formatCtx);
                if (m = l && l.list) r.shortenLabel = function () {
                    for (v = 0; v < m.length; v++) if (x.attr({text: k.labelFormatter.call(c.extend(r.formatCtx, {dateTimeLabelFormat: m[v]}))}), x.getBBox().width < k.getSlotWidth(r) - 2 * u(h.padding, 5)) return;
                    x.attr({text: ""})
                };
                if (y(x)) x && x.textStr !== q && (!x.textWidth || h.style && h.style.width || x.styles.width || x.css({width: null}),
                    x.attr({text: q}), x.textPxLength = x.getBBox().width); else {
                    if (r.label = x = y(q) && h.enabled ? w.renderer.text(q, 0, 0, h.useHTML).add(k.labelGroup) : null) w.styledMode || x.css(A(h.style)), x.textPxLength = x.getBBox().width;
                    r.rotation = 0
                }
            }, getLabelSize: function () {
                return this.label ? this.label.getBBox()[this.axis.horiz ? "height" : "width"] : 0
            }, handleOverflow: function (c) {
                var k = this.axis, q = k.options.labels, w = c.x, b = k.chart.chartWidth, a = k.chart.spacing,
                    e = u(k.labelLeft, Math.min(k.pos, a[3]));
                a = u(k.labelRight, Math.max(k.isRadial ?
                    0 : k.pos + k.len, b - a[1]));
                var h = this.label, d = this.rotation,
                    f = {left: 0, center: .5, right: 1}[k.labelAlign || h.attr("align")], n = h.getBBox().width,
                    x = k.getSlotWidth(this), v = x, m = 1, l, t = {};
                if (d || "justify" !== u(q.overflow, "justify")) 0 > d && w - f * n < e ? l = Math.round(w / Math.cos(d * z) - e) : 0 < d && w + f * n > a && (l = Math.round((b - w) / Math.cos(d * z))); else if (b = w + (1 - f) * n, w - f * n < e ? v = c.x + v * (1 - f) - e : b > a && (v = a - c.x + v * f, m = -1), v = Math.min(x, v), v < x && "center" === k.labelAlign && (c.x += m * (x - v - f * (x - Math.min(n, v)))), n > v || k.autoRotation && (h.styles || {}).width) l =
                    v;
                l && (this.shortenLabel ? this.shortenLabel() : (t.width = Math.floor(l), (q.style || {}).textOverflow || (t.textOverflow = "ellipsis"), h.css(t)))
            }, getPosition: function (r, k, q, w) {
                var b = this.axis, a = b.chart, e = w && a.oldChartHeight || a.chartHeight;
                r = {
                    x: r ? c.correctFloat(b.translate(k + q, null, null, w) + b.transB) : b.left + b.offset + (b.opposite ? (w && a.oldChartWidth || a.chartWidth) - b.right - b.left : 0),
                    y: r ? e - b.bottom + b.offset - (b.opposite ? b.height : 0) : c.correctFloat(e - b.translate(k + q, null, null, w) - b.transB)
                };
                r.y = Math.max(Math.min(r.y,
                    1E5), -1E5);
                C(this, "afterGetPosition", {pos: r});
                return r
            }, getLabelPosition: function (c, k, q, w, b, a, e, h) {
                var d = this.axis, f = d.transA,
                    n = d.isLinked && d.linkedParent ? d.linkedParent.reversed : d.reversed, x = d.staggerLines,
                    v = d.tickRotCorr || {x: 0, y: 0}, m = b.y,
                    l = w || d.reserveSpaceDefault ? 0 : -d.labelOffset * ("center" === d.labelAlign ? .5 : 1), t = {};
                y(m) || (m = 0 === d.side ? q.rotation ? -8 : -q.getBBox().height : 2 === d.side ? v.y + 8 : Math.cos(q.rotation * z) * (v.y - q.getBBox(!1, 0).height / 2));
                c = c + b.x + l + v.x - (a && w ? a * f * (n ? -1 : 1) : 0);
                k = k + m - (a && !w ? a * f * (n ?
                    1 : -1) : 0);
                x && (q = e / (h || 1) % x, d.opposite && (q = x - q - 1), k += d.labelOffset / x * q);
                t.x = c;
                t.y = Math.round(k);
                C(this, "afterGetLabelPosition", {pos: t, tickmarkOffset: a, index: e});
                return t
            }, getMarkPath: function (c, k, q, w, b, a) {
                return a.crispLine(["M", c, k, "L", c + (b ? 0 : -q), k + (b ? q : 0)], w)
            }, renderGridLine: function (c, k, q) {
                var w = this.axis, b = w.options, a = this.gridLine, e = {}, h = this.pos, d = this.type,
                    f = u(this.tickmarkOffset, w.tickmarkOffset), n = w.chart.renderer, x = d ? d + "Grid" : "grid",
                    v = b[x + "LineWidth"], m = b[x + "LineColor"];
                b = b[x + "LineDashStyle"];
                a || (w.chart.styledMode || (e.stroke = m, e["stroke-width"] = v, b && (e.dashstyle = b)), d || (e.zIndex = 1), c && (k = 0), this.gridLine = a = n.path().attr(e).addClass("highcharts-" + (d ? d + "-" : "") + "grid-line").add(w.gridGroup));
                if (a && (q = w.getPlotLinePath({
                    value: h + f,
                    lineWidth: a.strokeWidth() * q,
                    force: "pass",
                    old: c
                }))) a[c || this.isNew ? "attr" : "animate"]({d: q, opacity: k})
            }, renderMark: function (c, k, q) {
                var w = this.axis, b = w.options, a = w.chart.renderer, e = this.type, h = e ? e + "Tick" : "tick",
                    d = w.tickSize(h), f = this.mark, n = !f, x = c.x;
                c = c.y;
                var v = u(b[h +
                "Width"], !e && w.isXAxis ? 1 : 0);
                b = b[h + "Color"];
                d && (w.opposite && (d[0] = -d[0]), n && (this.mark = f = a.path().addClass("highcharts-" + (e ? e + "-" : "") + "tick").add(w.axisGroup), w.chart.styledMode || f.attr({
                    stroke: b,
                    "stroke-width": v
                })), f[n ? "attr" : "animate"]({
                    d: this.getMarkPath(x, c, d[0], f.strokeWidth() * q, w.horiz, a),
                    opacity: k
                }))
            }, renderLabel: function (c, k, q, w) {
                var b = this.axis, a = b.horiz, e = b.options, h = this.label, d = e.labels, f = d.step;
                b = u(this.tickmarkOffset, b.tickmarkOffset);
                var n = !0, x = c.x;
                c = c.y;
                h && E(x) && (h.xy = c = this.getLabelPosition(x,
                    c, h, a, d, b, w, f), this.isFirst && !this.isLast && !u(e.showFirstLabel, 1) || this.isLast && !this.isFirst && !u(e.showLastLabel, 1) ? n = !1 : !a || d.step || d.rotation || k || 0 === q || this.handleOverflow(c), f && w % f && (n = !1), n && E(c.y) ? (c.opacity = q, h[this.isNewLabel ? "attr" : "animate"](c), this.isNewLabel = !1) : (h.attr("y", -9999), this.isNewLabel = !0))
            }, render: function (r, k, q) {
                var w = this.axis, b = w.horiz, a = this.pos, e = u(this.tickmarkOffset, w.tickmarkOffset);
                a = this.getPosition(b, a, e, k);
                e = a.x;
                var h = a.y;
                w = b && e === w.pos + w.len || !b && h === w.pos ? -1 :
                    1;
                q = u(q, 1);
                this.isActive = !0;
                this.renderGridLine(k, q, w);
                this.renderMark(a, q, w);
                this.renderLabel(a, k, q, r);
                this.isNew = !1;
                c.fireEvent(this, "afterRender")
            }, destroy: function () {
                I(this, this.axis)
            }
        }
    });
    K(B, "parts/Axis.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isArray, F = g.isNumber, I = g.isString, C = g.objectEach, A = g.splat, u = c.addEvent,
            z = c.animObject, r = c.arrayMax, k = c.arrayMin, q = c.color, w = c.correctFloat, b = c.defaultOptions,
            a = c.deg2rad, e = c.destroyObjectProperties, h = c.extend,
            d = c.fireEvent, f = c.format, n = c.getMagnitude, x = c.merge, v = c.normalizeTickInterval, m = c.pick,
            l = c.removeEvent, t = c.seriesTypes, G = c.syncTimeout, D = c.Tick;
        g = function () {
            this.init.apply(this, arguments)
        };
        c.extend(g.prototype, {
            defaultOptions: {
                dateTimeLabelFormats: {
                    millisecond: {main: "%H:%M:%S.%L", range: !1},
                    second: {main: "%H:%M:%S", range: !1},
                    minute: {main: "%H:%M", range: !1},
                    hour: {main: "%H:%M", range: !1},
                    day: {main: "%e. %b"},
                    week: {main: "%b %e日"},
                    month: {main: "%b '%y"},
                    year: {main: "%Y"}
                },
                endOnTick: !1,
                labels: {
                    enabled: !0, indentation: 10,
                    x: 0, style: {color: "#666666", cursor: "default", fontSize: "11px"}
                },
                maxPadding: .01,
                minorTickLength: 2,
                minorTickPosition: "outside",
                minPadding: .01,
                showEmpty: !0,
                startOfWeek: 1,
                startOnTick: !1,
                tickLength: 10,
                tickPixelInterval: 100,
                tickmarkPlacement: "between",
                tickPosition: "outside",
                title: {align: "middle", style: {color: "#666666"}},
                type: "linear",
                minorGridLineColor: "#f2f2f2",
                minorGridLineWidth: 1,
                minorTickColor: "#999999",
                lineColor: "#ccd6eb",
                lineWidth: 1,
                gridLineColor: "#e6e6e6",
                tickColor: "#ccd6eb"
            },
            defaultYAxisOptions: {
                endOnTick: !0,
                maxPadding: .05,
                minPadding: .05,
                tickPixelInterval: 72,
                showLastLabel: !0,
                labels: {x: -8},
                startOnTick: !0,
                title: {rotation: 270, text: "Values"},
                stackLabels: {
                    allowOverlap: !1, enabled: !1, crop: !0, overflow: "justify", formatter: function () {
                        return c.numberFormat(this.total, -1)
                    }, style: {color: "#000000", fontSize: "11px", fontWeight: "bold", textOutline: "1px contrast"}
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            defaultLeftAxisOptions: {labels: {x: -15}, title: {rotation: 270}},
            defaultRightAxisOptions: {labels: {x: 15}, title: {rotation: 90}},
            defaultBottomAxisOptions: {
                labels: {
                    autoRotation: [-45],
                    x: 0
                }, margin: 15, title: {rotation: 0}
            },
            defaultTopAxisOptions: {labels: {autoRotation: [-45], x: 0}, margin: 15, title: {rotation: 0}},
            init: function (a, b) {
                var p = b.isX, f = this;
                f.chart = a;
                f.horiz = a.inverted && !f.isZAxis ? !p : p;
                f.isXAxis = p;
                f.coll = f.coll || (p ? "xAxis" : "yAxis");
                d(this, "init", {userOptions: b});
                f.opposite = b.opposite;
                f.side = b.side || (f.horiz ? f.opposite ? 0 : 2 : f.opposite ? 1 : 3);
                f.setOptions(b);
                var e = this.options, l = e.type;
                f.labelFormatter = e.labels.formatter || f.defaultLabelFormatter;
                f.userOptions = b;
                f.minPixelPadding = 0;
                f.reversed =
                    e.reversed;
                f.visible = !1 !== e.visible;
                f.zoomEnabled = !1 !== e.zoomEnabled;
                f.hasNames = "category" === l || !0 === e.categories;
                f.categories = e.categories || f.hasNames;
                f.names || (f.names = [], f.names.keys = {});
                f.plotLinesAndBandsGroups = {};
                f.isLog = "logarithmic" === l;
                f.isDatetimeAxis = "datetime" === l;
                f.positiveValuesOnly = f.isLog && !f.allowNegativeLog;
                f.isLinked = y(e.linkedTo);
                f.ticks = {};
                f.labelEdge = [];
                f.minorTicks = {};
                f.plotLinesAndBands = [];
                f.alternateBands = {};
                f.len = 0;
                f.minRange = f.userMinRange = e.minRange || e.maxZoom;
                f.range =
                    e.range;
                f.offset = e.offset || 0;
                f.stacks = {};
                f.oldStacks = {};
                f.stacksTouched = 0;
                f.max = null;
                f.min = null;
                f.crosshair = m(e.crosshair, A(a.options.tooltip.crosshairs)[p ? 0 : 1], !1);
                b = f.options.events;
                -1 === a.axes.indexOf(f) && (p ? a.axes.splice(a.xAxis.length, 0, f) : a.axes.push(f), a[f.coll].push(f));
                f.series = f.series || [];
                a.inverted && !f.isZAxis && p && void 0 === f.reversed && (f.reversed = !0);
                C(b, function (a, d) {
                    c.isFunction(a) && u(f, d, a)
                });
                f.lin2log = e.linearToLogConverter || f.lin2log;
                f.isLog && (f.val2lin = f.log2lin, f.lin2val = f.lin2log);
                d(this, "afterInit")
            },
            setOptions: function (a) {
                this.options = x(this.defaultOptions, "yAxis" === this.coll && this.defaultYAxisOptions, [this.defaultTopAxisOptions, this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], x(b[this.coll], a));
                d(this, "afterSetOptions", {userOptions: a})
            },
            defaultLabelFormatter: function () {
                var a = this.axis, d = this.value, e = a.chart.time, l = a.categories, h = this.dateTimeLabelFormat,
                    t = b.lang, m = t.numericSymbols;
                t = t.numericSymbolMagnitude || 1E3;
                var n = m &&
                    m.length, G = a.options.labels.format;
                a = a.isLog ? Math.abs(d) : a.tickInterval;
                if (G) var D = f(G, this, e); else if (l) D = d; else if (h) D = e.dateFormat(h, d); else if (n && 1E3 <= a) for (; n-- && void 0 === D;) e = Math.pow(t, n + 1), a >= e && 0 === 10 * d % e && null !== m[n] && 0 !== d && (D = c.numberFormat(d / e, -1) + m[n]);
                void 0 === D && (D = 1E4 <= Math.abs(d) ? c.numberFormat(d, -1) : c.numberFormat(d, -1, void 0, ""));
                return D
            },
            getSeriesExtremes: function () {
                var a = this, f = a.chart, b;
                d(this, "getSeriesExtremes", null, function () {
                    a.hasVisibleSeries = !1;
                    a.dataMin = a.dataMax = a.threshold =
                        null;
                    a.softThreshold = !a.isXAxis;
                    a.buildStacks && a.buildStacks();
                    a.series.forEach(function (d) {
                        if (d.visible || !f.options.chart.ignoreHiddenSeries) {
                            var p = d.options, e = p.threshold;
                            a.hasVisibleSeries = !0;
                            a.positiveValuesOnly && 0 >= e && (e = null);
                            if (a.isXAxis) {
                                if (p = d.xData, p.length) {
                                    b = d.getXExtremes(p);
                                    var l = b.min;
                                    var h = b.max;
                                    F(l) || l instanceof Date || (p = p.filter(F), b = d.getXExtremes(p), l = b.min, h = b.max);
                                    p.length && (a.dataMin = Math.min(m(a.dataMin, l), l), a.dataMax = Math.max(m(a.dataMax, h), h))
                                }
                            } else if (d.getExtremes(),
                                h = d.dataMax, l = d.dataMin, y(l) && y(h) && (a.dataMin = Math.min(m(a.dataMin, l), l), a.dataMax = Math.max(m(a.dataMax, h), h)), y(e) && (a.threshold = e), !p.softThreshold || a.positiveValuesOnly) a.softThreshold = !1
                        }
                    })
                });
                d(this, "afterGetSeriesExtremes")
            },
            translate: function (a, d, f, b, e, l) {
                var p = this.linkedParent || this, h = 1, H = 0, c = b ? p.oldTransA : p.transA;
                b = b ? p.oldMin : p.min;
                var t = p.minPixelPadding;
                e = (p.isOrdinal || p.isBroken || p.isLog && e) && p.lin2val;
                c || (c = p.transA);
                f && (h *= -1, H = p.len);
                p.reversed && (h *= -1, H -= h * (p.sector || p.len));
                d ? (a =
                    (a * h + H - t) / c + b, e && (a = p.lin2val(a))) : (e && (a = p.val2lin(a)), a = F(b) ? h * (a - b) * c + H + h * t + (F(l) ? c * l : 0) : void 0);
                return a
            },
            toPixels: function (a, d) {
                return this.translate(a, !1, !this.horiz, null, !0) + (d ? 0 : this.pos)
            },
            toValue: function (a, d) {
                return this.translate(a - (d ? 0 : this.pos), !0, !this.horiz, null, !0)
            },
            getPlotLinePath: function (a) {
                var b = this, f = b.chart, p = b.left, e = b.top, l = a.old, h = a.value, c = a.translatedValue,
                    t = a.lineWidth, n = a.force, G, D, v, x, k = l && f.oldChartHeight || f.chartHeight,
                    w = l && f.oldChartWidth || f.chartWidth, q, r = b.transB,
                    u = function (a, d, b) {
                        if ("pass" !== n && a < d || a > b) n ? a = Math.min(Math.max(d, a), b) : q = !0;
                        return a
                    };
                a = {value: h, lineWidth: t, old: l, force: n, acrossPanes: a.acrossPanes, translatedValue: c};
                d(this, "getPlotLinePath", a, function (a) {
                    c = m(c, b.translate(h, null, null, l));
                    c = Math.min(Math.max(-1E5, c), 1E5);
                    G = v = Math.round(c + r);
                    D = x = Math.round(k - c - r);
                    F(c) ? b.horiz ? (D = e, x = k - b.bottom, G = v = u(G, p, p + b.width)) : (G = p, v = w - b.right, D = x = u(D, e, e + b.height)) : (q = !0, n = !1);
                    a.path = q && !n ? null : f.renderer.crispLine(["M", G, D, "L", v, x], t || 1)
                });
                return a.path
            },
            getLinearTickPositions: function (a, d, b) {
                var f = w(Math.floor(d / a) * a);
                b = w(Math.ceil(b / a) * a);
                var p = [], e;
                w(f + a) === f && (e = 20);
                if (this.single) return [d];
                for (d = f; d <= b;) {
                    p.push(d);
                    d = w(d + a, e);
                    if (d === l) break;
                    var l = d
                }
                return p
            },
            getMinorTickInterval: function () {
                var a = this.options;
                return !0 === a.minorTicks ? m(a.minorTickInterval, "auto") : !1 === a.minorTicks ? null : a.minorTickInterval
            },
            getMinorTickPositions: function () {
                var a = this, d = a.options, b = a.tickPositions, f = a.minorTickInterval, e = [],
                    l = a.pointRangePadding || 0, h = a.min - l;
                l = a.max +
                    l;
                var c = l - h;
                if (c && c / f < a.len / 3) if (a.isLog) this.paddedTicks.forEach(function (d, b, p) {
                    b && e.push.apply(e, a.getLogTickPositions(f, p[b - 1], p[b], !0))
                }); else if (a.isDatetimeAxis && "auto" === this.getMinorTickInterval()) e = e.concat(a.getTimeTicks(a.normalizeTimeTickInterval(f), h, l, d.startOfWeek)); else for (d = h + (b[0] - h) % f; d <= l && d !== e[0]; d += f) e.push(d);
                0 !== e.length && a.trimTicks(e);
                return e
            },
            adjustForMinRange: function () {
                var a = this.options, d = this.min, b = this.max, f, e, l, h, c;
                this.isXAxis && void 0 === this.minRange && !this.isLog &&
                (y(a.min) || y(a.max) ? this.minRange = null : (this.series.forEach(function (a) {
                    h = a.xData;
                    for (e = c = a.xIncrement ? 1 : h.length - 1; 0 < e; e--) if (l = h[e] - h[e - 1], void 0 === f || l < f) f = l
                }), this.minRange = Math.min(5 * f, this.dataMax - this.dataMin)));
                if (b - d < this.minRange) {
                    var t = this.dataMax - this.dataMin >= this.minRange;
                    var n = this.minRange;
                    var G = (n - b + d) / 2;
                    G = [d - G, m(a.min, d - G)];
                    t && (G[2] = this.isLog ? this.log2lin(this.dataMin) : this.dataMin);
                    d = r(G);
                    b = [d + n, m(a.max, d + n)];
                    t && (b[2] = this.isLog ? this.log2lin(this.dataMax) : this.dataMax);
                    b = k(b);
                    b - d < n && (G[0] = b - n, G[1] = m(a.min, b - n), d = r(G))
                }
                this.min = d;
                this.max = b
            },
            getClosest: function () {
                var a;
                this.categories ? a = 1 : this.series.forEach(function (d) {
                    var b = d.closestPointRange, f = d.visible || !d.chart.options.chart.ignoreHiddenSeries;
                    !d.noSharedTooltip && y(b) && f && (a = y(a) ? Math.min(a, b) : b)
                });
                return a
            },
            nameToX: function (a) {
                var d = E(this.categories), b = d ? this.categories : this.names, f = a.options.x;
                a.series.requireSorting = !1;
                y(f) || (f = !1 === this.options.uniqueNames ? a.series.autoIncrement() : d ? b.indexOf(a.name) : m(b.keys[a.name],
                    -1));
                if (-1 === f) {
                    if (!d) var p = b.length
                } else p = f;
                void 0 !== p && (this.names[p] = a.name, this.names.keys[a.name] = p);
                return p
            },
            updateNames: function () {
                var a = this, d = this.names;
                0 < d.length && (Object.keys(d.keys).forEach(function (a) {
                    delete d.keys[a]
                }), d.length = 0, this.minRange = this.userMinRange, (this.series || []).forEach(function (d) {
                    d.xIncrement = null;
                    if (!d.points || d.isDirtyData) a.max = Math.max(a.max, d.xData.length - 1), d.processData(), d.generatePoints();
                    d.data.forEach(function (b, f) {
                        if (b && b.options && void 0 !== b.name) {
                            var p =
                                a.nameToX(b);
                            void 0 !== p && p !== b.x && (b.x = p, d.xData[f] = p)
                        }
                    })
                }))
            },
            setAxisTranslation: function (a) {
                var b = this, f = b.max - b.min, p = b.axisPointRange || 0, e = 0, l = 0, h = b.linkedParent,
                    c = !!b.categories, n = b.transA, G = b.isXAxis;
                if (G || c || p) {
                    var D = b.getClosest();
                    h ? (e = h.minPointOffset, l = h.pointRangePadding) : b.series.forEach(function (a) {
                        var d = c ? 1 : G ? m(a.options.pointRange, D, 0) : b.axisPointRange || 0,
                            f = a.options.pointPlacement;
                        p = Math.max(p, d);
                        if (!b.single || c) a = t.xrange && a instanceof t.xrange ? !G : G, e = Math.max(e, a && I(f) ? 0 : d / 2), l = Math.max(l,
                            a && "on" === f ? 0 : d)
                    });
                    h = b.ordinalSlope && D ? b.ordinalSlope / D : 1;
                    b.minPointOffset = e *= h;
                    b.pointRangePadding = l *= h;
                    b.pointRange = Math.min(p, f);
                    G && (b.closestPointRange = D)
                }
                a && (b.oldTransA = n);
                b.translationSlope = b.transA = n = b.staticScale || b.len / (f + l || 1);
                b.transB = b.horiz ? b.left : b.bottom;
                b.minPixelPadding = n * e;
                d(this, "afterSetAxisTranslation")
            },
            minFromRange: function () {
                return this.max - this.range
            },
            setTickInterval: function (a) {
                var b = this, f = b.chart, p = b.options, e = b.isLog, l = b.isDatetimeAxis, h = b.isXAxis,
                    t = b.isLinked, G = p.maxPadding,
                    D = p.minPadding, x = p.tickInterval, k = p.tickPixelInterval, q = b.categories,
                    r = F(b.threshold) ? b.threshold : null, u = b.softThreshold;
                l || q || t || this.getTickAmount();
                var g = m(b.userMin, p.min);
                var z = m(b.userMax, p.max);
                if (t) {
                    b.linkedParent = f[b.coll][p.linkedTo];
                    var C = b.linkedParent.getExtremes();
                    b.min = m(C.min, C.dataMin);
                    b.max = m(C.max, C.dataMax);
                    p.type !== b.linkedParent.options.type && c.error(11, 1, f)
                } else {
                    if (!u && y(r)) if (b.dataMin >= r) C = r, D = 0; else if (b.dataMax <= r) {
                        var A = r;
                        G = 0
                    }
                    b.min = m(g, C, b.dataMin);
                    b.max = m(z, A, b.dataMax)
                }
                e &&
                (b.positiveValuesOnly && !a && 0 >= Math.min(b.min, m(b.dataMin, b.min)) && c.error(10, 1, f), b.min = w(b.log2lin(b.min), 15), b.max = w(b.log2lin(b.max), 15));
                b.range && y(b.max) && (b.userMin = b.min = g = Math.max(b.dataMin, b.minFromRange()), b.userMax = z = b.max, b.range = null);
                d(b, "foundExtremes");
                b.beforePadding && b.beforePadding();
                b.adjustForMinRange();
                !(q || b.axisPointRange || b.usePercentage || t) && y(b.min) && y(b.max) && (f = b.max - b.min) && (!y(g) && D && (b.min -= f * D), !y(z) && G && (b.max += f * G));
                F(p.softMin) && !F(b.userMin) && p.softMin < b.min &&
                (b.min = g = p.softMin);
                F(p.softMax) && !F(b.userMax) && p.softMax > b.max && (b.max = z = p.softMax);
                F(p.floor) && (b.min = Math.min(Math.max(b.min, p.floor), Number.MAX_VALUE));
                F(p.ceiling) && (b.max = Math.max(Math.min(b.max, p.ceiling), m(b.userMax, -Number.MAX_VALUE)));
                u && y(b.dataMin) && (r = r || 0, !y(g) && b.min < r && b.dataMin >= r ? b.min = b.options.minRange ? Math.min(r, b.max - b.minRange) : r : !y(z) && b.max > r && b.dataMax <= r && (b.max = b.options.minRange ? Math.max(r, b.min + b.minRange) : r));
                b.tickInterval = b.min === b.max || void 0 === b.min || void 0 === b.max ?
                    1 : t && !x && k === b.linkedParent.options.tickPixelInterval ? x = b.linkedParent.tickInterval : m(x, this.tickAmount ? (b.max - b.min) / Math.max(this.tickAmount - 1, 1) : void 0, q ? 1 : (b.max - b.min) * k / Math.max(b.len, k));
                h && !a && b.series.forEach(function (a) {
                    a.processData(b.min !== b.oldMin || b.max !== b.oldMax)
                });
                b.setAxisTranslation(!0);
                b.beforeSetTickPositions && b.beforeSetTickPositions();
                b.postProcessTickInterval && (b.tickInterval = b.postProcessTickInterval(b.tickInterval));
                b.pointRange && !x && (b.tickInterval = Math.max(b.pointRange,
                    b.tickInterval));
                a = m(p.minTickInterval, b.isDatetimeAxis && b.closestPointRange);
                !x && b.tickInterval < a && (b.tickInterval = a);
                l || e || x || (b.tickInterval = v(b.tickInterval, null, n(b.tickInterval), m(p.allowDecimals, !(.5 < b.tickInterval && 5 > b.tickInterval && 1E3 < b.max && 9999 > b.max)), !!this.tickAmount));
                this.tickAmount || (b.tickInterval = b.unsquish());
                this.setTickPositions()
            },
            setTickPositions: function () {
                var a = this.options, b = a.tickPositions;
                var f = this.getMinorTickInterval();
                var e = a.tickPositioner, l = a.startOnTick, h = a.endOnTick;
                this.tickmarkOffset = this.categories && "between" === a.tickmarkPlacement && 1 === this.tickInterval ? .5 : 0;
                this.minorTickInterval = "auto" === f && this.tickInterval ? this.tickInterval / 5 : f;
                this.single = this.min === this.max && y(this.min) && !this.tickAmount && (parseInt(this.min, 10) === this.min || !1 !== a.allowDecimals);
                this.tickPositions = f = b && b.slice();
                !f && (!this.ordinalPositions && (this.max - this.min) / this.tickInterval > Math.max(2 * this.len, 200) ? (f = [this.min, this.max], c.error(19, !1, this.chart)) : f = this.isDatetimeAxis ? this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,
                    a.units), this.min, this.max, a.startOfWeek, this.ordinalPositions, this.closestPointRange, !0) : this.isLog ? this.getLogTickPositions(this.tickInterval, this.min, this.max) : this.getLinearTickPositions(this.tickInterval, this.min, this.max), f.length > this.len && (f = [f[0], f.pop()], f[0] === f[1] && (f.length = 1)), this.tickPositions = f, e && (e = e.apply(this, [this.min, this.max]))) && (this.tickPositions = f = e);
                this.paddedTicks = f.slice(0);
                this.trimTicks(f, l, h);
                this.isLinked || (this.single && 2 > f.length && !this.categories && (this.min -=
                    .5, this.max += .5), b || e || this.adjustTickAmount());
                d(this, "afterSetTickPositions")
            },
            trimTicks: function (a, b, f) {
                var p = a[0], e = a[a.length - 1], l = this.minPointOffset || 0;
                d(this, "trimTicks");
                if (!this.isLinked) {
                    if (b && -Infinity !== p) this.min = p; else for (; this.min - l > a[0];) a.shift();
                    if (f) this.max = e; else for (; this.max + l < a[a.length - 1];) a.pop();
                    0 === a.length && y(p) && !this.options.tickPositions && a.push((e + p) / 2)
                }
            },
            alignToOthers: function () {
                var a = {}, d, b = this.options;
                !1 === this.chart.options.chart.alignTicks || !1 === b.alignTicks ||
                !1 === b.startOnTick || !1 === b.endOnTick || this.isLog || this.chart[this.coll].forEach(function (b) {
                    var f = b.options;
                    f = [b.horiz ? f.left : f.top, f.width, f.height, f.pane].join();
                    b.series.length && (a[f] ? d = !0 : a[f] = 1)
                });
                return d
            },
            getTickAmount: function () {
                var a = this.options, d = a.tickAmount, b = a.tickPixelInterval;
                !y(a.tickInterval) && this.len < b && !this.isRadial && !this.isLog && a.startOnTick && a.endOnTick && (d = 2);
                !d && this.alignToOthers() && (d = Math.ceil(this.len / b) + 1);
                4 > d && (this.finalTickAmt = d, d = 5);
                this.tickAmount = d
            },
            adjustTickAmount: function () {
                var a =
                        this.options, d = this.tickInterval, b = this.tickPositions, f = this.tickAmount,
                    e = this.finalTickAmt, l = b && b.length, h = m(this.threshold, this.softThreshold ? 0 : null), c;
                if (this.hasData()) {
                    if (l < f) {
                        for (c = this.min; b.length < f;) b.length % 2 || c === h ? b.push(w(b[b.length - 1] + d)) : b.unshift(w(b[0] - d));
                        this.transA *= (l - 1) / (f - 1);
                        this.min = a.startOnTick ? b[0] : Math.min(this.min, b[0]);
                        this.max = a.endOnTick ? b[b.length - 1] : Math.max(this.max, b[b.length - 1])
                    } else l > f && (this.tickInterval *= 2, this.setTickPositions());
                    if (y(e)) {
                        for (d = a = b.length; d--;) (3 ===
                            e && 1 === d % 2 || 2 >= e && 0 < d && d < a - 1) && b.splice(d, 1);
                        this.finalTickAmt = void 0
                    }
                }
            },
            setScale: function () {
                var a = this.series.some(function (a) {
                    return a.isDirtyData || a.isDirty || a.xAxis && a.xAxis.isDirty
                }), b;
                this.oldMin = this.min;
                this.oldMax = this.max;
                this.oldAxisLength = this.len;
                this.setAxisSize();
                (b = this.len !== this.oldAxisLength) || a || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax || this.alignToOthers() ? (this.resetStacks && this.resetStacks(), this.forceRedraw = !1, this.getSeriesExtremes(),
                    this.setTickInterval(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, this.isDirty || (this.isDirty = b || this.min !== this.oldMin || this.max !== this.oldMax)) : this.cleanStacks && this.cleanStacks();
                d(this, "afterSetScale")
            },
            setExtremes: function (a, b, f, e, l) {
                var p = this, c = p.chart;
                f = m(f, !0);
                p.series.forEach(function (a) {
                    delete a.kdTree
                });
                l = h(l, {min: a, max: b});
                d(p, "setExtremes", l, function () {
                    p.userMin = a;
                    p.userMax = b;
                    p.eventArgs = l;
                    f && c.redraw(e)
                })
            },
            zoom: function (a, b) {
                var f = this.dataMin, e = this.dataMax, p = this.options,
                    l = Math.min(f, m(p.min, f)), h = Math.max(e, m(p.max, e));
                a = {newMin: a, newMax: b};
                d(this, "zoom", a, function (a) {
                    var d = a.newMin, b = a.newMax;
                    if (d !== this.min || b !== this.max) this.allowZoomOutside || (y(f) && (d < l && (d = l), d > h && (d = h)), y(e) && (b < l && (b = l), b > h && (b = h))), this.displayBtn = void 0 !== d || void 0 !== b, this.setExtremes(d, b, !1, void 0, {trigger: "zoom"});
                    a.zoomed = !0
                });
                return a.zoomed
            },
            setAxisSize: function () {
                var a = this.chart, d = this.options, b = d.offsets || [0, 0, 0, 0], f = this.horiz,
                    e = this.width = Math.round(c.relativeLength(m(d.width,
                        a.plotWidth - b[3] + b[1]), a.plotWidth)),
                    l = this.height = Math.round(c.relativeLength(m(d.height, a.plotHeight - b[0] + b[2]), a.plotHeight)),
                    h = this.top = Math.round(c.relativeLength(m(d.top, a.plotTop + b[0]), a.plotHeight, a.plotTop));
                d = this.left = Math.round(c.relativeLength(m(d.left, a.plotLeft + b[3]), a.plotWidth, a.plotLeft));
                this.bottom = a.chartHeight - l - h;
                this.right = a.chartWidth - e - d;
                this.len = Math.max(f ? e : l, 0);
                this.pos = f ? d : h
            },
            getExtremes: function () {
                var a = this.isLog;
                return {
                    min: a ? w(this.lin2log(this.min)) : this.min,
                    max: a ?
                        w(this.lin2log(this.max)) : this.max,
                    dataMin: this.dataMin,
                    dataMax: this.dataMax,
                    userMin: this.userMin,
                    userMax: this.userMax
                }
            },
            getThreshold: function (a) {
                var d = this.isLog, b = d ? this.lin2log(this.min) : this.min;
                d = d ? this.lin2log(this.max) : this.max;
                null === a || -Infinity === a ? a = b : Infinity === a ? a = d : b > a ? a = b : d < a && (a = d);
                return this.translate(a, 0, 1, 0, 1)
            },
            autoLabelAlign: function (a) {
                var b = (m(a, 0) - 90 * this.side + 720) % 360;
                a = {align: "center"};
                d(this, "autoLabelAlign", a, function (a) {
                    15 < b && 165 > b ? a.align = "right" : 195 < b && 345 > b && (a.align =
                        "left")
                });
                return a.align
            },
            tickSize: function (a) {
                var b = this.options, f = b[a + "Length"],
                    e = m(b[a + "Width"], "tick" === a && this.isXAxis && !this.categories ? 1 : 0);
                if (e && f) {
                    "inside" === b[a + "Position"] && (f = -f);
                    var l = [f, e]
                }
                a = {tickSize: l};
                d(this, "afterTickSize", a);
                return a.tickSize
            },
            labelMetrics: function () {
                var a = this.tickPositions && this.tickPositions[0] || 0;
                return this.chart.renderer.fontMetrics(this.options.labels.style && this.options.labels.style.fontSize, this.ticks[a] && this.ticks[a].label)
            },
            unsquish: function () {
                var d =
                        this.options.labels, b = this.horiz, f = this.tickInterval, e = f,
                    l = this.len / (((this.categories ? 1 : 0) + this.max - this.min) / f), h, c = d.rotation,
                    t = this.labelMetrics(), n, G = Number.MAX_VALUE, D, v = this.max - this.min, x = function (a) {
                        var d = a / (l || 1);
                        d = 1 < d ? Math.ceil(d) : 1;
                        d * f > v && Infinity !== a && Infinity !== l && v && (d = Math.ceil(v / f));
                        return w(d * f)
                    };
                b ? (D = !d.staggerLines && !d.step && (y(c) ? [c] : l < m(d.autoRotationLimit, 80) && d.autoRotation)) && D.forEach(function (d) {
                    if (d === c || d && -90 <= d && 90 >= d) {
                        n = x(Math.abs(t.h / Math.sin(a * d)));
                        var b = n + Math.abs(d /
                            360);
                        b < G && (G = b, h = d, e = n)
                    }
                }) : d.step || (e = x(t.h));
                this.autoRotation = D;
                this.labelRotation = m(h, c);
                return e
            },
            getSlotWidth: function (a) {
                var d = this.chart, b = this.horiz, f = this.options.labels,
                    e = Math.max(this.tickPositions.length - (this.categories ? 0 : 1), 1), l = d.margin[3];
                return a && a.slotWidth || b && 2 > (f.step || 0) && !f.rotation && (this.staggerLines || 1) * this.len / e || !b && (f.style && parseInt(f.style.width, 10) || l && l - d.spacing[3] || .33 * d.chartWidth)
            },
            renderUnsquish: function () {
                var a = this.chart, d = a.renderer, b = this.tickPositions,
                    f = this.ticks, e = this.options.labels, l = e && e.style || {}, h = this.horiz,
                    c = this.getSlotWidth(), t = Math.max(1, Math.round(c - 2 * (e.padding || 5))), m = {},
                    n = this.labelMetrics(), G = e.style && e.style.textOverflow, D = 0;
                I(e.rotation) || (m.rotation = e.rotation || 0);
                b.forEach(function (a) {
                    (a = f[a]) && a.label && a.label.textPxLength > D && (D = a.label.textPxLength)
                });
                this.maxLabelLength = D;
                if (this.autoRotation) D > t && D > n.h ? m.rotation = this.labelRotation : this.labelRotation = 0; else if (c) {
                    var v = t;
                    if (!G) {
                        var x = "clip";
                        for (t = b.length; !h && t--;) {
                            var k =
                                b[t];
                            if (k = f[k].label) k.styles && "ellipsis" === k.styles.textOverflow ? k.css({textOverflow: "clip"}) : k.textPxLength > c && k.css({width: c + "px"}), k.getBBox().height > this.len / b.length - (n.h - n.f) && (k.specificTextOverflow = "ellipsis")
                        }
                    }
                }
                m.rotation && (v = D > .5 * a.chartHeight ? .33 * a.chartHeight : D, G || (x = "ellipsis"));
                if (this.labelAlign = e.align || this.autoLabelAlign(this.labelRotation)) m.align = this.labelAlign;
                b.forEach(function (a) {
                    var d = (a = f[a]) && a.label, b = l.width, e = {};
                    d && (d.attr(m), a.shortenLabel ? a.shortenLabel() : v && !b && "nowrap" !==
                    l.whiteSpace && (v < d.textPxLength || "SPAN" === d.element.tagName) ? (e.width = v, G || (e.textOverflow = d.specificTextOverflow || x), d.css(e)) : d.styles && d.styles.width && !e.width && !b && d.css({width: null}), delete d.specificTextOverflow, a.rotation = m.rotation)
                }, this);
                this.tickRotCorr = d.rotCorr(n.b, this.labelRotation || 0, 0 !== this.side)
            },
            hasData: function () {
                return this.series.some(function (a) {
                    return a.hasData()
                }) || this.options.showEmpty && y(this.min) && y(this.max)
            },
            addTitle: function (a) {
                var d = this.chart.renderer, b = this.horiz,
                    f = this.opposite, e = this.options.title, l, p = this.chart.styledMode;
                this.axisTitle || ((l = e.textAlign) || (l = (b ? {
                    low: "left",
                    middle: "center",
                    high: "right"
                } : {
                    low: f ? "right" : "left",
                    middle: "center",
                    high: f ? "left" : "right"
                })[e.align]), this.axisTitle = d.text(e.text, 0, 0, e.useHTML).attr({
                    zIndex: 7,
                    rotation: e.rotation || 0,
                    align: l
                }).addClass("highcharts-axis-title"), p || this.axisTitle.css(x(e.style)), this.axisTitle.add(this.axisGroup), this.axisTitle.isNew = !0);
                p || e.style.width || this.isRadial || this.axisTitle.css({width: this.len});
                this.axisTitle[a ? "show" : "hide"](a)
            },
            generateTick: function (a) {
                var d = this.ticks;
                d[a] ? d[a].addLabel() : d[a] = new D(this, a)
            },
            getOffset: function () {
                var a = this, b = a.chart, f = b.renderer, e = a.options, l = a.tickPositions, h = a.ticks, c = a.horiz,
                    t = a.side, n = b.inverted && !a.isZAxis ? [1, 0, 3, 2][t] : t, G, D = 0, v = 0, x = e.title,
                    k = e.labels, w = 0, q = b.axisOffset;
                b = b.clipOffset;
                var r = [-1, 1, 1, -1][t], u = e.className, g = a.axisParent;
                var z = a.hasData();
                a.showAxis = G = z || m(e.showEmpty, !0);
                a.staggerLines = a.horiz && k.staggerLines;
                a.axisGroup || (a.gridGroup =
                    f.g("grid").attr({zIndex: e.gridZIndex || 1}).addClass("highcharts-" + this.coll.toLowerCase() + "-grid " + (u || "")).add(g), a.axisGroup = f.g("axis").attr({zIndex: e.zIndex || 2}).addClass("highcharts-" + this.coll.toLowerCase() + " " + (u || "")).add(g), a.labelGroup = f.g("axis-labels").attr({zIndex: k.zIndex || 7}).addClass("highcharts-" + a.coll.toLowerCase() + "-labels " + (u || "")).add(g));
                z || a.isLinked ? (l.forEach(function (d, b) {
                    a.generateTick(d, b)
                }), a.renderUnsquish(), a.reserveSpaceDefault = 0 === t || 2 === t || {1: "left", 3: "right"}[t] ===
                    a.labelAlign, m(k.reserveSpace, "center" === a.labelAlign ? !0 : null, a.reserveSpaceDefault) && l.forEach(function (a) {
                    w = Math.max(h[a].getLabelSize(), w)
                }), a.staggerLines && (w *= a.staggerLines), a.labelOffset = w * (a.opposite ? -1 : 1)) : C(h, function (a, d) {
                    a.destroy();
                    delete h[d]
                });
                if (x && x.text && !1 !== x.enabled && (a.addTitle(G), G && !1 !== x.reserveSpace)) {
                    a.titleOffset = D = a.axisTitle.getBBox()[c ? "height" : "width"];
                    var A = x.offset;
                    v = y(A) ? 0 : m(x.margin, c ? 5 : 10)
                }
                a.renderLine();
                a.offset = r * m(e.offset, q[t] ? q[t] + (e.margin || 0) : 0);
                a.tickRotCorr =
                    a.tickRotCorr || {x: 0, y: 0};
                f = 0 === t ? -a.labelMetrics().h : 2 === t ? a.tickRotCorr.y : 0;
                v = Math.abs(w) + v;
                w && (v = v - f + r * (c ? m(k.y, a.tickRotCorr.y + 8 * r) : k.x));
                a.axisTitleMargin = m(A, v);
                a.getMaxLabelDimensions && (a.maxLabelDimensions = a.getMaxLabelDimensions(h, l));
                c = this.tickSize("tick");
                q[t] = Math.max(q[t], a.axisTitleMargin + D + r * a.offset, v, l && l.length && c ? c[0] + r * a.offset : 0);
                e = e.offset ? 0 : 2 * Math.floor(a.axisLine.strokeWidth() / 2);
                b[n] = Math.max(b[n], e);
                d(this, "afterGetOffset")
            },
            getLinePath: function (a) {
                var d = this.chart, b = this.opposite,
                    f = this.offset, e = this.horiz, l = this.left + (b ? this.width : 0) + f;
                f = d.chartHeight - this.bottom - (b ? this.height : 0) + f;
                b && (a *= -1);
                return d.renderer.crispLine(["M", e ? this.left : l, e ? f : this.top, "L", e ? d.chartWidth - this.right : l, e ? f : d.chartHeight - this.bottom], a)
            },
            renderLine: function () {
                this.axisLine || (this.axisLine = this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup), this.chart.styledMode || this.axisLine.attr({
                    stroke: this.options.lineColor,
                    "stroke-width": this.options.lineWidth,
                    zIndex: 7
                }))
            },
            getTitlePosition: function () {
                var a =
                        this.horiz, b = this.left, f = this.top, e = this.len, l = this.options.title, h = a ? b : f,
                    c = this.opposite, t = this.offset, m = l.x || 0, n = l.y || 0, G = this.axisTitle,
                    D = this.chart.renderer.fontMetrics(l.style && l.style.fontSize, G);
                G = Math.max(G.getBBox(null, 0).height - D.h - 1, 0);
                e = {low: h + (a ? 0 : e), middle: h + e / 2, high: h + (a ? e : 0)}[l.align];
                b = (a ? f + this.height : b) + (a ? 1 : -1) * (c ? -1 : 1) * this.axisTitleMargin + [-G, G, D.f, -G][this.side];
                a = {x: a ? e + m : b + (c ? this.width : 0) + t + m, y: a ? b + n - (c ? this.height : 0) + t : e + n};
                d(this, "afterGetTitlePosition", {titlePosition: a});
                return a
            },
            renderMinorTick: function (a) {
                var d = this.chart.hasRendered && F(this.oldMin), b = this.minorTicks;
                b[a] || (b[a] = new D(this, a, "minor"));
                d && b[a].isNew && b[a].render(null, !0);
                b[a].render(null, !1, 1)
            },
            renderTick: function (a, d) {
                var b = this.isLinked, f = this.ticks, e = this.chart.hasRendered && F(this.oldMin);
                if (!b || a >= this.min && a <= this.max) f[a] || (f[a] = new D(this, a)), e && f[a].isNew && f[a].render(d, !0, -1), f[a].render(d)
            },
            render: function () {
                var a = this, b = a.chart, f = a.options, e = a.isLog, l = a.isLinked, h = a.tickPositions,
                    t = a.axisTitle,
                    m = a.ticks, n = a.minorTicks, v = a.alternateBands, x = f.stackLabels, k = f.alternateGridColor,
                    w = a.tickmarkOffset, q = a.axisLine, r = a.showAxis, u = z(b.renderer.globalAnimation), g, A;
                a.labelEdge.length = 0;
                a.overlap = !1;
                [m, n, v].forEach(function (a) {
                    C(a, function (a) {
                        a.isActive = !1
                    })
                });
                if (a.hasData() || l) a.minorTickInterval && !a.categories && a.getMinorTickPositions().forEach(function (d) {
                    a.renderMinorTick(d)
                }), h.length && (h.forEach(function (d, b) {
                    a.renderTick(d, b)
                }), w && (0 === a.min || a.single) && (m[-1] || (m[-1] = new D(a, -1, null, !0)), m[-1].render(-1))),
                k && h.forEach(function (d, f) {
                    A = void 0 !== h[f + 1] ? h[f + 1] + w : a.max - w;
                    0 === f % 2 && d < a.max && A <= a.max + (b.polar ? -w : w) && (v[d] || (v[d] = new c.PlotLineOrBand(a)), g = d + w, v[d].options = {
                        from: e ? a.lin2log(g) : g,
                        to: e ? a.lin2log(A) : A,
                        color: k
                    }, v[d].render(), v[d].isActive = !0)
                }), a._addedPlotLB || ((f.plotLines || []).concat(f.plotBands || []).forEach(function (d) {
                    a.addPlotBandOrLine(d)
                }), a._addedPlotLB = !0);
                [m, n, v].forEach(function (a) {
                    var d, f = [], e = u.duration;
                    C(a, function (a, d) {
                        a.isActive || (a.render(d, !1, 0), a.isActive = !1, f.push(d))
                    });
                    G(function () {
                        for (d =
                                 f.length; d--;) a[f[d]] && !a[f[d]].isActive && (a[f[d]].destroy(), delete a[f[d]])
                    }, a !== v && b.hasRendered && e ? e : 0)
                });
                q && (q[q.isPlaced ? "animate" : "attr"]({d: this.getLinePath(q.strokeWidth())}), q.isPlaced = !0, q[r ? "show" : "hide"](r));
                t && r && (f = a.getTitlePosition(), F(f.y) ? (t[t.isNew ? "attr" : "animate"](f), t.isNew = !1) : (t.attr("y", -9999), t.isNew = !0));
                x && x.enabled && a.renderStackTotals();
                a.isDirty = !1;
                d(this, "afterRender")
            },
            redraw: function () {
                this.visible && (this.render(), this.plotLinesAndBands.forEach(function (a) {
                    a.render()
                }));
                this.series.forEach(function (a) {
                    a.isDirty = !0
                })
            },
            keepProps: "extKey hcEvents names series userMax userMin".split(" "),
            destroy: function (a) {
                var b = this, f = b.stacks, h = b.plotLinesAndBands, p;
                d(this, "destroy", {keepEvents: a});
                a || l(b);
                C(f, function (a, d) {
                    e(a);
                    f[d] = null
                });
                [b.ticks, b.minorTicks, b.alternateBands].forEach(function (a) {
                    e(a)
                });
                if (h) for (a = h.length; a--;) h[a].destroy();
                "stackTotalGroup axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function (a) {
                    b[a] && (b[a] = b[a].destroy())
                });
                for (p in b.plotLinesAndBandsGroups) b.plotLinesAndBandsGroups[p] = b.plotLinesAndBandsGroups[p].destroy();
                C(b, function (a, d) {
                    -1 === b.keepProps.indexOf(d) && delete b[d]
                })
            },
            drawCrosshair: function (a, b) {
                var f, e = this.crosshair, l = m(e.snap, !0), h, p = this.cross;
                d(this, "drawCrosshair", {e: a, point: b});
                a || (a = this.cross && this.cross.e);
                if (this.crosshair && !1 !== (y(b) || !l)) {
                    l ? y(b) && (h = m("colorAxis" !== this.coll ? b.crosshairPos : null, this.isXAxis ? b.plotX : this.len - b.plotY)) : h = a && (this.horiz ? a.chartX - this.pos : this.len - a.chartY +
                        this.pos);
                    y(h) && (f = this.getPlotLinePath({
                        value: b && (this.isXAxis ? b.x : m(b.stackY, b.y)),
                        translatedValue: h
                    }) || null);
                    if (!y(f)) {
                        this.hideCrosshair();
                        return
                    }
                    l = this.categories && !this.isRadial;
                    p || (this.cross = p = this.chart.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-" + (l ? "category " : "thin ") + e.className).attr({zIndex: m(e.zIndex, 2)}).add(), this.chart.styledMode || (p.attr({
                        stroke: e.color || (l ? q("#ccd6eb").setOpacity(.25).get() : "#cccccc"),
                        "stroke-width": m(e.width, 1)
                    }).css({"pointer-events": "none"}),
                    e.dashStyle && p.attr({dashstyle: e.dashStyle})));
                    p.show().attr({d: f});
                    l && !e.width && p.attr({"stroke-width": this.transA});
                    this.cross.e = a
                } else this.hideCrosshair();
                d(this, "afterDrawCrosshair", {e: a, point: b})
            },
            hideCrosshair: function () {
                this.cross && this.cross.hide();
                d(this, "afterHideCrosshair")
            }
        });
        return c.Axis = g
    });
    K(B, "parts/DateTimeAxis.js", [B["parts/Globals.js"]], function (c) {
        var g = c.Axis, y = c.getMagnitude, E = c.normalizeTickInterval, F = c.timeUnits;
        g.prototype.getTimeTicks = function () {
            return this.chart.time.getTimeTicks.apply(this.chart.time,
                arguments)
        };
        g.prototype.normalizeTimeTickInterval = function (c, g) {
            var C = g || [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2]], ["week", [1, 2]], ["month", [1, 2, 3, 4, 6]], ["year", null]];
            g = C[C.length - 1];
            var u = F[g[0]], z = g[1], r;
            for (r = 0; r < C.length && !(g = C[r], u = F[g[0]], z = g[1], C[r + 1] && c <= (u * z[z.length - 1] + F[C[r + 1][0]]) / 2); r++) ;
            u === F.year && c < 5 * u && (z = [1, 2, 5]);
            c = E(c / u, z, "year" === g[0] ? Math.max(y(c / u), 1) : 1);
            return {
                unitRange: u,
                count: c, unitName: g[0]
            }
        }
    });
    K(B, "parts/LogarithmicAxis.js", [B["parts/Globals.js"]], function (c) {
        var g = c.Axis, y = c.getMagnitude, E = c.normalizeTickInterval, F = c.pick;
        g.prototype.getLogTickPositions = function (c, g, A, u) {
            var z = this.options, r = this.len, k = [];
            u || (this._minorAutoInterval = null);
            if (.5 <= c) c = Math.round(c), k = this.getLinearTickPositions(c, g, A); else if (.08 <= c) {
                r = Math.floor(g);
                var q, w;
                for (z = .3 < c ? [1, 2, 4] : .15 < c ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; r < A + 1 && !w; r++) {
                    var b = z.length;
                    for (q = 0; q < b && !w; q++) {
                        var a = this.log2lin(this.lin2log(r) *
                            z[q]);
                        a > g && (!u || e <= A) && void 0 !== e && k.push(e);
                        e > A && (w = !0);
                        var e = a
                    }
                }
            } else g = this.lin2log(g), A = this.lin2log(A), c = u ? this.getMinorTickInterval() : z.tickInterval, c = F("auto" === c ? null : c, this._minorAutoInterval, z.tickPixelInterval / (u ? 5 : 1) * (A - g) / ((u ? r / this.tickPositions.length : r) || 1)), c = E(c, null, y(c)), k = this.getLinearTickPositions(c, g, A).map(this.log2lin), u || (this._minorAutoInterval = c / 5);
            u || (this.tickInterval = c);
            return k
        };
        g.prototype.log2lin = function (c) {
            return Math.log(c) / Math.LN10
        };
        g.prototype.lin2log = function (c) {
            return Math.pow(10,
                c)
        }
    });
    K(B, "parts/PlotLineOrBand.js", [B["parts/Globals.js"], B["parts/Axis.js"], B["parts/Utilities.js"]], function (c, g, y) {
        var E = y.defined, F = y.erase, I = y.objectEach, C = c.arrayMax, A = c.arrayMin, u = c.destroyObjectProperties,
            z = c.merge, r = c.pick;
        c.PlotLineOrBand = function (c, q) {
            this.axis = c;
            q && (this.options = q, this.id = q.id)
        };
        c.PlotLineOrBand.prototype = {
            render: function () {
                c.fireEvent(this, "render");
                var k = this, q = k.axis, w = q.horiz, b = k.options, a = b.label, e = k.label, h = b.to, d = b.from,
                    f = b.value, n = E(d) && E(h), x = E(f), v = k.svgElem,
                    m = !v, l = [], t = b.color, G = r(b.zIndex, 0), D = b.events;
                l = {"class": "highcharts-plot-" + (n ? "band " : "line ") + (b.className || "")};
                var p = {}, H = q.chart.renderer, J = n ? "bands" : "lines";
                q.isLog && (d = q.log2lin(d), h = q.log2lin(h), f = q.log2lin(f));
                q.chart.styledMode || (x ? (l.stroke = t || "#999999", l["stroke-width"] = r(b.width, 1), b.dashStyle && (l.dashstyle = b.dashStyle)) : n && (l.fill = t || "#e6ebf5", b.borderWidth && (l.stroke = b.borderColor, l["stroke-width"] = b.borderWidth)));
                p.zIndex = G;
                J += "-" + G;
                (t = q.plotLinesAndBandsGroups[J]) || (q.plotLinesAndBandsGroups[J] =
                    t = H.g("plot-" + J).attr(p).add());
                m && (k.svgElem = v = H.path().attr(l).add(t));
                if (x) l = q.getPlotLinePath({
                    value: f,
                    lineWidth: v.strokeWidth(),
                    acrossPanes: b.acrossPanes
                }); else if (n) l = q.getPlotBandPath(d, h, b); else return;
                (m || !v.d) && l && l.length ? (v.attr({d: l}), D && I(D, function (a, d) {
                    v.on(d, function (a) {
                        D[d].apply(k, [a])
                    })
                })) : v && (l ? (v.show(!0), v.animate({d: l})) : v.d && (v.hide(), e && (k.label = e = e.destroy())));
                a && (E(a.text) || E(a.formatter)) && l && l.length && 0 < q.width && 0 < q.height && !l.isFlat ? (a = z({
                    align: w && n && "center",
                    x: w ? !n &&
                        4 : 10,
                    verticalAlign: !w && n && "middle",
                    y: w ? n ? 16 : 10 : n ? 6 : -4,
                    rotation: w && !n && 90
                }, a), this.renderLabel(a, l, n, G)) : e && e.hide();
                return k
            }, renderLabel: function (c, q, w, b) {
                var a = this.label, e = this.axis.chart.renderer;
                a || (a = {
                    align: c.textAlign || c.align,
                    rotation: c.rotation,
                    "class": "highcharts-plot-" + (w ? "band" : "line") + "-label " + (c.className || "")
                }, a.zIndex = b, b = this.getLabelText(c), this.label = a = e.text(b, 0, 0, c.useHTML).attr(a).add(), this.axis.chart.styledMode || a.css(c.style));
                e = q.xBounds || [q[1], q[4], w ? q[6] : q[1]];
                q = q.yBounds ||
                    [q[2], q[5], w ? q[7] : q[2]];
                w = A(e);
                b = A(q);
                a.align(c, !1, {x: w, y: b, width: C(e) - w, height: C(q) - b});
                a.show(!0)
            }, getLabelText: function (c) {
                return E(c.formatter) ? c.formatter.call(this) : c.text
            }, destroy: function () {
                F(this.axis.plotLinesAndBands, this);
                delete this.axis;
                u(this)
            }
        };
        c.extend(g.prototype, {
            getPlotBandPath: function (c, q) {
                var k = this.getPlotLinePath({value: q, force: !0, acrossPanes: this.options.acrossPanes}),
                    b = this.getPlotLinePath({value: c, force: !0, acrossPanes: this.options.acrossPanes}), a = [],
                    e = this.horiz, h = 1;
                c =
                    c < this.min && q < this.min || c > this.max && q > this.max;
                if (b && k) {
                    if (c) {
                        var d = b.toString() === k.toString();
                        h = 0
                    }
                    for (c = 0; c < b.length; c += 6) e && k[c + 1] === b[c + 1] ? (k[c + 1] += h, k[c + 4] += h) : e || k[c + 2] !== b[c + 2] || (k[c + 2] += h, k[c + 5] += h), a.push("M", b[c + 1], b[c + 2], "L", b[c + 4], b[c + 5], k[c + 4], k[c + 5], k[c + 1], k[c + 2], "z"), a.isFlat = d
                }
                return a
            }, addPlotBand: function (c) {
                return this.addPlotBandOrLine(c, "plotBands")
            }, addPlotLine: function (c) {
                return this.addPlotBandOrLine(c, "plotLines")
            }, addPlotBandOrLine: function (k, q) {
                var w = (new c.PlotLineOrBand(this,
                    k)).render(), b = this.userOptions;
                if (w) {
                    if (q) {
                        var a = b[q] || [];
                        a.push(k);
                        b[q] = a
                    }
                    this.plotLinesAndBands.push(w)
                }
                return w
            }, removePlotBandOrLine: function (c) {
                for (var k = this.plotLinesAndBands, w = this.options, b = this.userOptions, a = k.length; a--;) k[a].id === c && k[a].destroy();
                [w.plotLines || [], b.plotLines || [], w.plotBands || [], b.plotBands || []].forEach(function (b) {
                    for (a = b.length; a--;) b[a].id === c && F(b, b[a])
                })
            }, removePlotBand: function (c) {
                this.removePlotBandOrLine(c)
            }, removePlotLine: function (c) {
                this.removePlotBandOrLine(c)
            }
        })
    });
    K(B, "parts/Tooltip.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, F = g.isString, I = g.splat;
        "";
        var C = c.doc, A = c.extend, u = c.format, z = c.merge, r = c.pick, k = c.syncTimeout, q = c.timeUnits;
        c.Tooltip = function () {
            this.init.apply(this, arguments)
        };
        c.Tooltip.prototype = {
            init: function (c, b) {
                this.chart = c;
                this.options = b;
                this.crosshairs = [];
                this.now = {x: 0, y: 0};
                this.isHidden = !0;
                this.split = b.split && !c.inverted;
                this.shared = b.shared || this.split;
                this.outside = r(b.outside, !(!c.scrollablePixelsX &&
                    !c.scrollablePixelsY)) && !this.split
            }, cleanSplit: function (c) {
                this.chart.series.forEach(function (b) {
                    var a = b && b.tt;
                    a && (!a.isActive || c ? b.tt = a.destroy() : a.isActive = !1)
                })
            }, applyFilter: function () {
                var c = this.chart;
                c.renderer.definition({
                    tagName: "filter",
                    id: "drop-shadow-" + c.index,
                    opacity: .5,
                    children: [{tagName: "feGaussianBlur", "in": "SourceAlpha", stdDeviation: 1}, {
                        tagName: "feOffset",
                        dx: 1,
                        dy: 1
                    }, {tagName: "feComponentTransfer", children: [{tagName: "feFuncA", type: "linear", slope: .3}]}, {
                        tagName: "feMerge", children: [{tagName: "feMergeNode"},
                            {tagName: "feMergeNode", "in": "SourceGraphic"}]
                    }]
                });
                c.renderer.definition({
                    tagName: "style",
                    textContent: ".highcharts-tooltip-" + c.index + "{filter:url(#drop-shadow-" + c.index + ")}"
                })
            }, getLabel: function () {
                var k = this, b = this.chart.renderer, a = this.chart.styledMode, e = this.options,
                    h = "tooltip" + (y(e.className) ? " " + e.className : ""), d;
                if (!this.label) {
                    this.outside && (this.container = d = c.doc.createElement("div"), d.className = "highcharts-tooltip-container", c.css(d, {
                        position: "absolute", top: "1px", pointerEvents: e.style && e.style.pointerEvents,
                        zIndex: 3
                    }), c.doc.body.appendChild(d), this.renderer = b = new c.Renderer(d, 0, 0, {}, void 0, void 0, b.styledMode));
                    this.split ? this.label = b.g(h) : (this.label = b.label("", 0, 0, e.shape || "callout", null, null, e.useHTML, null, h).attr({
                        padding: e.padding,
                        r: e.borderRadius
                    }), a || this.label.attr({
                        fill: e.backgroundColor,
                        "stroke-width": e.borderWidth
                    }).css(e.style).shadow(e.shadow));
                    a && (this.applyFilter(), this.label.addClass("highcharts-tooltip-" + this.chart.index));
                    if (this.outside) {
                        var f = {x: this.label.xSetter, y: this.label.ySetter};
                        this.label.xSetter = function (a, b) {
                            f[b].call(this.label, k.distance);
                            d.style.left = a + "px"
                        };
                        this.label.ySetter = function (a, b) {
                            f[b].call(this.label, k.distance);
                            d.style.top = a + "px"
                        }
                    }
                    this.label.attr({zIndex: 8}).add()
                }
                return this.label
            }, update: function (c) {
                this.destroy();
                z(!0, this.chart.options.tooltip.userOptions, c);
                this.init(this.chart, z(!0, this.options, c))
            }, destroy: function () {
                this.label && (this.label = this.label.destroy());
                this.split && this.tt && (this.cleanSplit(this.chart, !0), this.tt = this.tt.destroy());
                this.renderer &&
                (this.renderer = this.renderer.destroy(), c.discardElement(this.container));
                c.clearTimeout(this.hideTimer);
                c.clearTimeout(this.tooltipTimeout)
            }, move: function (k, b, a, e) {

                var h = this, d = h.now,
                    f = !1 !== h.options.animation && !h.isHidden && (1 < Math.abs(k - d.x) || 1 < Math.abs(b - d.y)),
                    n = h.followPointer || 1 < h.len;
                A(d, {
                    x: f ? (2 * d.x + k) / 3 : k,
                    y: f ? (d.y + b) / 2 : b,
                    anchorX: n ? void 0 : f ? (2 * d.anchorX + a) / 3 : a,
                    anchorY: n ? void 0 : f ? (d.anchorY + e) / 2 : e
                });
                h.getLabel().attr(d);
                f && (c.clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () {
                    h &&
                    h.move(k, b, a, e)
                }, 32))
            }, hide: function (q) {
                var b = this;
                c.clearTimeout(this.hideTimer);
                q = r(q, this.options.hideDelay, 500);
                this.isHidden || (this.hideTimer = k(function () {
                    b.getLabel()[q ? "fadeOut" : "hide"]();
                    b.isHidden = !0
                }, q))
            }, getAnchor: function (c, b) {
                var a = this.chart, e = a.pointer, h = a.inverted, d = a.plotTop, f = a.plotLeft, n = 0, x = 0, v, m;
                c = I(c);
                this.followPointer && b ? (void 0 === b.chartX && (b = e.normalize(b)), c = [b.chartX - a.plotLeft, b.chartY - d]) : c[0].tooltipPos ? c = c[0].tooltipPos : (c.forEach(function (a) {
                    v = a.series.yAxis;
                    m = a.series.xAxis;
                    n += a.plotX + (!h && m ? m.left - f : 0);
                    x += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!h && v ? v.top - d : 0)
                }), n /= c.length, x /= c.length, c = [h ? a.plotWidth - x : n, this.shared && !h && 1 < c.length && b ? b.chartY - d : h ? a.plotHeight - n : x]);
                return c.map(Math.round)
            }, getPosition: function (c, b, a) {
                var e = this.chart, h = this.distance, d = {}, f = e.inverted && a.h || 0, n, x = this.outside,
                    v = x ? C.documentElement.clientWidth - 2 * h : e.chartWidth,
                    m = x ? Math.max(C.body.scrollHeight, C.documentElement.scrollHeight, C.body.offsetHeight, C.documentElement.offsetHeight,
                        C.documentElement.clientHeight) : e.chartHeight, l = e.pointer.chartPosition,
                    t = e.containerScaling, G = function (a) {
                        return t ? a * t.scaleX : a
                    }, D = function (a) {
                        return t ? a * t.scaleY : a
                    }, p = function (d) {
                        var f = "x" === d;
                        return [d, f ? v : m, f ? c : b].concat(x ? [f ? G(c) : D(b), f ? l.left - h + G(a.plotX + e.plotLeft) : l.top - h + D(a.plotY + e.plotTop), 0, f ? v : m] : [f ? c : b, f ? a.plotX + e.plotLeft : a.plotY + e.plotTop, f ? e.plotLeft : e.plotTop, f ? e.plotLeft + e.plotWidth : e.plotTop + e.plotHeight])
                    }, H = p("y"), k = p("x"), q = !this.followPointer && r(a.ttBelow, !e.inverted === !!a.negative),
                    w = function (a, b, e, l, c, p, t) {
                        var m = "y" === a ? D(h) : G(h), n = (e - l) / 2, v = l < c - h, H = c + h + l < b,
                            x = c - m - e + n;
                        c = c + m - n;
                        if (q && H) d[a] = c; else if (!q && v) d[a] = x; else if (v) d[a] = Math.min(t - l, 0 > x - f ? x : x - f); else if (H) d[a] = Math.max(p, c + f + e > b ? c : c + f); else return !1
                    }, u = function (a, b, f, e, l) {
                        var c;
                        l < h || l > b - h ? c = !1 : d[a] = l < f / 2 ? 1 : l > b - e / 2 ? b - e - 2 : l - f / 2;
                        return c
                    }, g = function (a) {
                        var d = H;
                        H = k;
                        k = d;
                        n = a
                    }, L = function () {
                        !1 !== w.apply(0, H) ? !1 !== u.apply(0, k) || n || (g(!0), L()) : n ? d.x = d.y = 0 : (g(!0), L())
                    };
                (e.inverted || 1 < this.len) && g();
                L();
                return d
            }, defaultFormatter: function (c) {
                var b =
                    this.points || I(this);
                var a = [c.tooltipFooterHeaderFormatter(b[0])];
                a = a.concat(c.bodyFormatter(b));
                a.push(c.tooltipFooterHeaderFormatter(b[0], !0));
                return a
            }, refresh: function (k, b) {
                var a = this.chart, e = this.options, h = k, d = {}, f = [];
                var n = e.formatter || this.defaultFormatter;
                d = this.shared;
                var x = a.styledMode;
                if (e.enabled) {
                    c.clearTimeout(this.hideTimer);
                    this.followPointer = I(h)[0].series.tooltipOptions.followPointer;
                    var v = this.getAnchor(h, b);
                    b = v[0];
                    var m = v[1];
                    !d || h.series && h.series.noSharedTooltip ? d = h.getLabelConfig() :
                        (a.pointer.applyInactiveState(h), h.forEach(function (a) {
                            a.setState("hover");
                            f.push(a.getLabelConfig())
                        }), d = {x: h[0].category, y: h[0].y}, d.points = f, h = h[0]);
                    this.len = f.length;
                    n = n.call(d, this);
                    d = h.series;
                    this.distance = r(d.tooltipOptions.distance, 16);
                    !1 === n ? this.hide() : (a = this.getLabel(), this.isHidden && a.attr({opacity: 1}).show(), this.split ? this.renderSplit(n, I(k)) : (e.style.width && !x || a.css({width: this.chart.spacingBox.width}), a.attr({text: n && n.join ? n.join("") : n}), a.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-" +
                        r(h.colorIndex, d.colorIndex)), x || a.attr({stroke: e.borderColor || h.color || d.color || "#666666"}), this.updatePosition({
                        plotX: b,
                        plotY: m,
                        negative: h.negative,
                        ttBelow: h.ttBelow,
                        h: v[2] || 0
                    })), this.isHidden = !1);
                    c.fireEvent(this, "refresh")
                }
            }, renderSplit: function (k, b) {

                var a = this, e = [], h = this.chart, d = h.renderer, f = !0, n = this.options, x = 0, v,
                    m = this.getLabel(), l = h.plotTop;
                F(k) && (k = [!1, k]);
                k.slice(0, b.length + 1).forEach(function (c, G) {
                    if (!1 !== c && "" !== c) {
                        G = b[G - 1] || {isHeader: !0, plotX: b[0].plotX, plotY: h.plotHeight};
                        var t = G.series ||
                            a, p = t.tt, H = G.series || {},
                            k = "highcharts-color-" + r(G.colorIndex, H.colorIndex, "none");
                        p || (p = {
                            padding: n.padding,
                            r: n.borderRadius
                        }, h.styledMode || (p.fill = n.backgroundColor, p["stroke-width"] = n.borderWidth), t.tt = p = d.label(null, null, null, (G.isHeader ? n.headerShape : n.shape) || "callout", null, null, n.useHTML).addClass("highcharts-tooltip-box " + k).attr(p).add(m));
                        p.isActive = !0;
                        p.attr({text: c});
                        h.styledMode || p.css(n.style).shadow(n.shadow).attr({stroke: n.borderColor || G.color || H.color || "#333333"});
                        c = p.getBBox();
                        k = c.width +
                            p.strokeWidth();
                        G.isHeader ? (x = c.height, h.xAxis[0].opposite && (v = !0, l -= x), c = Math.max(0, Math.min(G.plotX + h.plotLeft - k / 2, h.chartWidth + (h.scrollablePixelsX ? h.scrollablePixelsX - h.marginRight : 0) - k))) : c = G.plotX + h.plotLeft - r(n.distance, 16) - k;
                        0 > c && (f = !1);
                        G.isHeader ? H = v ? -x : h.plotHeight + x : (H = H.yAxis, H = H.pos - l + Math.max(0, Math.min(G.plotY || 0, H.len)));
                        e.push({
                            target: H,
                            rank: G.isHeader ? 1 : 0,
                            size: t.tt.getBBox().height + 1,
                            point: G,
                            x: c,
                            tt: p
                        })
                    }
                });
                this.cleanSplit();
                n.positioner && e.forEach(function (d) {
                    var b = n.positioner.call(a,
                        d.tt.getBBox().width, d.size, d.point);
                    d.x = b.x;
                    d.align = 0;
                    d.target = b.y;
                    d.rank = r(b.rank, d.rank)
                });
                c.distribute(e, h.plotHeight + x);
                e.forEach(function (d) {
                    var b = d.point, e = b.series, c = e && e.yAxis;
                    d.tt.attr({
                        visibility: void 0 === d.pos ? "hidden" : "inherit",
                        x: f || b.isHeader || n.positioner ? d.x : b.plotX + h.plotLeft + a.distance,
                        y: d.pos + l,
                        anchorX: b.isHeader ? b.plotX + h.plotLeft : b.plotX + e.xAxis.pos,
                        anchorY: b.isHeader ? h.plotTop + h.plotHeight / 2 : c.pos + Math.max(0, Math.min(b.plotY, c.len))
                    })
                })
            }, updatePosition: function (k) {
                var b = this.chart,
                    a = b.pointer, e = this.getLabel(), h = k.plotX + b.plotLeft, d = k.plotY + b.plotTop;
                a.chartPosition || (a.chartPosition = c.offset(b.container));
                k = (this.options.positioner || this.getPosition).call(this, e.width, e.height, k);
                if (this.outside) {
                    var f = (this.options.borderWidth || 0) + 2 * this.distance;
                    this.renderer.setSize(e.width + f, e.height + f, !1);
                    if (b = b.containerScaling) c.css(this.container, {transform: "scale(" + b.scaleX + ", " + b.scaleY + ")"}), h *= b.scaleX, d *= b.scaleY;
                    h += a.chartPosition.left - k.x;
                    d += a.chartPosition.top - k.y
                }
                this.move(Math.round(k.x),
                    Math.round(k.y || 0), h, d)
            }, getDateFormat: function (c, b, a, e) {
                var h = this.chart.time, d = h.dateFormat("%m-%d %H:%M:%S.%L", b),
                    f = {millisecond: 15, second: 12, minute: 9, hour: 6, day: 3}, n = "millisecond";
                for (x in q) {
                    if (c === q.week && +h.dateFormat("%w", b) === a && "00:00:00.000" === d.substr(6)) {
                        var x = "week";
                        break
                    }
                    if (q[x] > c) {
                        x = n;
                        break
                    }
                    if (f[x] && d.substr(f[x]) !== "01-01 00:00:00.000".substr(f[x])) break;
                    "week" !== x && (n = x)
                }
                if (x) var v = h.resolveDTLFormat(e[x]).main;
                return v
            }, getXDateFormat: function (c, b, a) {
                b = b.dateTimeLabelFormats;
                var e =
                    a && a.closestPointRange;
                return (e ? this.getDateFormat(e, c.x, a.options.startOfWeek, b) : b.day) || b.year
            }, tooltipFooterHeaderFormatter: function (k, b) {
                var a = b ? "footer" : "header", e = k.series, h = e.tooltipOptions, d = h.xDateFormat, f = e.xAxis,
                    n = f && "datetime" === f.options.type && E(k.key), x = h[a + "Format"];
                b = {isFooter: b, labelConfig: k};
                c.fireEvent(this, "headerFormatter", b, function (a) {
                    n && !d && (d = this.getXDateFormat(k, h, f));
                    n && d && (k.point && k.point.tooltipDateKeys || ["key"]).forEach(function (a) {
                        x = x.replace("{point." + a + "}", "{point." +
                            a + ":" + d + "}")
                    });
                    e.chart.styledMode && (x = this.styledModeFormat(x));
                    a.text = u(x, {point: k, series: e}, this.chart.time)
                });
                return b.text
            }, bodyFormatter: function (c) {
                return c.map(function (b) {
                    var a = b.series.tooltipOptions;
                    return (a[(b.point.formatPrefix || "point") + "Formatter"] || b.point.tooltipFormatter).call(b.point, a[(b.point.formatPrefix || "point") + "Format"] || "")
                })
            }, styledModeFormat: function (c) {
                return c.replace('style="font-size: 10px"', 'class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,
                    'class="highcharts-color-{$1.colorIndex}"')
            }
        }
    });
    K(B, "parts/Pointer.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.attr, E = g.defined, F = g.isNumber, I = g.isObject, C = g.objectEach, A = g.splat, u = c.addEvent,
            z = c.charts, r = c.color, k = c.css, q = c.extend, w = c.find, b = c.fireEvent, a = c.offset, e = c.pick,
            h = c.Tooltip;
        c.Pointer = function (a, b) {
            this.init(a, b)
        };
        c.Pointer.prototype = {
            init: function (a, b) {
                this.options = b;
                this.chart = a;
                this.runChartClick = b.chart.events && !!b.chart.events.click;
                this.pinchDown = [];
                this.lastValidTouch = {};
                h && (a.tooltip = new h(a, b.tooltip), this.followTouchMove = e(b.tooltip.followTouchMove, !0));
                this.setDOMEvents()
            }, zoomOption: function (a) {
                var d = this.chart, b = d.options.chart, c = b.zoomType || "";
                d = d.inverted;
                /touch/.test(a.type) && (c = e(b.pinchType, c));
                this.zoomX = a = /x/.test(c);
                this.zoomY = c = /y/.test(c);
                this.zoomHor = a && !d || c && d;
                this.zoomVert = c && !d || a && d;
                this.hasZoom = a || c
            }, normalize: function (d, b) {
                var f = d.touches ? d.touches.length ? d.touches.item(0) : d.changedTouches[0] : d;
                b || (this.chartPosition =
                    b = a(this.chart.container));
                var e = f.pageX - b.left;
                b = f.pageY - b.top;
                if (f = this.chart.containerScaling) e /= f.scaleX, b /= f.scaleY;
                return q(d, {chartX: Math.round(e), chartY: Math.round(b)})
            }, getCoordinates: function (a) {
                var d = {xAxis: [], yAxis: []};
                this.chart.axes.forEach(function (b) {
                    d[b.isXAxis ? "xAxis" : "yAxis"].push({axis: b, value: b.toValue(a[b.horiz ? "chartX" : "chartY"])})
                });
                return d
            }, findNearestKDPoint: function (a, b, e) {
                var d;
                a.forEach(function (a) {
                    var f = !(a.noSharedTooltip && b) && 0 > a.options.findNearestPointBy.indexOf("y");
                    a = a.searchPoint(e, f);
                    if ((f = I(a, !0)) && !(f = !I(d, !0))) {
                        f = d.distX - a.distX;
                        var l = d.dist - a.dist,
                            c = (a.series.group && a.series.group.zIndex) - (d.series.group && d.series.group.zIndex);
                        f = 0 < (0 !== f && b ? f : 0 !== l ? l : 0 !== c ? c : d.series.index > a.series.index ? -1 : 1)
                    }
                    f && (d = a)
                });
                return d
            }, getPointFromEvent: function (a) {
                a = a.target;
                for (var d; a && !d;) d = a.point, a = a.parentNode;
                return d
            }, getChartCoordinatesFromPoint: function (a, b) {
                var d = a.series, f = d.xAxis;
                d = d.yAxis;
                var c = e(a.clientX, a.plotX), h = a.shapeArgs;
                if (f && d) return b ? {
                    chartX: f.len +
                    f.pos - c, chartY: d.len + d.pos - a.plotY
                } : {chartX: c + f.pos, chartY: a.plotY + d.pos};
                if (h && h.x && h.y) return {chartX: h.x, chartY: h.y}
            }, getHoverData: function (a, b, c, h, v, m) {
                var d, f = [];
                h = !(!h || !a);
                var n = b && !b.stickyTracking ? [b] : c.filter(function (a) {
                    return a.visible && !(!v && a.directTouch) && e(a.options.enableMouseTracking, !0) && a.stickyTracking
                });
                b = (d = h || !m ? a : this.findNearestKDPoint(n, v, m)) && d.series;
                d && (v && !b.noSharedTooltip ? (n = c.filter(function (a) {
                    return a.visible && !(!v && a.directTouch) && e(a.options.enableMouseTracking,
                        !0) && !a.noSharedTooltip
                }), n.forEach(function (a) {
                    var b = w(a.points, function (a) {
                        return a.x === d.x && !a.isNull
                    });
                    I(b) && (a.chart.isBoosting && (b = a.getPoint(b)), f.push(b))
                })) : f.push(d));
                return {hoverPoint: d, hoverSeries: b, hoverPoints: f}
            }, runPointActions: function (a, b) {
                var d = this.chart, f = d.tooltip && d.tooltip.options.enabled ? d.tooltip : void 0,
                    h = f ? f.shared : !1, m = b || d.hoverPoint, l = m && m.series || d.hoverSeries;
                l = this.getHoverData(m, l, d.series, (!a || "touchmove" !== a.type) && (!!b || l && l.directTouch && this.isDirectTouch), h, a);
                m = l.hoverPoint;
                var t = l.hoverPoints;
                b = (l = l.hoverSeries) && l.tooltipOptions.followPointer;
                h = h && l && !l.noSharedTooltip;
                if (m && (m !== d.hoverPoint || f && f.isHidden)) {
                    (d.hoverPoints || []).forEach(function (a) {
                        -1 === t.indexOf(a) && a.setState()
                    });
                    if (d.hoverSeries !== l) l.onMouseOver();
                    this.applyInactiveState(t);
                    (t || []).forEach(function (a) {
                        a.setState("hover")
                    });
                    d.hoverPoint && d.hoverPoint.firePointEvent("mouseOut");
                    if (!m.series) return;
                    m.firePointEvent("mouseOver");
                    d.hoverPoints = t;
                    d.hoverPoint = m;
                    f && f.refresh(h ? t : m, a)
                } else b &&
                f && !f.isHidden && (m = f.getAnchor([{}], a), f.updatePosition({plotX: m[0], plotY: m[1]}));
                this.unDocMouseMove || (this.unDocMouseMove = u(d.container.ownerDocument, "mousemove", function (a) {
                    var d = z[c.hoverChartIndex];
                    if (d) d.pointer.onDocumentMouseMove(a)
                }));
                d.axes.forEach(function (d) {
                    var b = e(d.crosshair.snap, !0), f = b ? c.find(t, function (a) {
                        return a.series[d.coll] === d
                    }) : void 0;
                    f || !b ? d.drawCrosshair(a, f) : d.hideCrosshair()
                })
            }, applyInactiveState: function (a) {
                var d = [], b;
                (a || []).forEach(function (a) {
                    b = a.series;
                    d.push(b);
                    b.linkedParent && d.push(b.linkedParent);
                    b.linkedSeries && (d = d.concat(b.linkedSeries));
                    b.navigatorSeries && d.push(b.navigatorSeries)
                });
                this.chart.series.forEach(function (a) {
                    -1 === d.indexOf(a) ? a.setState("inactive", !0) : a.options.inactiveOtherPoints && a.setAllPointsToState("inactive")
                })
            }, reset: function (a, b) {
                var d = this.chart, f = d.hoverSeries, e = d.hoverPoint, c = d.hoverPoints, l = d.tooltip,
                    h = l && l.shared ? c : e;
                a && h && A(h).forEach(function (d) {
                    d.series.isCartesian && void 0 === d.plotX && (a = !1)
                });
                if (a) l && h && A(h).length && (l.refresh(h),
                    l.shared && c ? c.forEach(function (a) {
                        a.setState(a.state, !0);
                        a.series.isCartesian && (a.series.xAxis.crosshair && a.series.xAxis.drawCrosshair(null, a), a.series.yAxis.crosshair && a.series.yAxis.drawCrosshair(null, a))
                    }) : e && (e.setState(e.state, !0), d.axes.forEach(function (a) {
                        a.crosshair && a.drawCrosshair(null, e)
                    }))); else {
                    if (e) e.onMouseOut();
                    c && c.forEach(function (a) {
                        a.setState()
                    });
                    if (f) f.onMouseOut();
                    l && l.hide(b);
                    this.unDocMouseMove && (this.unDocMouseMove = this.unDocMouseMove());
                    d.axes.forEach(function (a) {
                        a.hideCrosshair()
                    });
                    this.hoverX = d.hoverPoints = d.hoverPoint = null
                }
            }, scaleGroups: function (a, b) {
                var d = this.chart, f;
                d.series.forEach(function (e) {
                    f = a || e.getPlotBox();
                    e.xAxis && e.xAxis.zoomEnabled && e.group && (e.group.attr(f), e.markerGroup && (e.markerGroup.attr(f), e.markerGroup.clip(b ? d.clipRect : null)), e.dataLabelsGroup && e.dataLabelsGroup.attr(f))
                });
                d.clipRect.attr(b || d.clipBox)
            }, dragStart: function (a) {
                var d = this.chart;
                d.mouseIsDown = a.type;
                d.cancelClick = !1;
                d.mouseDownX = this.mouseDownX = a.chartX;
                d.mouseDownY = this.mouseDownY = a.chartY
            },
            drag: function (a) {
                var d = this.chart, b = d.options.chart, e = a.chartX, c = a.chartY, h = this.zoomHor,
                    l = this.zoomVert, t = d.plotLeft, G = d.plotTop, D = d.plotWidth, p = d.plotHeight,
                    H = this.selectionMarker, k = this.mouseDownX, q = this.mouseDownY,
                    w = b.panKey && a[b.panKey + "Key"];
                if (!H || !H.touch) if (e < t ? e = t : e > t + D && (e = t + D), c < G ? c = G : c > G + p && (c = G + p), this.hasDragged = Math.sqrt(Math.pow(k - e, 2) + Math.pow(q - c, 2)), 10 < this.hasDragged) {
                    var u = d.isInsidePlot(k - t, q - G);
                    d.hasCartesianSeries && (this.zoomX || this.zoomY) && u && !w && !H && (this.selectionMarker =
                        H = d.renderer.rect(t, G, h ? 1 : D, l ? 1 : p, 0).attr({
                            "class": "highcharts-selection-marker",
                            zIndex: 7
                        }).add(), d.styledMode || H.attr({fill: b.selectionMarkerFill || r("#335cad").setOpacity(.25).get()}));
                    H && h && (e -= k, H.attr({width: Math.abs(e), x: (0 < e ? 0 : e) + k}));
                    H && l && (e = c - q, H.attr({height: Math.abs(e), y: (0 < e ? 0 : e) + q}));
                    u && !H && b.panning && d.pan(a, b.panning)
                }
            }, drop: function (a) {
                var d = this, e = this.chart, c = this.hasPinched;
                if (this.selectionMarker) {
                    var h = {originalEvent: a, xAxis: [], yAxis: []}, m = this.selectionMarker,
                        l = m.attr ? m.attr("x") :
                            m.x, t = m.attr ? m.attr("y") : m.y, G = m.attr ? m.attr("width") : m.width,
                        D = m.attr ? m.attr("height") : m.height, p;
                    if (this.hasDragged || c) e.axes.forEach(function (b) {
                        if (b.zoomEnabled && E(b.min) && (c || d[{xAxis: "zoomX", yAxis: "zoomY"}[b.coll]])) {
                            var f = b.horiz, e = "touchend" === a.type ? b.minPixelPadding : 0,
                                m = b.toValue((f ? l : t) + e);
                            f = b.toValue((f ? l + G : t + D) - e);
                            h[b.coll].push({axis: b, min: Math.min(m, f), max: Math.max(m, f)});
                            p = !0
                        }
                    }), p && b(e, "selection", h, function (a) {
                        e.zoom(q(a, c ? {animation: !1} : null))
                    });
                    F(e.index) && (this.selectionMarker =
                        this.selectionMarker.destroy());
                    c && this.scaleGroups()
                }
                e && F(e.index) && (k(e.container, {cursor: e._cursor}), e.cancelClick = 10 < this.hasDragged, e.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = [])
            }, onContainerMouseDown: function (a) {
                a = this.normalize(a);
                2 !== a.button && (this.zoomOption(a), a.preventDefault && a.preventDefault(), this.dragStart(a))
            }, onDocumentMouseUp: function (a) {
                z[c.hoverChartIndex] && z[c.hoverChartIndex].pointer.drop(a)
            }, onDocumentMouseMove: function (a) {

                var d = this.chart, b = this.chartPosition;
                a = this.normalize(a, b);
                !b || this.inClass(a.target, "highcharts-tracker") || d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) || this.reset()
            }, onContainerMouseLeave: function (a) {
                var d = z[c.hoverChartIndex];
                d && (a.relatedTarget || a.toElement) && (d.pointer.reset(), d.pointer.chartPosition = null)
            }, onContainerMouseMove: function (a) {
                var d = this.chart;
                E(c.hoverChartIndex) && z[c.hoverChartIndex] && z[c.hoverChartIndex].mouseIsDown || (c.hoverChartIndex = d.index);
                a = this.normalize(a);
                a.preventDefault || (a.returnValue = !1);
                "mousedown" ===
                d.mouseIsDown && this.drag(a);
                !this.inClass(a.target, "highcharts-tracker") && !d.isInsidePlot(a.chartX - d.plotLeft, a.chartY - d.plotTop) || d.openMenu || this.runPointActions(a)
            }, inClass: function (a, b) {
                for (var d; a;) {
                    if (d = y(a, "class")) {
                        if (-1 !== d.indexOf(b)) return !0;
                        if (-1 !== d.indexOf("highcharts-container")) return !1
                    }
                    a = a.parentNode
                }
            }, onTrackerMouseOut: function (a) {
                var d = this.chart.hoverSeries;
                a = a.relatedTarget || a.toElement;
                this.isDirectTouch = !1;
                if (!(!d || !a || d.stickyTracking || this.inClass(a, "highcharts-tooltip") ||
                    this.inClass(a, "highcharts-series-" + d.index) && this.inClass(a, "highcharts-tracker"))) d.onMouseOut()
            }, onContainerClick: function (a) {
                var d = this.chart, e = d.hoverPoint, c = d.plotLeft, h = d.plotTop;
                a = this.normalize(a);
                d.cancelClick || (e && this.inClass(a.target, "highcharts-tracker") ? (b(e.series, "click", q(a, {point: e})), d.hoverPoint && e.firePointEvent("click", a)) : (q(a, this.getCoordinates(a)), d.isInsidePlot(a.chartX - c, a.chartY - h) && b(d, "click", a)))
            }, setDOMEvents: function () {
                var a = this, b = a.chart.container, e = b.ownerDocument;
                b.onmousedown = function (d) {
                    a.onContainerMouseDown(d)
                };
                b.onmousemove = function (d) {
                    a.onContainerMouseMove(d)
                };
                b.onclick = function (d) {
                    a.onContainerClick(d)
                };
                this.unbindContainerMouseLeave = u(b, "mouseleave", a.onContainerMouseLeave);
                c.unbindDocumentMouseUp || (c.unbindDocumentMouseUp = u(e, "mouseup", a.onDocumentMouseUp));
                c.hasTouch && (u(b, "touchstart", function (d) {
                    a.onContainerTouchStart(d)
                }), u(b, "touchmove", function (d) {
                    a.onContainerTouchMove(d)
                }), c.unbindDocumentTouchEnd || (c.unbindDocumentTouchEnd = u(e, "touchend",
                    a.onDocumentTouchEnd)))
            }, destroy: function () {
                var a = this;
                a.unDocMouseMove && a.unDocMouseMove();
                this.unbindContainerMouseLeave();
                c.chartCount || (c.unbindDocumentMouseUp && (c.unbindDocumentMouseUp = c.unbindDocumentMouseUp()), c.unbindDocumentTouchEnd && (c.unbindDocumentTouchEnd = c.unbindDocumentTouchEnd()));
                clearInterval(a.tooltipTimeout);
                C(a, function (d, b) {
                    a[b] = null
                })
            }
        }
    });
    K(B, "parts/TouchPointer.js", [B["parts/Globals.js"]], function (c) {
        var g = c.charts, y = c.extend, E = c.noop, F = c.pick;
        y(c.Pointer.prototype, {
            pinchTranslate: function (c,
                                      g, A, u, z, r) {
                this.zoomHor && this.pinchTranslateDirection(!0, c, g, A, u, z, r);
                this.zoomVert && this.pinchTranslateDirection(!1, c, g, A, u, z, r)
            }, pinchTranslateDirection: function (c, g, A, u, z, r, k, q) {
                var w = this.chart, b = c ? "x" : "y", a = c ? "X" : "Y", e = "chart" + a, h = c ? "width" : "height",
                    d = w["plot" + (c ? "Left" : "Top")], f, n, x = q || 1, v = w.inverted, m = w.bounds[c ? "h" : "v"],
                    l = 1 === g.length, t = g[0][e], G = A[0][e], D = !l && g[1][e], p = !l && A[1][e];
                A = function () {
                    !l && 20 < Math.abs(t - D) && (x = q || Math.abs(G - p) / Math.abs(t - D));
                    n = (d - G) / x + t;
                    f = w["plot" + (c ? "Width" : "Height")] /
                        x
                };
                A();
                g = n;
                if (g < m.min) {
                    g = m.min;
                    var H = !0
                } else g + f > m.max && (g = m.max - f, H = !0);
                H ? (G -= .8 * (G - k[b][0]), l || (p -= .8 * (p - k[b][1])), A()) : k[b] = [G, p];
                v || (r[b] = n - d, r[h] = f);
                r = v ? 1 / x : x;
                z[h] = f;
                z[b] = g;
                u[v ? c ? "scaleY" : "scaleX" : "scale" + a] = x;
                u["translate" + a] = r * d + (G - r * t)
            }, pinch: function (c) {
                var g = this, A = g.chart, u = g.pinchDown, z = c.touches, r = z.length, k = g.lastValidTouch,
                    q = g.hasZoom, w = g.selectionMarker, b = {},
                    a = 1 === r && (g.inClass(c.target, "highcharts-tracker") && A.runTrackerClick || g.runChartClick),
                    e = {};
                1 < r && (g.initiated = !0);
                q && g.initiated &&
                !a && c.preventDefault();
                [].map.call(z, function (a) {
                    return g.normalize(a)
                });
                "touchstart" === c.type ? ([].forEach.call(z, function (a, d) {
                    u[d] = {chartX: a.chartX, chartY: a.chartY}
                }), k.x = [u[0].chartX, u[1] && u[1].chartX], k.y = [u[0].chartY, u[1] && u[1].chartY], A.axes.forEach(function (a) {
                    if (a.zoomEnabled) {
                        var d = A.bounds[a.horiz ? "h" : "v"], b = a.minPixelPadding,
                            e = a.toPixels(Math.min(F(a.options.min, a.dataMin), a.dataMin)),
                            c = a.toPixels(Math.max(F(a.options.max, a.dataMax), a.dataMax)), h = Math.max(e, c);
                        d.min = Math.min(a.pos, Math.min(e,
                            c) - b);
                        d.max = Math.max(a.pos + a.len, h + b)
                    }
                }), g.res = !0) : g.followTouchMove && 1 === r ? this.runPointActions(g.normalize(c)) : u.length && (w || (g.selectionMarker = w = y({
                    destroy: E,
                    touch: !0
                }, A.plotBox)), g.pinchTranslate(u, z, b, w, e, k), g.hasPinched = q, g.scaleGroups(b, e), g.res && (g.res = !1, this.reset(!1, 0)))
            }, touch: function (g, C) {
                var A = this.chart, u;
                if (A.index !== c.hoverChartIndex) this.onContainerMouseLeave({relatedTarget: !0});
                c.hoverChartIndex = A.index;
                if (1 === g.touches.length) if (g = this.normalize(g), (u = A.isInsidePlot(g.chartX -
                    A.plotLeft, g.chartY - A.plotTop)) && !A.openMenu) {
                    C && this.runPointActions(g);
                    if ("touchmove" === g.type) {
                        C = this.pinchDown;
                        var z = C[0] ? 4 <= Math.sqrt(Math.pow(C[0].chartX - g.chartX, 2) + Math.pow(C[0].chartY - g.chartY, 2)) : !1
                    }
                    F(z, !0) && this.pinch(g)
                } else C && this.reset(); else 2 === g.touches.length && this.pinch(g)
            }, onContainerTouchStart: function (c) {
                this.zoomOption(c);
                this.touch(c, !0)
            }, onContainerTouchMove: function (c) {
                this.touch(c)
            }, onDocumentTouchEnd: function (y) {
                g[c.hoverChartIndex] && g[c.hoverChartIndex].pointer.drop(y)
            }
        })
    });
    K(B, "parts/MSPointer.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.objectEach, E = c.addEvent, F = c.charts, I = c.css, C = c.doc;
        g = c.extend;
        var A = c.noop, u = c.Pointer, z = c.removeEvent, r = c.win, k = c.wrap;
        if (!c.hasTouch && (r.PointerEvent || r.MSPointerEvent)) {
            var q = {}, w = !!r.PointerEvent, b = function () {
                var a = [];
                a.item = function (a) {
                    return this[a]
                };
                y(q, function (b) {
                    a.push({pageX: b.pageX, pageY: b.pageY, target: b.target})
                });
                return a
            }, a = function (a, h, d, f) {
                "touch" !== a.pointerType && a.pointerType !== a.MSPOINTER_TYPE_TOUCH ||
                !F[c.hoverChartIndex] || (f(a), f = F[c.hoverChartIndex].pointer, f[h]({
                    type: d,
                    target: a.currentTarget,
                    preventDefault: A,
                    touches: b()
                }))
            };
            g(u.prototype, {
                onContainerPointerDown: function (b) {
                    a(b, "onContainerTouchStart", "touchstart", function (a) {
                        q[a.pointerId] = {pageX: a.pageX, pageY: a.pageY, target: a.currentTarget}
                    })
                }, onContainerPointerMove: function (b) {
                    a(b, "onContainerTouchMove", "touchmove", function (a) {
                        q[a.pointerId] = {pageX: a.pageX, pageY: a.pageY};
                        q[a.pointerId].target || (q[a.pointerId].target = a.currentTarget)
                    })
                }, onDocumentPointerUp: function (b) {
                    a(b,
                        "onDocumentTouchEnd", "touchend", function (a) {
                            delete q[a.pointerId]
                        })
                }, batchMSEvents: function (a) {
                    a(this.chart.container, w ? "pointerdown" : "MSPointerDown", this.onContainerPointerDown);
                    a(this.chart.container, w ? "pointermove" : "MSPointerMove", this.onContainerPointerMove);
                    a(C, w ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp)
                }
            });
            k(u.prototype, "init", function (a, b, d) {
                a.call(this, b, d);
                this.hasZoom && I(b.container, {"-ms-touch-action": "none", "touch-action": "none"})
            });
            k(u.prototype, "setDOMEvents", function (a) {
                a.apply(this);
                (this.hasZoom || this.followTouchMove) && this.batchMSEvents(E)
            });
            k(u.prototype, "destroy", function (a) {
                this.batchMSEvents(z);
                a.call(this)
            })
        }
    });
    K(B, "parts/Legend.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, F = c.addEvent, I = c.css, C = c.discardElement, A = c.fireEvent;
        g = c.isFirefox;
        var u = c.marginNames, z = c.merge, r = c.pick, k = c.setAnimation, q = c.stableSort, w = c.win, b = c.wrap;
        c.Legend = function (a, b) {
            this.init(a, b)
        };
        c.Legend.prototype = {
            init: function (a, b) {
                this.chart = a;
                this.setOptions(b);
                b.enabled && (this.render(), F(this.chart, "endResize", function () {
                    this.legend.positionCheckboxes()
                }), this.proximate ? this.unchartrender = F(this.chart, "render", function () {
                    this.legend.proximatePositions();
                    this.legend.positionItems()
                }) : this.unchartrender && this.unchartrender())
            }, setOptions: function (a) {
                var b = r(a.padding, 8);
                this.options = a;
                this.chart.styledMode || (this.itemStyle = a.itemStyle, this.itemHiddenStyle = z(this.itemStyle, a.itemHiddenStyle));
                this.itemMarginTop = a.itemMarginTop || 0;
                this.padding = b;
                this.initialItemY =
                    b - 5;
                this.symbolWidth = r(a.symbolWidth, 16);
                this.pages = [];
                this.proximate = "proximate" === a.layout && !this.chart.inverted
            }, update: function (a, b) {
                var e = this.chart;
                this.setOptions(z(!0, this.options, a));
                this.destroy();
                e.isDirtyLegend = e.isDirtyBox = !0;
                r(b, !0) && e.redraw();
                A(this, "afterUpdate")
            }, colorizeItem: function (a, b) {
                a.legendGroup[b ? "removeClass" : "addClass"]("highcharts-legend-item-hidden");
                if (!this.chart.styledMode) {
                    var e = this.options, d = a.legendItem, f = a.legendLine, c = a.legendSymbol,
                        x = this.itemHiddenStyle.color;
                    e = b ? e.itemStyle.color : x;
                    var v = b ? a.color || x : x, m = a.options && a.options.marker, l = {fill: v};
                    d && d.css({fill: e, color: e});
                    f && f.attr({stroke: v});
                    c && (m && c.isMarker && (l = a.pointAttribs(), b || (l.stroke = l.fill = x)), c.attr(l))
                }
                A(this, "afterColorizeItem", {item: a, visible: b})
            }, positionItems: function () {
                this.allItems.forEach(this.positionItem, this);
                this.chart.isResizing || this.positionCheckboxes()
            }, positionItem: function (a) {
                var b = this.options, c = b.symbolPadding;
                b = !b.rtl;
                var d = a._legendItemPos, f = d[0];
                d = d[1];
                var n = a.checkbox;
                if ((a = a.legendGroup) && a.element) a[y(a.translateY) ? "animate" : "attr"]({
                    translateX: b ? f : this.legendWidth - f - 2 * c - 4,
                    translateY: d
                });
                n && (n.x = f, n.y = d)
            }, destroyItem: function (a) {
                var b = a.checkbox;
                ["legendItem", "legendLine", "legendSymbol", "legendGroup"].forEach(function (b) {
                    a[b] && (a[b] = a[b].destroy())
                });
                b && C(a.checkbox)
            }, destroy: function () {
                function a(a) {
                    this[a] && (this[a] = this[a].destroy())
                }

                this.getAllItems().forEach(function (b) {
                    ["legendItem", "legendGroup"].forEach(a, b)
                });
                "clipRect up down pager nav box title group".split(" ").forEach(a,
                    this);
                this.display = null
            }, positionCheckboxes: function () {
                var a = this.group && this.group.alignAttr, b = this.clipHeight || this.legendHeight,
                    c = this.titleHeight;
                if (a) {
                    var d = a.translateY;
                    this.allItems.forEach(function (f) {
                        var e = f.checkbox;
                        if (e) {
                            var h = d + c + e.y + (this.scrollOffset || 0) + 3;
                            I(e, {
                                left: a.translateX + f.checkboxOffset + e.x - 20 + "px",
                                top: h + "px",
                                display: this.proximate || h > d - 6 && h < d + b - 6 ? "" : "none"
                            })
                        }
                    }, this)
                }
            }, renderTitle: function () {
                var a = this.options, b = this.padding, c = a.title, d = 0;
                c.text && (this.title || (this.title = this.chart.renderer.label(c.text,
                    b - 3, b - 4, null, null, null, a.useHTML, null, "legend-title").attr({zIndex: 1}), this.chart.styledMode || this.title.css(c.style), this.title.add(this.group)), c.width || this.title.css({width: this.maxLegendWidth + "px"}), a = this.title.getBBox(), d = a.height, this.offsetWidth = a.width, this.contentGroup.attr({translateY: d}));
                this.titleHeight = d
            }, setText: function (a) {
                var b = this.options;
                a.legendItem.attr({text: b.labelFormat ? c.format(b.labelFormat, a, this.chart.time) : b.labelFormatter.call(a)})
            }, renderItem: function (a) {
                var b = this.chart,
                    c = b.renderer, d = this.options, f = this.symbolWidth, n = d.symbolPadding, x = this.itemStyle,
                    v = this.itemHiddenStyle, m = "horizontal" === d.layout ? r(d.itemDistance, 20) : 0, l = !d.rtl,
                    t = a.legendItem, G = !a.series, D = !G && a.series.drawLegendSymbol ? a.series : a, p = D.options;
                p = this.createCheckboxForItem && p && p.showCheckbox;
                m = f + n + m + (p ? 20 : 0);
                var H = d.useHTML, k = a.options.className;
                t || (a.legendGroup = c.g("legend-item").addClass("highcharts-" + D.type + "-series highcharts-color-" + a.colorIndex + (k ? " " + k : "") + (G ? " highcharts-series-" + a.index :
                    "")).attr({zIndex: 1}).add(this.scrollGroup), a.legendItem = t = c.text("", l ? f + n : -n, this.baseline || 0, H), b.styledMode || t.css(z(a.visible ? x : v)), t.attr({
                    align: l ? "left" : "right",
                    zIndex: 2
                }).add(a.legendGroup), this.baseline || (this.fontMetrics = c.fontMetrics(b.styledMode ? 12 : x.fontSize, t), this.baseline = this.fontMetrics.f + 3 + this.itemMarginTop, t.attr("y", this.baseline)), this.symbolHeight = d.symbolHeight || this.fontMetrics.f, D.drawLegendSymbol(this, a), this.setItemEvents && this.setItemEvents(a, t, H));
                p && !a.checkbox && this.createCheckboxForItem(a);
                this.colorizeItem(a, a.visible);
                !b.styledMode && x.width || t.css({width: (d.itemWidth || this.widthOption || b.spacingBox.width) - m});
                this.setText(a);
                b = t.getBBox();
                a.itemWidth = a.checkboxOffset = d.itemWidth || a.legendItemWidth || b.width + m;
                this.maxItemWidth = Math.max(this.maxItemWidth, a.itemWidth);
                this.totalItemWidth += a.itemWidth;
                this.itemHeight = a.itemHeight = Math.round(a.legendItemHeight || b.height || this.symbolHeight)
            }, layoutItem: function (a) {
                var b = this.options, c = this.padding, d = "horizontal" === b.layout, f = a.itemHeight,
                    n = b.itemMarginBottom || 0, x = this.itemMarginTop, v = d ? r(b.itemDistance, 20) : 0,
                    m = this.maxLegendWidth;
                b = b.alignColumns && this.totalItemWidth > m ? this.maxItemWidth : a.itemWidth;
                d && this.itemX - c + b > m && (this.itemX = c, this.lastLineHeight && (this.itemY += x + this.lastLineHeight + n), this.lastLineHeight = 0);
                this.lastItemY = x + this.itemY + n;
                this.lastLineHeight = Math.max(f, this.lastLineHeight);
                a._legendItemPos = [this.itemX, this.itemY];
                d ? this.itemX += b : (this.itemY += x + f + n, this.lastLineHeight = f);
                this.offsetWidth = this.widthOption || Math.max((d ?
                    this.itemX - c - (a.checkbox ? 0 : v) : b) + c, this.offsetWidth)
            }, getAllItems: function () {
                var a = [];
                this.chart.series.forEach(function (b) {
                    var e = b && b.options;
                    b && r(e.showInLegend, y(e.linkedTo) ? !1 : void 0, !0) && (a = a.concat(b.legendItems || ("point" === e.legendType ? b.data : b)))
                });
                A(this, "afterGetAllItems", {allItems: a});
                return a
            }, getAlignment: function () {
                var a = this.options;
                return this.proximate ? a.align.charAt(0) + "tv" : a.floating ? "" : a.align.charAt(0) + a.verticalAlign.charAt(0) + a.layout.charAt(0)
            }, adjustMargins: function (a, b) {
                var e =
                    this.chart, d = this.options, f = this.getAlignment();
                f && [/(lth|ct|rth)/, /(rtv|rm|rbv)/, /(rbh|cb|lbh)/, /(lbv|lm|ltv)/].forEach(function (c, h) {
                    c.test(f) && !y(a[h]) && (e[u[h]] = Math.max(e[u[h]], e.legend[(h + 1) % 2 ? "legendHeight" : "legendWidth"] + [1, -1, -1, 1][h] * d[h % 2 ? "x" : "y"] + r(d.margin, 12) + b[h] + (e.titleOffset[h] || 0)))
                })
            }, proximatePositions: function () {
                var a = this.chart, b = [], h = "left" === this.options.align;
                this.allItems.forEach(function (d) {
                    var f = h;
                    if (d.yAxis && d.points) {
                        d.xAxis.options.reversed && (f = !f);
                        var e = c.find(f ? d.points :
                            d.points.slice(0).reverse(), function (a) {
                            return E(a.plotY)
                        });
                        f = d.legendGroup.getBBox().height;
                        var k = d.yAxis.top - a.plotTop;
                        d.visible ? (e = e ? e.plotY : d.yAxis.height, e += k - .3 * f) : e = k + d.yAxis.height;
                        b.push({target: e, size: f, item: d})
                    }
                }, this);
                c.distribute(b, a.plotHeight);
                b.forEach(function (b) {
                    b.item._legendItemPos[1] = a.plotTop - a.spacing[0] + b.pos
                })
            }, render: function () {
                var a = this.chart, b = a.renderer, h = this.group, d, f = this.box, n = this.options, k = this.padding;
                this.itemX = k;
                this.itemY = this.initialItemY;
                this.lastItemY = this.offsetWidth =
                    0;
                this.widthOption = c.relativeLength(n.width, a.spacingBox.width - k);
                var v = a.spacingBox.width - 2 * k - n.x;
                -1 < ["rm", "lm"].indexOf(this.getAlignment().substring(0, 2)) && (v /= 2);
                this.maxLegendWidth = this.widthOption || v;
                h || (this.group = h = b.g("legend").attr({zIndex: 7}).add(), this.contentGroup = b.g().attr({zIndex: 1}).add(h), this.scrollGroup = b.g().add(this.contentGroup));
                this.renderTitle();
                v = this.getAllItems();
                q(v, function (a, b) {
                    return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0)
                });
                n.reversed &&
                v.reverse();
                this.allItems = v;
                this.display = d = !!v.length;
                this.itemHeight = this.totalItemWidth = this.maxItemWidth = this.lastLineHeight = 0;
                v.forEach(this.renderItem, this);
                v.forEach(this.layoutItem, this);
                v = (this.widthOption || this.offsetWidth) + k;
                var m = this.lastItemY + this.lastLineHeight + this.titleHeight;
                m = this.handleOverflow(m);
                m += k;
                f || (this.box = f = b.rect().addClass("highcharts-legend-box").attr({r: n.borderRadius}).add(h), f.isNew = !0);
                a.styledMode || f.attr({
                    stroke: n.borderColor, "stroke-width": n.borderWidth || 0, fill: n.backgroundColor ||
                    "none"
                }).shadow(n.shadow);
                0 < v && 0 < m && (f[f.isNew ? "attr" : "animate"](f.crisp.call({}, {
                    x: 0,
                    y: 0,
                    width: v,
                    height: m
                }, f.strokeWidth())), f.isNew = !1);
                f[d ? "show" : "hide"]();
                a.styledMode && "none" === h.getStyle("display") && (v = m = 0);
                this.legendWidth = v;
                this.legendHeight = m;
                d && (b = a.spacingBox, f = b.y, /(lth|ct|rth)/.test(this.getAlignment()) && 0 < a.titleOffset[0] ? f += a.titleOffset[0] : /(lbh|cb|rbh)/.test(this.getAlignment()) && 0 < a.titleOffset[2] && (f -= a.titleOffset[2]), f !== b.y && (b = z(b, {y: f})), h.align(z(n, {
                    width: v, height: m, verticalAlign: this.proximate ?
                        "top" : n.verticalAlign
                }), !0, b));
                this.proximate || this.positionItems();
                A(this, "afterRender")
            }, handleOverflow: function (a) {
                var b = this, c = this.chart, d = c.renderer, f = this.options, n = f.y, k = this.padding;
                n = c.spacingBox.height + ("top" === f.verticalAlign ? -n : n) - k;
                var v = f.maxHeight, m, l = this.clipRect, t = f.navigation, G = r(t.animation, !0),
                    D = t.arrowSize || 12, p = this.nav, H = this.pages, q, g = this.allItems, w = function (a) {
                        "number" === typeof a ? l.attr({height: a}) : l && (b.clipRect = l.destroy(), b.contentGroup.clip());
                        b.contentGroup.div && (b.contentGroup.div.style.clip =
                            a ? "rect(" + k + "px,9999px," + (k + a) + "px,0)" : "auto")
                    }, u = function (a) {
                        b[a] = d.circle(0, 0, 1.3 * D).translate(D / 2, D / 2).add(p);
                        c.styledMode || b[a].attr("fill", "rgba(0,0,0,0.0001)");
                        return b[a]
                    };
                "horizontal" !== f.layout || "middle" === f.verticalAlign || f.floating || (n /= 2);
                v && (n = Math.min(n, v));
                H.length = 0;
                a > n && !1 !== t.enabled ? (this.clipHeight = m = Math.max(n - 20 - this.titleHeight - k, 0), this.currentPage = r(this.currentPage, 1), this.fullHeight = a, g.forEach(function (a, b) {
                    var d = a._legendItemPos[1], f = Math.round(a.legendItem.getBBox().height),
                        e = H.length;
                    if (!e || d - H[e - 1] > m && (q || d) !== H[e - 1]) H.push(q || d), e++;
                    a.pageIx = e - 1;
                    q && (g[b - 1].pageIx = e - 1);
                    b === g.length - 1 && d + f - H[e - 1] > m && d !== q && (H.push(d), a.pageIx = e);
                    d !== q && (q = d)
                }), l || (l = b.clipRect = d.clipRect(0, k, 9999, 0), b.contentGroup.clip(l)), w(m), p || (this.nav = p = d.g().attr({zIndex: 1}).add(this.group), this.up = d.symbol("triangle", 0, 0, D, D).add(p), u("upTracker").on("click", function () {
                    b.scroll(-1, G)
                }), this.pager = d.text("", 15, 10).addClass("highcharts-legend-navigation"), c.styledMode || this.pager.css(t.style),
                    this.pager.add(p), this.down = d.symbol("triangle-down", 0, 0, D, D).add(p), u("downTracker").on("click", function () {
                    b.scroll(1, G)
                })), b.scroll(0), a = n) : p && (w(), this.nav = p.destroy(), this.scrollGroup.attr({translateY: 1}), this.clipHeight = 0);
                return a
            }, scroll: function (a, b) {
                var e = this.pages, d = e.length, f = this.currentPage + a;
                a = this.clipHeight;
                var c = this.options.navigation, x = this.pager, v = this.padding;
                f > d && (f = d);
                0 < f && (void 0 !== b && k(b, this.chart), this.nav.attr({
                    translateX: v, translateY: a + this.padding + 7 + this.titleHeight,
                    visibility: "visible"
                }), [this.up, this.upTracker].forEach(function (a) {
                    a.attr({"class": 1 === f ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"})
                }), x.attr({text: f + "/" + d}), [this.down, this.downTracker].forEach(function (a) {
                    a.attr({
                        x: 18 + this.pager.getBBox().width,
                        "class": f === d ? "highcharts-legend-nav-inactive" : "highcharts-legend-nav-active"
                    })
                }, this), this.chart.styledMode || (this.up.attr({fill: 1 === f ? c.inactiveColor : c.activeColor}), this.upTracker.css({cursor: 1 === f ? "default" : "pointer"}), this.down.attr({
                    fill: f ===
                    d ? c.inactiveColor : c.activeColor
                }), this.downTracker.css({cursor: f === d ? "default" : "pointer"})), this.scrollOffset = -e[f - 1] + this.initialItemY, this.scrollGroup.animate({translateY: this.scrollOffset}), this.currentPage = f, this.positionCheckboxes())
            }
        };
        c.LegendSymbolMixin = {
            drawRectangle: function (a, b) {
                var e = a.symbolHeight, d = a.options.squareSymbol;
                b.legendSymbol = this.chart.renderer.rect(d ? (a.symbolWidth - e) / 2 : 0, a.baseline - e + 1, d ? e : a.symbolWidth, e, r(a.options.symbolRadius, e / 2)).addClass("highcharts-point").attr({zIndex: 3}).add(b.legendGroup)
            },
            drawLineMarker: function (a) {
                var b = this.options, c = b.marker, d = a.symbolWidth, f = a.symbolHeight, n = f / 2,
                    k = this.chart.renderer, v = this.legendGroup;
                a = a.baseline - Math.round(.3 * a.fontMetrics.b);
                var m = {};
                this.chart.styledMode || (m = {"stroke-width": b.lineWidth || 0}, b.dashStyle && (m.dashstyle = b.dashStyle));
                this.legendLine = k.path(["M", 0, a, "L", d, a]).addClass("highcharts-graph").attr(m).add(v);
                c && !1 !== c.enabled && d && (b = Math.min(r(c.radius, n), n), 0 === this.symbol.indexOf("url") && (c = z(c, {
                    width: f,
                    height: f
                }), b = 0), this.legendSymbol =
                    c = k.symbol(this.symbol, d / 2 - b, a - b, 2 * b, 2 * b, c).addClass("highcharts-point").add(v), c.isMarker = !0)
            }
        };
        (/Trident\/7\.0/.test(w.navigator && w.navigator.userAgent) || g) && b(c.Legend.prototype, "positionItem", function (a, b) {
            var e = this, d = function () {
                b._legendItemPos && a.call(e, b)
            };
            d();
            e.bubbleLegend || setTimeout(d)
        })
    });
    K(B, "parts/Chart.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.attr, E = g.defined, F = g.erase, I = g.isArray, C = g.isNumber, A = g.isObject, u = g.isString,
            z = g.objectEach, r = g.pInt, k = g.splat,
            q = c.addEvent, w = c.animate, b = c.animObject, a = c.doc, e = c.Axis, h = c.createElement,
            d = c.defaultOptions, f = c.discardElement, n = c.charts, x = c.css, v = c.extend, m = c.find,
            l = c.fireEvent, t = c.Legend, G = c.marginNames, D = c.merge, p = c.Pointer, H = c.pick, J = c.removeEvent,
            M = c.seriesTypes, S = c.syncTimeout, P = c.win, R = c.Chart = function () {
                this.getArgs.apply(this, arguments)
            };
        c.chart = function (a, b, d) {
            return new R(a, b, d)
        };
        v(R.prototype, {
            callbacks: [], getArgs: function () {
                var a = [].slice.call(arguments);
                if (u(a[0]) || a[0].nodeName) this.renderTo = a.shift();
                this.init(a[0], a[1])
            }, init: function (a, b) {
                var f, e = a.series, h = a.plotOptions || {};
                l(this, "init", {args: arguments}, function () {
                    a.series = null;
                    f = D(d, a);
                    z(f.plotOptions, function (a, b) {
                        A(a) && (a.tooltip = h[b] && D(h[b].tooltip) || void 0)
                    });
                    f.tooltip.userOptions = a.chart && a.chart.forExport && a.tooltip.userOptions || a.tooltip;
                    f.series = a.series = e;
                    this.userOptions = a;
                    var p = f.chart, t = p.events;
                    this.margin = [];
                    this.spacing = [];
                    this.bounds = {h: {}, v: {}};
                    this.labelCollectors = [];
                    this.callback = b;
                    this.isResizing = 0;
                    this.options = f;
                    this.axes =
                        [];
                    this.series = [];
                    this.time = a.time && Object.keys(a.time).length ? new c.Time(a.time) : c.time;
                    this.styledMode = p.styledMode;
                    this.hasCartesianSeries = p.showAxes;
                    var m = this;
                    m.index = n.length;
                    n.push(m);
                    c.chartCount++;
                    t && z(t, function (a, b) {
                        c.isFunction(a) && q(m, b, a)
                    });
                    m.xAxis = [];
                    m.yAxis = [];
                    m.pointCount = m.colorCounter = m.symbolCounter = 0;
                    l(m, "afterInit");
                    m.firstRender()
                })
            }, initSeries: function (a) {
                var b = this.options.chart;
                (b = M[a.type || b.type || b.defaultSeriesType]) || c.error(17, !0, this);
                b = new b;
                b.init(this, a);
                return b
            },
            orderSeries: function (a) {
                var b = this.series;
                for (a = a || 0; a < b.length; a++) b[a] && (b[a].index = a, b[a].name = b[a].getName())
            }, isInsidePlot: function (a, b, d) {
                var f = d ? b : a;
                a = d ? a : b;
                return 0 <= f && f <= this.plotWidth && 0 <= a && a <= this.plotHeight
            }, redraw: function (a) {
                l(this, "beforeRedraw");
                var b = this.axes, d = this.series, f = this.pointer, e = this.legend, h = this.userOptions.legend,
                    p = this.isDirtyLegend, t = this.hasCartesianSeries, m = this.isDirtyBox, n = this.renderer,
                    D = n.isHidden(), G = [];
                this.setResponsive && this.setResponsive(!1);
                c.setAnimation(a,
                    this);
                D && this.temporaryDisplay();
                this.layOutTitles();
                for (a = d.length; a--;) {
                    var H = d[a];
                    if (H.options.stacking) {
                        var k = !0;
                        if (H.isDirty) {
                            var x = !0;
                            break
                        }
                    }
                }
                if (x) for (a = d.length; a--;) H = d[a], H.options.stacking && (H.isDirty = !0);
                d.forEach(function (a) {
                    a.isDirty && ("point" === a.options.legendType ? (a.updateTotals && a.updateTotals(), p = !0) : h && (h.labelFormatter || h.labelFormat) && (p = !0));
                    a.isDirtyData && l(a, "updatedData")
                });
                p && e && e.options.enabled && (e.render(), this.isDirtyLegend = !1);
                k && this.getStacks();
                t && b.forEach(function (a) {
                    a.updateNames();
                    a.setScale()
                });
                this.getMargins();
                t && (b.forEach(function (a) {
                    a.isDirty && (m = !0)
                }), b.forEach(function (a) {
                    var b = a.min + "," + a.max;
                    a.extKey !== b && (a.extKey = b, G.push(function () {
                        l(a, "afterSetExtremes", v(a.eventArgs, a.getExtremes()));
                        delete a.eventArgs
                    }));
                    (m || k) && a.redraw()
                }));
                m && this.drawChartBox();
                l(this, "predraw");
                d.forEach(function (a) {
                    (m || a.isDirty) && a.visible && a.redraw();
                    a.isDirtyData = !1
                });
                f && f.reset(!0);
                n.draw();
                l(this, "redraw");
                l(this, "render");
                D && this.temporaryDisplay(!0);
                G.forEach(function (a) {
                    a.call()
                })
            },
            get: function (a) {
                function b(b) {
                    return b.id === a || b.options && b.options.id === a
                }

                var d = this.series, f;
                var e = m(this.axes, b) || m(this.series, b);
                for (f = 0; !e && f < d.length; f++) e = m(d[f].points || [], b);
                return e
            }, getAxes: function () {
                var a = this, b = this.options, d = b.xAxis = k(b.xAxis || {});
                b = b.yAxis = k(b.yAxis || {});
                l(this, "getAxes");
                d.forEach(function (a, b) {
                    a.index = b;
                    a.isX = !0
                });
                b.forEach(function (a, b) {
                    a.index = b
                });
                d.concat(b).forEach(function (b) {
                    new e(a, b)
                });
                l(this, "afterGetAxes")
            }, getSelectedPoints: function () {
                var a = [];
                this.series.forEach(function (b) {
                    a =
                        a.concat((b[b.hasGroupedData ? "points" : "data"] || []).filter(function (a) {
                            return H(a.selectedStaging, a.selected)
                        }))
                });
                return a
            }, getSelectedSeries: function () {
                return this.series.filter(function (a) {
                    return a.selected
                })
            }, setTitle: function (a, b, d) {
                this.applyDescription("title", a);
                this.applyDescription("subtitle", b);
                this.applyDescription("caption", void 0);
                this.layOutTitles(d)
            }, applyDescription: function (a, b) {
                var d = this, f = "title" === a ? {
                    color: "#333333",
                    fontSize: this.options.isStock ? "16px" : "18px"
                } : {color: "#666666"};
                f = this.options[a] = D(!this.styledMode && {style: f}, this.options[a], b);
                var e = this[a];
                e && b && (this[a] = e = e.destroy());
                f && !e && (e = this.renderer.text(f.text, 0, 0, f.useHTML).attr({
                    align: f.align,
                    "class": "highcharts-" + a,
                    zIndex: f.zIndex || 4
                }).add(), e.update = function (b) {
                    d[{title: "setTitle", subtitle: "setSubtitle", caption: "setCaption"}[a]](b)
                }, this.styledMode || e.css(f.style), this[a] = e)
            }, layOutTitles: function (a) {
                var b = [0, 0, 0], d = this.renderer, f = this.spacingBox;
                ["title", "subtitle", "caption"].forEach(function (a) {
                    var e =
                        this[a], c = this.options[a], l = c.verticalAlign || "top";
                    a = "title" === a ? -3 : "top" === l ? b[0] + 2 : 0;
                    if (e) {
                        if (!this.styledMode) var h = c.style.fontSize;
                        h = d.fontMetrics(h, e).b;
                        e.css({width: (c.width || f.width + (c.widthAdjust || 0)) + "px"});
                        var p = e.getBBox(c.useHTML).height;
                        e.align(v({y: "bottom" === l ? h : a + h, height: p}, c), !1, "spacingBox");
                        c.floating || ("top" === l ? b[0] = Math.ceil(b[0] + p) : "bottom" === l && (b[2] = Math.ceil(b[2] + p)))
                    }
                }, this);
                b[0] && "top" === (this.options.title.verticalAlign || "top") && (b[0] += this.options.title.margin);
                b[2] &&
                "bottom" === this.options.caption.verticalAlign && (b[2] += this.options.caption.margin);
                var e = !this.titleOffset || this.titleOffset.join(",") !== b.join(",");
                this.titleOffset = b;
                !this.isDirtyBox && e && (this.isDirtyBox = this.isDirtyLegend = e, this.hasRendered && H(a, !0) && this.isDirtyBox && this.redraw())
            }, getChartSize: function () {
                var a = this.options.chart, b = a.width;
                a = a.height;
                var d = this.renderTo;
                E(b) || (this.containerWidth = c.getStyle(d, "width"));
                E(a) || (this.containerHeight = c.getStyle(d, "height"));
                this.chartWidth = Math.max(0,
                    b || this.containerWidth || 600);
                this.chartHeight = Math.max(0, c.relativeLength(a, this.chartWidth) || (1 < this.containerHeight ? this.containerHeight : 400))
            }, temporaryDisplay: function (b) {
                var d = this.renderTo;
                if (b) for (; d && d.style;) d.hcOrigStyle && (c.css(d, d.hcOrigStyle), delete d.hcOrigStyle), d.hcOrigDetached && (a.body.removeChild(d), d.hcOrigDetached = !1), d = d.parentNode; else for (; d && d.style;) {
                    a.body.contains(d) || d.parentNode || (d.hcOrigDetached = !0, a.body.appendChild(d));
                    if ("none" === c.getStyle(d, "display", !1) || d.hcOricDetached) d.hcOrigStyle =
                        {
                            display: d.style.display,
                            height: d.style.height,
                            overflow: d.style.overflow
                        }, b = {
                        display: "block",
                        overflow: "hidden"
                    }, d !== this.renderTo && (b.height = 0), c.css(d, b), d.offsetWidth || d.style.setProperty("display", "block", "important");
                    d = d.parentNode;
                    if (d === a.body) break
                }
            }, setClassName: function (a) {
                this.container.className = "highcharts-container " + (a || "")
            }, getContainer: function () {
                var b = this.options, d = b.chart;
                var f = this.renderTo;
                var e = c.uniqueKey(), p, t;
                f || (this.renderTo = f = d.renderTo);
                u(f) && (this.renderTo = f = a.getElementById(f));
                f || c.error(13, !0, this);
                var m = r(y(f, "data-highcharts-chart"));
                C(m) && n[m] && n[m].hasRendered && n[m].destroy();
                y(f, "data-highcharts-chart", this.index);
                f.innerHTML = "";
                d.skipClone || f.offsetWidth || this.temporaryDisplay();
                this.getChartSize();
                m = this.chartWidth;
                var D = this.chartHeight;
                x(f, {overflow: "hidden"});
                this.styledMode || (p = v({
                    position: "relative",
                    overflow: "hidden",
                    width: m + "px",
                    height: D + "px",
                    textAlign: "left",
                    lineHeight: "normal",
                    zIndex: 0,
                    "-webkit-tap-highlight-color": "rgba(0,0,0,0)"
                }, d.style));
                this.container =
                    f = h("div", {id: e}, p, f);
                this._cursor = f.style.cursor;
                this.renderer = new (c[d.renderer] || c.Renderer)(f, m, D, null, d.forExport, b.exporting && b.exporting.allowHTML, this.styledMode);
                this.setClassName(d.className);
                if (this.styledMode) for (t in b.defs) this.renderer.definition(b.defs[t]); else this.renderer.setStyle(d.style);
                this.renderer.chartIndex = this.index;
                l(this, "afterGetContainer")
            }, getMargins: function (a) {
                var b = this.spacing, d = this.margin, f = this.titleOffset;
                this.resetMargins();
                f[0] && !E(d[0]) && (this.plotTop = Math.max(this.plotTop,
                    f[0] + b[0]));
                f[2] && !E(d[2]) && (this.marginBottom = Math.max(this.marginBottom, f[2] + b[2]));
                this.legend && this.legend.display && this.legend.adjustMargins(d, b);
                l(this, "getMargins");
                a || this.getAxisMargins()
            }, getAxisMargins: function () {
                var a = this, b = a.axisOffset = [0, 0, 0, 0], d = a.colorAxis, f = a.margin, e = function (a) {
                    a.forEach(function (a) {
                        a.visible && a.getOffset()
                    })
                };
                a.hasCartesianSeries ? e(a.axes) : d && d.length && e(d);
                G.forEach(function (d, e) {
                    E(f[e]) || (a[d] += b[e])
                });
                a.setChartSize()
            }, reflow: function (b) {
                var d = this, f = d.options.chart,
                    e = d.renderTo, l = E(f.width) && E(f.height), h = f.width || c.getStyle(e, "width");
                f = f.height || c.getStyle(e, "height");
                e = b ? b.target : P;
                if (!l && !d.isPrinting && h && f && (e === P || e === a)) {
                    if (h !== d.containerWidth || f !== d.containerHeight) c.clearTimeout(d.reflowTimeout), d.reflowTimeout = S(function () {
                        d.container && d.setSize(void 0, void 0, !1)
                    }, b ? 100 : 0);
                    d.containerWidth = h;
                    d.containerHeight = f
                }
            }, setReflow: function (a) {
                var b = this;
                !1 === a || this.unbindReflow ? !1 === a && this.unbindReflow && (this.unbindReflow = this.unbindReflow()) : (this.unbindReflow =
                    q(P, "resize", function (a) {
                        b.options && b.reflow(a)
                    }), q(this, "destroy", this.unbindReflow))
            }, setSize: function (a, d, f) {
                var e = this, h = e.renderer;
                e.isResizing += 1;
                c.setAnimation(f, e);
                e.oldChartHeight = e.chartHeight;
                e.oldChartWidth = e.chartWidth;
                void 0 !== a && (e.options.chart.width = a);
                void 0 !== d && (e.options.chart.height = d);
                e.getChartSize();
                if (!e.styledMode) {
                    var p = h.globalAnimation;
                    (p ? w : x)(e.container, {width: e.chartWidth + "px", height: e.chartHeight + "px"}, p)
                }
                e.setChartSize(!0);
                h.setSize(e.chartWidth, e.chartHeight, f);
                e.axes.forEach(function (a) {
                    a.isDirty = !0;
                    a.setScale()
                });
                e.isDirtyLegend = !0;
                e.isDirtyBox = !0;
                e.layOutTitles();
                e.getMargins();
                e.redraw(f);
                e.oldChartHeight = null;
                l(e, "resize");
                S(function () {
                    e && l(e, "endResize", null, function () {
                        --e.isResizing
                    })
                }, b(p).duration)
            }, setChartSize: function (a) {
                var b = this.inverted, d = this.renderer, f = this.chartWidth, e = this.chartHeight,
                    c = this.options.chart, h = this.spacing, p = this.clipOffset, t, m, n, D;
                this.plotLeft = t = Math.round(this.plotLeft);
                this.plotTop = m = Math.round(this.plotTop);
                this.plotWidth =
                    n = Math.max(0, Math.round(f - t - this.marginRight));
                this.plotHeight = D = Math.max(0, Math.round(e - m - this.marginBottom));
                this.plotSizeX = b ? D : n;
                this.plotSizeY = b ? n : D;
                this.plotBorderWidth = c.plotBorderWidth || 0;
                this.spacingBox = d.spacingBox = {x: h[3], y: h[0], width: f - h[3] - h[1], height: e - h[0] - h[2]};
                this.plotBox = d.plotBox = {x: t, y: m, width: n, height: D};
                f = 2 * Math.floor(this.plotBorderWidth / 2);
                b = Math.ceil(Math.max(f, p[3]) / 2);
                d = Math.ceil(Math.max(f, p[0]) / 2);
                this.clipBox = {
                    x: b, y: d, width: Math.floor(this.plotSizeX - Math.max(f, p[1]) /
                        2 - b), height: Math.max(0, Math.floor(this.plotSizeY - Math.max(f, p[2]) / 2 - d))
                };
                a || this.axes.forEach(function (a) {
                    a.setAxisSize();
                    a.setAxisTranslation()
                });
                l(this, "afterSetChartSize", {skipAxes: a})
            }, resetMargins: function () {
                l(this, "resetMargins");
                var a = this, b = a.options.chart;
                ["margin", "spacing"].forEach(function (d) {
                    var f = b[d], e = A(f) ? f : [f, f, f, f];
                    ["Top", "Right", "Bottom", "Left"].forEach(function (f, c) {
                        a[d][c] = H(b[d + f], e[c])
                    })
                });
                G.forEach(function (b, d) {
                    a[b] = H(a.margin[d], a.spacing[d])
                });
                a.axisOffset = [0, 0, 0, 0];
                a.clipOffset =
                    [0, 0, 0, 0]
            }, drawChartBox: function () {
                var a = this.options.chart, b = this.renderer, d = this.chartWidth, f = this.chartHeight,
                    e = this.chartBackground, c = this.plotBackground, h = this.plotBorder, p = this.styledMode,
                    t = this.plotBGImage, m = a.backgroundColor, n = a.plotBackgroundColor, D = a.plotBackgroundImage,
                    G, H = this.plotLeft, v = this.plotTop, k = this.plotWidth, x = this.plotHeight, q = this.plotBox,
                    J = this.clipRect, r = this.clipBox, g = "animate";
                e || (this.chartBackground = e = b.rect().addClass("highcharts-background").add(), g = "attr");
                if (p) var w =
                    G = e.strokeWidth(); else {
                    w = a.borderWidth || 0;
                    G = w + (a.shadow ? 8 : 0);
                    m = {fill: m || "none"};
                    if (w || e["stroke-width"]) m.stroke = a.borderColor, m["stroke-width"] = w;
                    e.attr(m).shadow(a.shadow)
                }
                e[g]({x: G / 2, y: G / 2, width: d - G - w % 2, height: f - G - w % 2, r: a.borderRadius});
                g = "animate";
                c || (g = "attr", this.plotBackground = c = b.rect().addClass("highcharts-plot-background").add());
                c[g](q);
                p || (c.attr({fill: n || "none"}).shadow(a.plotShadow), D && (t ? t.animate(q) : this.plotBGImage = b.image(D, H, v, k, x).add()));
                J ? J.animate({width: r.width, height: r.height}) :
                    this.clipRect = b.clipRect(r);
                g = "animate";
                h || (g = "attr", this.plotBorder = h = b.rect().addClass("highcharts-plot-border").attr({zIndex: 1}).add());
                p || h.attr({stroke: a.plotBorderColor, "stroke-width": a.plotBorderWidth || 0, fill: "none"});
                h[g](h.crisp({x: H, y: v, width: k, height: x}, -h.strokeWidth()));
                this.isDirtyBox = !1;
                l(this, "afterDrawChartBox")
            }, propFromSeries: function () {
                var a = this, b = a.options.chart, d, f = a.options.series, e, c;
                ["inverted", "angular", "polar"].forEach(function (l) {
                    d = M[b.type || b.defaultSeriesType];
                    c = b[l] ||
                        d && d.prototype[l];
                    for (e = f && f.length; !c && e--;) (d = M[f[e].type]) && d.prototype[l] && (c = !0);
                    a[l] = c
                })
            }, linkSeries: function () {
                var a = this, b = a.series;
                b.forEach(function (a) {
                    a.linkedSeries.length = 0
                });
                b.forEach(function (b) {
                    var d = b.options.linkedTo;
                    u(d) && (d = ":previous" === d ? a.series[b.index - 1] : a.get(d)) && d.linkedParent !== b && (d.linkedSeries.push(b), b.linkedParent = d, b.visible = H(b.options.visible, d.options.visible, b.visible))
                });
                l(this, "afterLinkSeries")
            }, renderSeries: function () {
                this.series.forEach(function (a) {
                    a.translate();
                    a.render()
                })
            }, renderLabels: function () {
                var a = this, b = a.options.labels;
                b.items && b.items.forEach(function (d) {
                    var f = v(b.style, d.style), e = r(f.left) + a.plotLeft, c = r(f.top) + a.plotTop + 12;
                    delete f.left;
                    delete f.top;
                    a.renderer.text(d.html, e, c).attr({zIndex: 2}).css(f).add()
                })
            }, render: function () {
                var a = this.axes, b = this.colorAxis, d = this.renderer, f = this.options, e = 0, c = function (a) {
                    a.forEach(function (a) {
                        a.visible && a.render()
                    })
                };
                this.setTitle();
                this.legend = new t(this, f.legend);
                this.getStacks && this.getStacks();
                this.getMargins(!0);
                this.setChartSize();
                f = this.plotWidth;
                a.some(function (a) {
                    if (a.horiz && a.visible && a.options.labels.enabled && a.series.length) return e = 21, !0
                });
                var l = this.plotHeight = Math.max(this.plotHeight - e, 0);
                a.forEach(function (a) {
                    a.setScale()
                });
                this.getAxisMargins();
                var h = 1.1 < f / this.plotWidth;
                var p = 1.05 < l / this.plotHeight;
                if (h || p) a.forEach(function (a) {
                    (a.horiz && h || !a.horiz && p) && a.setTickInterval(!0)
                }), this.getMargins();
                this.drawChartBox();
                this.hasCartesianSeries ? c(a) : b && b.length && c(b);
                this.seriesGroup || (this.seriesGroup =
                    d.g("series-group").attr({zIndex: 3}).add());
                this.renderSeries();
                this.renderLabels();
                this.addCredits();
                this.setResponsive && this.setResponsive();
                this.updateContainerScaling();
                this.hasRendered = !0
            }, addCredits: function (a) {
                var b = this;
                a = D(!0, this.options.credits, a);
                a.enabled && !this.credits && (this.credits = this.renderer.text(a.text + (this.mapCredits || ""), 0, 0).addClass("highcharts-credits").on("click", function () {
                    a.href && (P.location.href = a.href)
                }).attr({align: a.position.align, zIndex: 8}), b.styledMode || this.credits.css(a.style),
                    this.credits.add().align(a.position), this.credits.update = function (a) {
                    b.credits = b.credits.destroy();
                    b.addCredits(a)
                })
            }, updateContainerScaling: function () {
                var a = this.container;
                if (a.offsetWidth && a.offsetHeight && a.getBoundingClientRect) {
                    var b = a.getBoundingClientRect(), d = b.width / a.offsetWidth;
                    a = b.height / a.offsetHeight;
                    1 !== d || 1 !== a ? this.containerScaling = {scaleX: d, scaleY: a} : delete this.containerScaling
                }
            }, destroy: function () {
                var a = this, b = a.axes, d = a.series, e = a.container, h, p = e && e.parentNode;
                l(a, "destroy");
                a.renderer.forExport ?
                    F(n, a) : n[a.index] = void 0;
                c.chartCount--;
                a.renderTo.removeAttribute("data-highcharts-chart");
                J(a);
                for (h = b.length; h--;) b[h] = b[h].destroy();
                this.scroller && this.scroller.destroy && this.scroller.destroy();
                for (h = d.length; h--;) d[h] = d[h].destroy();
                "title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function (b) {
                    var d = a[b];
                    d && d.destroy && (a[b] = d.destroy())
                });
                e && (e.innerHTML = "", J(e),
                p && f(e));
                z(a, function (b, d) {
                    delete a[d]
                })
            }, firstRender: function () {
                var a = this, b = a.options;
                if (!a.isReadyToRender || a.isReadyToRender()) {
                    a.getContainer();
                    a.resetMargins();
                    a.setChartSize();
                    a.propFromSeries();
                    a.getAxes();
                    (I(b.series) ? b.series : []).forEach(function (b) {
                        a.initSeries(b)
                    });
                    a.linkSeries();
                    l(a, "beforeRender");
                    p && (a.pointer = new p(a, b));
                    a.render();
                    if (!a.renderer.imgCount && a.onload) a.onload();
                    a.temporaryDisplay(!0)
                }
            }, onload: function () {
                this.callbacks.concat([this.callback]).forEach(function (a) {
                    a && void 0 !==
                    this.index && a.apply(this, [this])
                }, this);
                l(this, "load");
                l(this, "render");
                E(this.index) && this.setReflow(this.options.chart.reflow);
                this.onload = null
            }
        })
    });
    K(B, "parts/ScrollablePlotArea.js", [B["parts/Globals.js"]], function (c) {
        var g = c.addEvent, y = c.Chart;
        "";
        g(y, "afterSetChartSize", function (g) {
            var y = this.options.chart.scrollablePlotArea, E = y && y.minWidth;
            y = y && y.minHeight;
            if (!this.renderer.forExport) {
                if (E) {
                    if (this.scrollablePixelsX = E = Math.max(0, E - this.chartWidth)) {
                        this.plotWidth += E;
                        this.inverted ? (this.clipBox.height +=
                            E, this.plotBox.height += E) : (this.clipBox.width += E, this.plotBox.width += E);
                        var C = {1: {name: "right", value: E}}
                    }
                } else y && (this.scrollablePixelsY = E = Math.max(0, y - this.chartHeight)) && (this.plotHeight += E, this.inverted ? (this.clipBox.width += E, this.plotBox.width += E) : (this.clipBox.height += E, this.plotBox.height += E), C = {
                    2: {
                        name: "bottom",
                        value: E
                    }
                });
                C && !g.skipAxes && this.axes.forEach(function (g) {
                    C[g.side] ? g.getPlotLinePath = function () {
                        var u = C[g.side].name, z = this[u];
                        this[u] = z - C[g.side].value;
                        var r = c.Axis.prototype.getPlotLinePath.apply(this,
                            arguments);
                        this[u] = z;
                        return r
                    } : (g.setAxisSize(), g.setAxisTranslation())
                })
            }
        });
        g(y, "render", function () {
            this.scrollablePixelsX || this.scrollablePixelsY ? (this.setUpScrolling && this.setUpScrolling(), this.applyFixed()) : this.fixedDiv && this.applyFixed()
        });
        y.prototype.setUpScrolling = function () {
            var g = {WebkitOverflowScrolling: "touch", overflowX: "hidden", overflowY: "hidden"};
            this.scrollablePixelsX && (g.overflowX = "auto");
            this.scrollablePixelsY && (g.overflowY = "auto");
            this.scrollingContainer = c.createElement("div", {className: "highcharts-scrolling"},
                g, this.renderTo);
            this.innerContainer = c.createElement("div", {className: "highcharts-inner-container"}, null, this.scrollingContainer);
            this.innerContainer.appendChild(this.container);
            this.setUpScrolling = null
        };
        y.prototype.moveFixedElements = function () {
            var c = this.container, g = this.fixedRenderer,
                y = ".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-reset-zoom .highcharts-subtitle .highcharts-title .highcharts-legend-checkbox".split(" "),
                C;
            this.scrollablePixelsX && !this.inverted ? C = ".highcharts-yaxis" :
                this.scrollablePixelsX && this.inverted ? C = ".highcharts-xaxis" : this.scrollablePixelsY && !this.inverted ? C = ".highcharts-xaxis" : this.scrollablePixelsY && this.inverted && (C = ".highcharts-yaxis");
            y.push(C, C + "-labels");
            y.forEach(function (C) {
                [].forEach.call(c.querySelectorAll(C), function (c) {
                    (c.namespaceURI === g.SVG_NS ? g.box : g.box.parentNode).appendChild(c);
                    c.style.pointerEvents = "auto"
                })
            })
        };
        y.prototype.applyFixed = function () {
            var y, F = !this.fixedDiv, I = this.options.chart.scrollablePlotArea;
            F ? (this.fixedDiv = c.createElement("div",
                {className: "highcharts-fixed"}, {
                    position: "absolute",
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 2
                }, null, !0), this.renderTo.insertBefore(this.fixedDiv, this.renderTo.firstChild), this.renderTo.style.overflow = "visible", this.fixedRenderer = y = new c.Renderer(this.fixedDiv, this.chartWidth, this.chartHeight), this.scrollableMask = y.path().attr({
                fill: c.color(this.options.chart.backgroundColor || "#fff").setOpacity(c.pick(I.opacity, .85)).get(),
                zIndex: -1
            }).addClass("highcharts-scrollable-mask").add(), this.moveFixedElements(),
                g(this, "afterShowResetZoom", this.moveFixedElements)) : this.fixedRenderer.setSize(this.chartWidth, this.chartHeight);
            y = this.chartWidth + (this.scrollablePixelsX || 0);
            var C = this.chartHeight + (this.scrollablePixelsY || 0);
            c.stop(this.container);
            this.container.style.width = y + "px";
            this.container.style.height = C + "px";
            this.renderer.boxWrapper.attr({width: y, height: C, viewBox: [0, 0, y, C].join(" ")});
            this.chartBackground.attr({width: y, height: C});
            this.scrollablePixelsY && (this.scrollingContainer.style.height = this.chartHeight +
                "px");
            F && (I.scrollPositionX && (this.scrollingContainer.scrollLeft = this.scrollablePixelsX * I.scrollPositionX), I.scrollPositionY && (this.scrollingContainer.scrollTop = this.scrollablePixelsY * I.scrollPositionY));
            C = this.axisOffset;
            F = this.plotTop - C[0] - 1;
            I = this.plotLeft - C[3] - 1;
            y = this.plotTop + this.plotHeight + C[2] + 1;
            C = this.plotLeft + this.plotWidth + C[1] + 1;
            var A = this.plotLeft + this.plotWidth - (this.scrollablePixelsX || 0),
                u = this.plotTop + this.plotHeight - (this.scrollablePixelsY || 0);
            F = this.scrollablePixelsX ? ["M", 0, F, "L",
                this.plotLeft - 1, F, "L", this.plotLeft - 1, y, "L", 0, y, "Z", "M", A, F, "L", this.chartWidth, F, "L", this.chartWidth, y, "L", A, y, "Z"] : this.scrollablePixelsY ? ["M", I, 0, "L", I, this.plotTop - 1, "L", C, this.plotTop - 1, "L", C, 0, "Z", "M", I, u, "L", I, this.chartHeight, "L", C, this.chartHeight, "L", C, u, "Z"] : ["M", 0, 0];
            "adjustHeight" !== this.redrawTrigger && this.scrollableMask.attr({d: F})
        }
    });
    K(B, "parts/Point.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.erase, F = g.isArray, I = g.isNumber, C = g.isObject, A,
            u = c.extend, z = c.fireEvent, r = c.format, k = c.pick, q = c.uniqueKey, w = c.removeEvent;
        c.Point = A = function () {
        };
        c.Point.prototype = {
            init: function (b, a, e) {
                this.series = b;
                this.applyOptions(a, e);
                this.id = y(this.id) ? this.id : q();
                this.resolveColor();
                b.chart.pointCount++;
                z(this, "afterInit");
                return this
            }, resolveColor: function () {
                var b = this.series;
                var a = b.chart.options.chart.colorCount;
                var e = b.chart.styledMode;
                e || this.options.color || (this.color = b.color);
                b.options.colorByPoint ? (e || (a = b.options.colors || b.chart.options.colors,
                    this.color = this.color || a[b.colorCounter], a = a.length), e = b.colorCounter, b.colorCounter++, b.colorCounter === a && (b.colorCounter = 0)) : e = b.colorIndex;
                this.colorIndex = k(this.colorIndex, e)
            }, applyOptions: function (b, a) {
                var e = this.series, c = e.options.pointValKey || e.pointValKey;
                b = A.prototype.optionsToObject.call(this, b);
                u(this, b);
                this.options = this.options ? u(this.options, b) : b;
                b.group && delete this.group;
                b.dataLabels && delete this.dataLabels;
                c && (this.y = this[c]);
                this.formatPrefix = (this.isNull = k(this.isValid && !this.isValid(),
                    null === this.x || !I(this.y))) ? "null" : "point";
                this.selected && (this.state = "select");
                "name" in this && void 0 === a && e.xAxis && e.xAxis.hasNames && (this.x = e.xAxis.nameToX(this));
                void 0 === this.x && e && (this.x = void 0 === a ? e.autoIncrement(this) : a);
                return this
            }, setNestedProperty: function (b, a, e) {
                e.split(".").reduce(function (b, d, f, e) {
                    b[d] = e.length - 1 === f ? a : C(b[d], !0) ? b[d] : {};
                    return b[d]
                }, b);
                return b
            }, optionsToObject: function (b) {
                var a = {}, e = this.series, h = e.options.keys, d = h || e.pointArrayMap || ["y"], f = d.length, n = 0,
                    k = 0;
                if (I(b) ||
                    null === b) a[d[0]] = b; else if (F(b)) for (!h && b.length > f && (e = typeof b[0], "string" === e ? a.name = b[0] : "number" === e && (a.x = b[0]), n++); k < f;) h && void 0 === b[n] || (0 < d[k].indexOf(".") ? c.Point.prototype.setNestedProperty(a, b[n], d[k]) : a[d[k]] = b[n]), n++, k++; else "object" === typeof b && (a = b, b.dataLabels && (e._hasPointLabels = !0), b.marker && (e._hasPointMarkers = !0));
                return a
            }, getClassName: function () {
                return "highcharts-point" + (this.selected ? " highcharts-point-select" : "") + (this.negative ? " highcharts-negative" : "") + (this.isNull ? " highcharts-null-point" :
                    "") + (void 0 !== this.colorIndex ? " highcharts-color-" + this.colorIndex : "") + (this.options.className ? " " + this.options.className : "") + (this.zone && this.zone.className ? " " + this.zone.className.replace("highcharts-negative", "") : "")
            }, getZone: function () {
                var b = this.series, a = b.zones;
                b = b.zoneAxis || "y";
                var e = 0, c;
                for (c = a[e]; this[b] >= c.value;) c = a[++e];
                this.nonZonedColor || (this.nonZonedColor = this.color);
                this.color = c && c.color && !this.options.color ? c.color : this.nonZonedColor;
                return c
            }, destroy: function () {
                var b = this.series.chart,
                    a = b.hoverPoints, e;
                b.pointCount--;
                a && (this.setState(), E(a, this), a.length || (b.hoverPoints = null));
                if (this === b.hoverPoint) this.onMouseOut();
                if (this.graphic || this.dataLabel || this.dataLabels) w(this), this.destroyElements();
                this.legendItem && b.legend.destroyItem(this);
                for (e in this) this[e] = null
            }, destroyElements: function (b) {
                var a = this, e = [], c;
                b = b || {graphic: 1, dataLabel: 1};
                b.graphic && e.push("graphic", "shadowGroup");
                b.dataLabel && e.push("dataLabel", "dataLabelUpper", "connector");
                for (c = e.length; c--;) {
                    var d = e[c];
                    a[d] &&
                    (a[d] = a[d].destroy())
                }
                ["dataLabel", "connector"].forEach(function (d) {
                    var f = d + "s";
                    b[d] && a[f] && (a[f].forEach(function (a) {
                        a.element && a.destroy()
                    }), delete a[f])
                })
            }, getLabelConfig: function () {
                return {
                    x: this.category,
                    y: this.y,
                    color: this.color,
                    colorIndex: this.colorIndex,
                    key: this.name || this.category,
                    series: this.series,
                    point: this,
                    percentage: this.percentage,
                    total: this.total || this.stackTotal
                }
            }, tooltipFormatter: function (b) {
                var a = this.series, e = a.tooltipOptions, c = k(e.valueDecimals, ""), d = e.valuePrefix || "",
                    f = e.valueSuffix ||
                        "";
                a.chart.styledMode && (b = a.chart.tooltip.styledModeFormat(b));
                (a.pointArrayMap || ["y"]).forEach(function (a) {
                    a = "{point." + a;
                    if (d || f) b = b.replace(RegExp(a + "}", "g"), d + a + "}" + f);
                    b = b.replace(RegExp(a + "}", "g"), a + ":,." + c + "f}")
                });
                return r(b, {point: this, series: this.series}, a.chart.time)
            }, firePointEvent: function (b, a, e) {
                var c = this, d = this.series.options;
                (d.point.events[b] || c.options && c.options.events && c.options.events[b]) && this.importEvents();
                "click" === b && d.allowPointSelect && (e = function (a) {
                    c.select && c.select(null,
                        a.ctrlKey || a.metaKey || a.shiftKey)
                });
                z(this, b, a, e)
            }, visible: !0
        }
    });
    K(B, "parts/Series.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.erase, F = g.isArray, I = g.isNumber, C = g.isString, A = g.objectEach, u = g.splat,
            z = c.addEvent, r = c.animObject, k = c.arrayMax, q = c.arrayMin, w = c.correctFloat, b = c.defaultOptions,
            a = c.defaultPlotOptions, e = c.extend, h = c.fireEvent, d = c.merge, f = c.pick, n = c.removeEvent,
            x = c.SVGElement, v = c.syncTimeout, m = c.win;
        c.Series = c.seriesType("line", null, {
            lineWidth: 2,
            allowPointSelect: !1,
            showCheckbox: !1,
            animation: {duration: 1E3},
            events: {},
            marker: {
                lineWidth: 0,
                lineColor: "#ffffff",
                enabledThreshold: 2,
                radius: 4,
                states: {
                    normal: {animation: !0},
                    hover: {animation: {duration: 50}, enabled: !0, radiusPlus: 2, lineWidthPlus: 1},
                    select: {fillColor: "#cccccc", lineColor: "#000000", lineWidth: 2}
                }
            },
            point: {events: {}},
            dataLabels: {
                align: "center",
                formatter: function () {
                    return null === this.y ? "" : c.numberFormat(this.y, -1)
                },
                padding: 5,
                style: {fontSize: "11px", fontWeight: "bold", color: "contrast", textOutline: "1px contrast"},
                verticalAlign: "bottom",
                x: 0,
                y: 0
            },
            cropThreshold: 300,
            opacity: 1,
            pointRange: 0,
            softThreshold: !0,
            states: {
                normal: {animation: !0},
                hover: {animation: {duration: 50}, lineWidthPlus: 1, marker: {}, halo: {size: 10, opacity: .25}},
                select: {animation: {duration: 0}},
                inactive: {animation: {duration: 50}, opacity: .2}
            },
            stickyTracking: !0,
            turboThreshold: 1E3,
            findNearestPointBy: "x"
        }, {
            axisTypes: ["xAxis", "yAxis"],
            coll: "series",
            colorCounter: 0,
            cropShoulder: 1,
            directTouch: !1,
            isCartesian: !0,
            parallelArrays: ["x", "y"],
            pointClass: c.Point,
            requireSorting: !0,
            sorted: !0,
            init: function (a,
                            b) {
                h(this, "init", {options: b});
                var d = this, l = a.series, p;
                this.eventOptions = this.eventOptions || {};
                d.chart = a;
                d.options = b = d.setOptions(b);
                d.linkedSeries = [];
                d.bindAxes();
                e(d, {name: b.name, state: "", visible: !1 !== b.visible, selected: !0 === b.selected});
                var t = b.events;
                A(t, function (a, b) {
                    c.isFunction(a) && d.eventOptions[b] !== a && (c.isFunction(d.eventOptions[b]) && n(d, b, d.eventOptions[b]), d.eventOptions[b] = a, z(d, b, a))
                });
                if (t && t.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick =
                    !0;
                d.getColor();
                d.getSymbol();
                d.parallelArrays.forEach(function (a) {
                    d[a + "Data"] || (d[a + "Data"] = [])
                });
                d.points || d.data || d.setData(b.data, !1);
                d.isCartesian && (a.hasCartesianSeries = !0);
                l.length && (p = l[l.length - 1]);
                d._i = f(p && p._i, -1) + 1;
                a.orderSeries(this.insert(l));
                h(this, "afterInit")
            },
            insert: function (a) {
                var b = this.options.index, d;
                if (I(b)) {
                    for (d = a.length; d--;) if (b >= f(a[d].options.index, a[d]._i)) {
                        a.splice(d + 1, 0, this);
                        break
                    }
                    -1 === d && a.unshift(this);
                    d += 1
                } else a.push(this);
                return f(d, a.length - 1)
            },
            bindAxes: function () {
                var a =
                    this, b = a.options, d = a.chart, f;
                h(this, "bindAxes", null, function () {
                    (a.axisTypes || []).forEach(function (e) {
                        d[e].forEach(function (d) {
                            f = d.options;
                            if (b[e] === f.index || void 0 !== b[e] && b[e] === f.id || void 0 === b[e] && 0 === f.index) a.insert(d.series), a[e] = d, d.isDirty = !0
                        });
                        a[e] || a.optionalAxis === e || c.error(18, !0, d)
                    })
                })
            },
            updateParallelArrays: function (a, b) {
                var d = a.series, f = arguments, e = I(b) ? function (f) {
                    var e = "y" === f && d.toYData ? d.toYData(a) : a[f];
                    d[f + "Data"][b] = e
                } : function (a) {
                    Array.prototype[b].apply(d[a + "Data"], Array.prototype.slice.call(f,
                        2))
                };
                d.parallelArrays.forEach(e)
            },
            hasData: function () {
                return this.visible && void 0 !== this.dataMax && void 0 !== this.dataMin || this.visible && this.yData && 0 < this.yData.length
            },
            autoIncrement: function () {
                var a = this.options, b = this.xIncrement, d, e = a.pointIntervalUnit, c = this.chart.time;
                b = f(b, a.pointStart, 0);
                this.pointInterval = d = f(this.pointInterval, a.pointInterval, 1);
                e && (a = new c.Date(b), "day" === e ? c.set("Date", a, c.get("Date", a) + d) : "month" === e ? c.set("Month", a, c.get("Month", a) + d) : "year" === e && c.set("FullYear", a, c.get("FullYear",
                    a) + d), d = a.getTime() - b);
                this.xIncrement = b + d;
                return b
            },
            setOptions: function (a) {
                var e = this.chart, c = e.options, l = c.plotOptions, p = e.userOptions || {};
                a = d(a);
                e = e.styledMode;
                var m = {plotOptions: l, userOptions: a};
                h(this, "setOptions", m);
                var n = m.plotOptions[this.type], v = p.plotOptions || {};
                this.userOptions = m.userOptions;
                p = d(n, l.series, p.plotOptions && p.plotOptions[this.type], a);
                this.tooltipOptions = d(b.tooltip, b.plotOptions.series && b.plotOptions.series.tooltip, b.plotOptions[this.type].tooltip, c.tooltip.userOptions, l.series &&
                    l.series.tooltip, l[this.type].tooltip, a.tooltip);
                this.stickyTracking = f(a.stickyTracking, v[this.type] && v[this.type].stickyTracking, v.series && v.series.stickyTracking, this.tooltipOptions.shared && !this.noSharedTooltip ? !0 : p.stickyTracking);
                null === n.marker && delete p.marker;
                this.zoneAxis = p.zoneAxis;
                c = this.zones = (p.zones || []).slice();
                !p.negativeColor && !p.negativeFillColor || p.zones || (l = {
                    value: p[this.zoneAxis + "Threshold"] || p.threshold || 0,
                    className: "highcharts-negative"
                }, e || (l.color = p.negativeColor, l.fillColor =
                    p.negativeFillColor), c.push(l));
                c.length && y(c[c.length - 1].value) && c.push(e ? {} : {color: this.color, fillColor: this.fillColor});
                h(this, "afterSetOptions", {options: p});
                return p
            },
            getName: function () {
                return f(this.options.name, "Series " + (this.index + 1))
            },
            getCyclic: function (a, b, d) {
                var e = this.chart, c = this.userOptions, l = a + "Index", h = a + "Counter",
                    m = d ? d.length : f(e.options.chart[a + "Count"], e[a + "Count"]);
                if (!b) {
                    var t = f(c[l], c["_" + l]);
                    y(t) || (e.series.length || (e[h] = 0), c["_" + l] = t = e[h] % m, e[h] += 1);
                    d && (b = d[t])
                }
                void 0 !== t &&
                (this[l] = t);
                this[a] = b
            },
            getColor: function () {
                this.chart.styledMode ? this.getCyclic("color") : this.options.colorByPoint ? this.options.color = null : this.getCyclic("color", this.options.color || a[this.type].color, this.chart.options.colors)
            },
            getSymbol: function () {
                this.getCyclic("symbol", this.options.marker.symbol, this.chart.options.symbols)
            },
            findPointIndex: function (a, b) {
                var d = a.id;
                a = a.x;
                var f = this.points, e;
                if (d) {
                    var c = (d = this.chart.get(d)) && d.index;
                    void 0 !== c && (e = !0)
                }
                void 0 === c && I(a) && (c = this.xData.indexOf(a, b));
                -1 !== c && void 0 !== c && this.cropped && (c = c >= this.cropStart ? c - this.cropStart : c);
                !e && f[c] && f[c].touched && (c = void 0);
                return c
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawLineMarker,
            updateData: function (a) {
                var b = this.options, d = this.points, f = [], e, c, l, h = this.requireSorting,
                    m = a.length === d.length, n = !0;
                this.xIncrement = null;
                a.forEach(function (a, c) {
                    var p = y(a) && this.pointClass.prototype.optionsToObject.call({series: this}, a) || {};
                    var t = p.x;
                    if (p.id || I(t)) if (t = this.findPointIndex(p, l), -1 === t || void 0 === t ? f.push(a) : d[t] &&
                    a !== b.data[t] ? (d[t].update(a, !1, null, !1), d[t].touched = !0, h && (l = t + 1)) : d[t] && (d[t].touched = !0), !m || c !== t || this.hasDerivedData) e = !0
                }, this);
                if (e) for (a = d.length; a--;) (c = d[a]) && !c.touched && c.remove(!1); else m ? a.forEach(function (a, b) {
                    d[b].update && a !== d[b].y && d[b].update(a, !1, null, !1)
                }) : n = !1;
                d.forEach(function (a) {
                    a && (a.touched = !1)
                });
                if (!n) return !1;
                f.forEach(function (a) {
                    this.addPoint(a, !1, null, null, !1)
                }, this);
                return !0
            },
            setData: function (a, b, d, e) {
                var l = this, h = l.points, m = h && h.length || 0, t, n = l.options, D = l.chart,
                    v = null, G = l.xAxis, k = n.turboThreshold, x = this.xData, q = this.yData,
                    r = (t = l.pointArrayMap) && t.length, g = n.keys, w = 0, u = 1, z;
                a = a || [];
                t = a.length;
                b = f(b, !0);
                !1 !== e && t && m && !l.cropped && !l.hasGroupedData && l.visible && !l.isSeriesBoosting && (z = this.updateData(a));
                if (!z) {
                    l.xIncrement = null;
                    l.colorCounter = 0;
                    this.parallelArrays.forEach(function (a) {
                        l[a + "Data"].length = 0
                    });
                    if (k && t > k) {
                        for (d = 0; null === v && d < t;) v = a[d], d++;
                        if (I(v)) for (d = 0; d < t; d++) x[d] = this.autoIncrement(), q[d] = a[d]; else if (F(v)) if (r) for (d = 0; d < t; d++) v = a[d], x[d] = v[0],
                            q[d] = v.slice(1, r + 1); else for (g && (w = g.indexOf("x"), u = g.indexOf("y"), w = 0 <= w ? w : 0, u = 0 <= u ? u : 1), d = 0; d < t; d++) v = a[d], x[d] = v[w], q[d] = v[u]; else c.error(12, !1, D)
                    } else for (d = 0; d < t; d++) void 0 !== a[d] && (v = {series: l}, l.pointClass.prototype.applyOptions.apply(v, [a[d]]), l.updateParallelArrays(v, d));
                    q && C(q[0]) && c.error(14, !0, D);
                    l.data = [];
                    l.options.data = l.userOptions.data = a;
                    for (d = m; d--;) h[d] && h[d].destroy && h[d].destroy();
                    G && (G.minRange = G.userMinRange);
                    l.isDirty = D.isDirtyBox = !0;
                    l.isDirtyData = !!h;
                    d = !1
                }
                "point" === n.legendType &&
                (this.processData(), this.generatePoints());
                b && D.redraw(d)
            },
            processData: function (a) {
                var b = this.xData, d = this.yData, f = b.length;
                var e = 0;
                var l = this.xAxis, h = this.options;
                var m = h.cropThreshold;
                var n = this.getExtremesFromAll || h.getExtremesFromAll, v = this.isCartesian;
                h = l && l.val2lin;
                var k = l && l.isLog, x = this.requireSorting;
                if (v && !this.isDirty && !l.isDirty && !this.yAxis.isDirty && !a) return !1;
                if (l) {
                    a = l.getExtremes();
                    var q = a.min;
                    var r = a.max
                }
                if (v && this.sorted && !n && (!m || f > m || this.forceCrop)) if (b[f - 1] < q || b[0] > r) b = [], d =
                    []; else if (this.yData && (b[0] < q || b[f - 1] > r)) {
                    e = this.cropData(this.xData, this.yData, q, r);
                    b = e.xData;
                    d = e.yData;
                    e = e.start;
                    var g = !0
                }
                for (m = b.length || 1; --m;) if (f = k ? h(b[m]) - h(b[m - 1]) : b[m] - b[m - 1], 0 < f && (void 0 === w || f < w)) var w = f; else 0 > f && x && (c.error(15, !1, this.chart), x = !1);
                this.cropped = g;
                this.cropStart = e;
                this.processedXData = b;
                this.processedYData = d;
                this.closestPointRange = this.basePointRange = w
            },
            cropData: function (a, b, d, e, c) {
                var l = a.length, h = 0, p = l, m;
                c = f(c, this.cropShoulder);
                for (m = 0; m < l; m++) if (a[m] >= d) {
                    h = Math.max(0,
                        m - c);
                    break
                }
                for (d = m; d < l; d++) if (a[d] > e) {
                    p = d + c;
                    break
                }
                return {xData: a.slice(h, p), yData: b.slice(h, p), start: h, end: p}
            },
            generatePoints: function () {
                var a = this.options, b = a.data, d = this.data, f, c = this.processedXData, m = this.processedYData,
                    n = this.pointClass, v = c.length, k = this.cropStart || 0, x = this.hasGroupedData;
                a = a.keys;
                var q = [], r;
                d || x || (d = [], d.length = b.length, d = this.data = d);
                a && x && (this.options.keys = !1);
                for (r = 0; r < v; r++) {
                    var g = k + r;
                    if (x) {
                        var w = (new n).init(this, [c[r]].concat(u(m[r])));
                        w.dataGroup = this.groupMap[r];
                        w.dataGroup.options &&
                        (w.options = w.dataGroup.options, e(w, w.dataGroup.options), delete w.dataLabels)
                    } else (w = d[g]) || void 0 === b[g] || (d[g] = w = (new n).init(this, b[g], c[r]));
                    w && (w.index = g, q[r] = w)
                }
                this.options.keys = a;
                if (d && (v !== (f = d.length) || x)) for (r = 0; r < f; r++) r !== k || x || (r += v), d[r] && (d[r].destroyElements(), d[r].plotX = void 0);
                this.data = d;
                this.points = q;
                h(this, "afterGeneratePoints")
            },
            getXExtremes: function (a) {
                return {min: q(a), max: k(a)}
            },
            getExtremes: function (a) {
                var b = this.xAxis, d = this.yAxis, f = this.processedXData || this.xData, e = [], c = 0,
                    l = 0;
                var m = 0;
                var n = this.requireSorting ? this.cropShoulder : 0, v = d ? d.positiveValuesOnly : !1, x;
                a = a || this.stackedYData || this.processedYData || [];
                d = a.length;
                b && (m = b.getExtremes(), l = m.min, m = m.max);
                for (x = 0; x < d; x++) {
                    var r = f[x];
                    var g = a[x];
                    var w = (I(g) || F(g)) && (g.length || 0 < g || !v);
                    r = this.getExtremesFromAll || this.options.getExtremesFromAll || this.cropped || !b || (f[x + n] || r) >= l && (f[x - n] || r) <= m;
                    if (w && r) if (w = g.length) for (; w--;) I(g[w]) && (e[c++] = g[w]); else e[c++] = g
                }
                this.dataMin = q(e);
                this.dataMax = k(e);
                h(this, "afterGetExtremes")
            },
            translate: function () {
                this.processedXData || this.processData();
                this.generatePoints();
                var a = this.options, b = a.stacking, d = this.xAxis, e = d.categories, c = this.yAxis, m = this.points,
                    n = m.length, v = !!this.modifyValue, k, x = this.pointPlacementToXValue(), q = I(x),
                    r = a.threshold, g = a.startFromThreshold ? r : 0, u, z = this.zoneAxis || "y",
                    C = Number.MAX_VALUE;
                for (k = 0; k < n; k++) {
                    var A = m[k], E = A.x;
                    var B = A.y;
                    var K = A.low, U = b && c.stacks[(this.negStacks && B < (g ? 0 : r) ? "-" : "") + this.stackKey];
                    c.positiveValuesOnly && null !== B && 0 >= B && (A.isNull = !0);
                    A.plotX =
                        u = w(Math.min(Math.max(-1E5, d.translate(E, 0, 0, 0, 1, x, "flags" === this.type)), 1E5));
                    if (b && this.visible && U && U[E]) {
                        var Y = this.getStackIndicator(Y, E, this.index);
                        if (!A.isNull) {
                            var Z = U[E];
                            var V = Z.points[Y.key]
                        }
                    }
                    F(V) && (K = V[0], B = V[1], K === g && Y.key === U[E].base && (K = f(I(r) && r, c.min)), c.positiveValuesOnly && 0 >= K && (K = null), A.total = A.stackTotal = Z.total, A.percentage = Z.total && A.y / Z.total * 100, A.stackY = B, this.irregularWidths || Z.setOffset(this.pointXOffset || 0, this.barW || 0));
                    A.yBottom = y(K) ? Math.min(Math.max(-1E5, c.translate(K,
                        0, 1, 0, 1)), 1E5) : null;
                    v && (B = this.modifyValue(B, A));
                    A.plotY = B = "number" === typeof B && Infinity !== B ? Math.min(Math.max(-1E5, c.translate(B, 0, 1, 0, 1)), 1E5) : void 0;
                    A.isInside = void 0 !== B && 0 <= B && B <= c.len && 0 <= u && u <= d.len;
                    A.clientX = q ? w(d.translate(E, 0, 0, 0, 1, x)) : u;
                    A.negative = A[z] < (a[z + "Threshold"] || r || 0);
                    A.category = e && void 0 !== e[A.x] ? e[A.x] : A.x;
                    if (!A.isNull) {
                        void 0 !== W && (C = Math.min(C, Math.abs(u - W)));
                        var W = u
                    }
                    A.zone = this.zones.length && A.getZone()
                }
                this.closestPointRangePx = C;
                h(this, "afterTranslate")
            },
            getValidPoints: function (a,
                                      b, d) {
                var f = this.chart;
                return (a || this.points || []).filter(function (a) {
                    return b && !f.isInsidePlot(a.plotX, a.plotY, f.inverted) ? !1 : d || !a.isNull
                })
            },
            getClipBox: function (a, b) {
                var d = this.options, f = this.chart, e = f.inverted, c = this.xAxis, l = c && this.yAxis;
                a && !1 === d.clip && l ? a = e ? {
                    y: -f.chartWidth + l.len + l.pos,
                    height: f.chartWidth,
                    width: f.chartHeight,
                    x: -f.chartHeight + c.len + c.pos
                } : {
                    y: -l.pos,
                    height: f.chartHeight,
                    width: f.chartWidth,
                    x: -c.pos
                } : (a = this.clipBox || f.clipBox, b && (a.width = f.plotSizeX, a.x = 0));
                return b ? {
                    width: a.width,
                    x: a.x
                } : a
            },
            setClip: function (a) {
                var b = this.chart, d = this.options, f = b.renderer, e = b.inverted, c = this.clipBox,
                    l = this.getClipBox(a),
                    h = this.sharedClipKey || ["_sharedClip", a && a.duration, a && a.easing, l.height, d.xAxis, d.yAxis].join(),
                    m = b[h], n = b[h + "m"];
                m || (a && (l.width = 0, e && (l.x = b.plotSizeX + (!1 !== d.clip ? 0 : b.plotTop)), b[h + "m"] = n = f.clipRect(e ? b.plotSizeX + 99 : -99, e ? -b.plotLeft : -b.plotTop, 99, e ? b.chartWidth : b.chartHeight)), b[h] = m = f.clipRect(l), m.count = {length: 0});
                a && !m.count[this.index] && (m.count[this.index] = !0, m.count.length +=
                    1);
                if (!1 !== d.clip || a) this.group.clip(a || c ? m : b.clipRect), this.markerGroup.clip(n), this.sharedClipKey = h;
                a || (m.count[this.index] && (delete m.count[this.index], --m.count.length), 0 === m.count.length && h && b[h] && (c || (b[h] = b[h].destroy()), b[h + "m"] && (b[h + "m"] = b[h + "m"].destroy())))
            },
            animate: function (a) {
                var b = this.chart, d = r(this.options.animation);
                if (a) this.setClip(d); else {
                    var f = this.sharedClipKey;
                    a = b[f];
                    var e = this.getClipBox(d, !0);
                    a && a.animate(e, d);
                    b[f + "m"] && b[f + "m"].animate({
                        width: e.width + 99, x: e.x - (b.inverted ?
                            0 : 99)
                    }, d);
                    this.animate = null
                }
            },
            afterAnimate: function () {
                this.setClip();
                h(this, "afterAnimate");
                this.finishedAnimating = !0
            },
            drawPoints: function () {
                var a = this.points, b = this.chart, d, e = this.options.marker,
                    c = this[this.specialGroup] || this.markerGroup;
                var h = this.xAxis;
                var m = f(e.enabled, !h || h.isRadial ? !0 : null, this.closestPointRangePx >= e.enabledThreshold * e.radius);
                if (!1 !== e.enabled || this._hasPointMarkers) for (h = 0; h < a.length; h++) {
                    var n = a[h];
                    var v = (d = n.graphic) ? "animate" : "attr";
                    var k = n.marker || {};
                    var x = !!n.marker;
                    var q = m && void 0 === k.enabled || k.enabled;
                    var r = !1 !== n.isInside;
                    if (q && !n.isNull) {
                        q = f(k.symbol, this.symbol);
                        var g = this.markerAttribs(n, n.selected && "select");
                        d ? d[r ? "show" : "hide"](r).animate(g) : r && (0 < g.width || n.hasImage) && (n.graphic = d = b.renderer.symbol(q, g.x, g.y, g.width, g.height, x ? k : e).add(c));
                        if (d && !b.styledMode) d[v](this.pointAttribs(n, n.selected && "select"));
                        d && d.addClass(n.getClassName(), !0)
                    } else d && (n.graphic = d.destroy())
                }
            },
            markerAttribs: function (a, b) {
                var d = this.options.marker, e = a.marker || {}, c = e.symbol ||
                    d.symbol, h = f(e.radius, d.radius);
                b && (d = d.states[b], b = e.states && e.states[b], h = f(b && b.radius, d && d.radius, h + (d && d.radiusPlus || 0)));
                a.hasImage = c && 0 === c.indexOf("url");
                a.hasImage && (h = 0);
                a = {x: Math.floor(a.plotX) - h, y: a.plotY - h};
                h && (a.width = a.height = 2 * h);
                return a
            },
            pointAttribs: function (a, b) {
                var d = this.options.marker, e = a && a.options, c = e && e.marker || {}, h = this.color,
                    l = e && e.color, m = a && a.color;
                e = f(c.lineWidth, d.lineWidth);
                var t = a && a.zone && a.zone.color;
                a = 1;
                h = l || t || m || h;
                l = c.fillColor || d.fillColor || h;
                h = c.lineColor ||
                    d.lineColor || h;
                b = b || "normal";
                d = d.states[b];
                b = c.states && c.states[b] || {};
                e = f(b.lineWidth, d.lineWidth, e + f(b.lineWidthPlus, d.lineWidthPlus, 0));
                l = b.fillColor || d.fillColor || l;
                h = b.lineColor || d.lineColor || h;
                a = f(b.opacity, d.opacity, a);
                return {stroke: h, "stroke-width": e, fill: l, opacity: a}
            },
            destroy: function (a) {
                var b = this, d = b.chart, f = /AppleWebKit\/533/.test(m.navigator.userAgent), e, l, v = b.data || [],
                    k, q;
                h(b, "destroy");
                a || n(b);
                (b.axisTypes || []).forEach(function (a) {
                    (q = b[a]) && q.series && (E(q.series, b), q.isDirty = q.forceRedraw =
                        !0)
                });
                b.legendItem && b.chart.legend.destroyItem(b);
                for (l = v.length; l--;) (k = v[l]) && k.destroy && k.destroy();
                b.points = null;
                c.clearTimeout(b.animationTimeout);
                A(b, function (a, b) {
                    a instanceof x && !a.survive && (e = f && "group" === b ? "hide" : "destroy", a[e]())
                });
                d.hoverSeries === b && (d.hoverSeries = null);
                E(d.series, b);
                d.orderSeries();
                A(b, function (d, f) {
                    a && "hcEvents" === f || delete b[f]
                })
            },
            getGraphPath: function (a, b, d) {
                var f = this, e = f.options, c = e.step, h, l = [], m = [], t;
                a = a || f.points;
                (h = a.reversed) && a.reverse();
                (c = {right: 1, center: 2}[c] ||
                    c && 3) && h && (c = 4 - c);
                !e.connectNulls || b || d || (a = this.getValidPoints(a));
                a.forEach(function (h, p) {
                    var n = h.plotX, v = h.plotY, D = a[p - 1];
                    (h.leftCliff || D && D.rightCliff) && !d && (t = !0);
                    h.isNull && !y(b) && 0 < p ? t = !e.connectNulls : h.isNull && !b ? t = !0 : (0 === p || t ? p = ["M", h.plotX, h.plotY] : f.getPointSpline ? p = f.getPointSpline(a, h, p) : c ? (p = 1 === c ? ["L", D.plotX, v] : 2 === c ? ["L", (D.plotX + n) / 2, D.plotY, "L", (D.plotX + n) / 2, v] : ["L", n, D.plotY], p.push("L", n, v)) : p = ["L", n, v], m.push(h.x), c && (m.push(h.x), 2 === c && m.push(h.x)), l.push.apply(l, p), t = !1)
                });
                l.xMap = m;
                return f.graphPath = l
            },
            drawGraph: function () {
                var a = this, b = this.options, d = (this.gappedPath || this.getGraphPath).call(this),
                    f = this.chart.styledMode, e = [["graph", "highcharts-graph"]];
                f || e[0].push(b.lineColor || this.color || "#cccccc", b.dashStyle);
                e = a.getZonesGraphs(e);
                e.forEach(function (e, c) {
                    var h = e[0], l = a[h], m = l ? "animate" : "attr";
                    l ? (l.endX = a.preventGraphAnimation ? null : d.xMap, l.animate({d: d})) : d.length && (a[h] = l = a.chart.renderer.path(d).addClass(e[1]).attr({zIndex: 1}).add(a.group));
                    l && !f && (h = {
                        stroke: e[2],
                        "stroke-width": b.lineWidth, fill: a.fillGraph && a.color || "none"
                    }, e[3] ? h.dashstyle = e[3] : "square" !== b.linecap && (h["stroke-linecap"] = h["stroke-linejoin"] = "round"), l[m](h).shadow(2 > c && b.shadow));
                    l && (l.startX = d.xMap, l.isArea = d.isArea)
                })
            },
            getZonesGraphs: function (a) {
                this.zones.forEach(function (b, d) {
                    d = ["zone-graph-" + d, "highcharts-graph highcharts-zone-graph-" + d + " " + (b.className || "")];
                    this.chart.styledMode || d.push(b.color || this.color, b.dashStyle || this.options.dashStyle);
                    a.push(d)
                }, this);
                return a
            },
            applyZones: function () {
                var a =
                        this, b = this.chart, d = b.renderer, e = this.zones, c, h, m = this.clips || [], n, v = this.graph,
                    k = this.area, x = Math.max(b.chartWidth, b.chartHeight), q = this[(this.zoneAxis || "y") + "Axis"],
                    r = b.inverted, g, w, u, z = !1;
                if (e.length && (v || k) && q && void 0 !== q.min) {
                    var A = q.reversed;
                    var C = q.horiz;
                    v && !this.showLine && v.hide();
                    k && k.hide();
                    var y = q.getExtremes();
                    e.forEach(function (e, l) {
                        c = A ? C ? b.plotWidth : 0 : C ? 0 : q.toPixels(y.min) || 0;
                        c = Math.min(Math.max(f(h, c), 0), x);
                        h = Math.min(Math.max(Math.round(q.toPixels(f(e.value, y.max), !0) || 0), 0), x);
                        z &&
                        (c = h = q.toPixels(y.max));
                        g = Math.abs(c - h);
                        w = Math.min(c, h);
                        u = Math.max(c, h);
                        q.isXAxis ? (n = {
                            x: r ? u : w,
                            y: 0,
                            width: g,
                            height: x
                        }, C || (n.x = b.plotHeight - n.x)) : (n = {
                            x: 0,
                            y: r ? u : w,
                            width: x,
                            height: g
                        }, C && (n.y = b.plotWidth - n.y));
                        r && d.isVML && (n = q.isXAxis ? {
                            x: 0,
                            y: A ? w : u,
                            height: n.width,
                            width: b.chartWidth
                        } : {x: n.y - b.plotLeft - b.spacingBox.x, y: 0, width: n.height, height: b.chartHeight});
                        m[l] ? m[l].animate(n) : m[l] = d.clipRect(n);
                        v && a["zone-graph-" + l].clip(m[l]);
                        k && a["zone-area-" + l].clip(m[l]);
                        z = e.value > y.max;
                        a.resetZones && 0 === h && (h = void 0)
                    });
                    this.clips = m
                } else a.visible && (v && v.show(!0), k && k.show(!0))
            },
            invertGroups: function (a) {
                function b() {
                    ["group", "markerGroup"].forEach(function (b) {
                        d[b] && (f.renderer.isVML && d[b].attr({
                            width: d.yAxis.len,
                            height: d.xAxis.len
                        }), d[b].width = d.yAxis.len, d[b].height = d.xAxis.len, d[b].invert(a))
                    })
                }

                var d = this, f = d.chart;
                if (d.xAxis) {
                    var e = z(f, "resize", b);
                    z(d, "destroy", e);
                    b(a);
                    d.invertGroups = b
                }
            },
            plotGroup: function (a, b, d, f, e) {
                var c = this[a], h = !c;
                h && (this[a] = c = this.chart.renderer.g().attr({zIndex: f || .1}).add(e));
                c.addClass("highcharts-" +
                    b + " highcharts-series-" + this.index + " highcharts-" + this.type + "-series " + (y(this.colorIndex) ? "highcharts-color-" + this.colorIndex + " " : "") + (this.options.className || "") + (c.hasClass("highcharts-tracker") ? " highcharts-tracker" : ""), !0);
                c.attr({visibility: d})[h ? "attr" : "animate"](this.getPlotBox());
                return c
            },
            getPlotBox: function () {
                var a = this.chart, b = this.xAxis, d = this.yAxis;
                a.inverted && (b = d, d = this.xAxis);
                return {translateX: b ? b.left : a.plotLeft, translateY: d ? d.top : a.plotTop, scaleX: 1, scaleY: 1}
            },
            render: function () {
                var a =
                        this, b = a.chart, d = a.options, f = !!a.animate && b.renderer.isSVG && r(d.animation).duration,
                    e = a.visible ? "inherit" : "hidden", c = d.zIndex, m = a.hasRendered, n = b.seriesGroup,
                    k = b.inverted;
                h(this, "render");
                var x = a.plotGroup("group", "series", e, c, n);
                a.markerGroup = a.plotGroup("markerGroup", "markers", e, c, n);
                f && a.animate(!0);
                x.inverted = a.isCartesian || a.invertable ? k : !1;
                a.drawGraph && (a.drawGraph(), a.applyZones());
                a.visible && a.drawPoints();
                a.drawDataLabels && a.drawDataLabels();
                a.redrawPoints && a.redrawPoints();
                a.drawTracker &&
                !1 !== a.options.enableMouseTracking && a.drawTracker();
                a.invertGroups(k);
                !1 === d.clip || a.sharedClipKey || m || x.clip(b.clipRect);
                f && a.animate();
                m || (a.animationTimeout = v(function () {
                    a.afterAnimate()
                }, f));
                a.isDirty = !1;
                a.hasRendered = !0;
                h(a, "afterRender")
            },
            redraw: function () {
                var a = this.chart, b = this.isDirty || this.isDirtyData, d = this.group, e = this.xAxis,
                    c = this.yAxis;
                d && (a.inverted && d.attr({
                    width: a.plotWidth,
                    height: a.plotHeight
                }), d.animate({translateX: f(e && e.left, a.plotLeft), translateY: f(c && c.top, a.plotTop)}));
                this.translate();
                this.render();
                b && delete this.kdTree
            },
            kdAxisArray: ["clientX", "plotY"],
            searchPoint: function (a, b) {
                var d = this.xAxis, f = this.yAxis, e = this.chart.inverted;
                return this.searchKDTree({
                    clientX: e ? d.len - a.chartY + d.pos : a.chartX - d.pos,
                    plotY: e ? f.len - a.chartX + f.pos : a.chartY - f.pos
                }, b, a)
            },
            buildKDTree: function (a) {
                function b(a, f, e) {
                    var c;
                    if (c = a && a.length) {
                        var h = d.kdAxisArray[f % e];
                        a.sort(function (a, b) {
                            return a[h] - b[h]
                        });
                        c = Math.floor(c / 2);
                        return {point: a[c], left: b(a.slice(0, c), f + 1, e), right: b(a.slice(c + 1), f + 1, e)}
                    }
                }

                this.buildingKdTree =
                    !0;
                var d = this, f = -1 < d.options.findNearestPointBy.indexOf("y") ? 2 : 1;
                delete d.kdTree;
                v(function () {
                    d.kdTree = b(d.getValidPoints(null, !d.directTouch), f, f);
                    d.buildingKdTree = !1
                }, d.options.kdNow || a && "touchstart" === a.type ? 0 : 1)
            },
            searchKDTree: function (a, b, d) {
                function f(a, b, d, m) {
                    var p = b.point, n = e.kdAxisArray[d % m], t = p;
                    var v = y(a[c]) && y(p[c]) ? Math.pow(a[c] - p[c], 2) : null;
                    var k = y(a[h]) && y(p[h]) ? Math.pow(a[h] - p[h], 2) : null;
                    k = (v || 0) + (k || 0);
                    p.dist = y(k) ? Math.sqrt(k) : Number.MAX_VALUE;
                    p.distX = y(v) ? Math.sqrt(v) : Number.MAX_VALUE;
                    n = a[n] - p[n];
                    k = 0 > n ? "left" : "right";
                    v = 0 > n ? "right" : "left";
                    b[k] && (k = f(a, b[k], d + 1, m), t = k[l] < t[l] ? k : p);
                    b[v] && Math.sqrt(n * n) < t[l] && (a = f(a, b[v], d + 1, m), t = a[l] < t[l] ? a : t);
                    return t
                }

                var e = this, c = this.kdAxisArray[0], h = this.kdAxisArray[1], l = b ? "distX" : "dist";
                b = -1 < e.options.findNearestPointBy.indexOf("y") ? 2 : 1;
                this.kdTree || this.buildingKdTree || this.buildKDTree(d);
                if (this.kdTree) return f(a, this.kdTree, b, b)
            },
            pointPlacementToXValue: function () {
                var a = this.options.pointPlacement;
                "between" === a && (a = .5);
                I(a) && (a *= f(this.options.pointRange ||
                    this.xAxis.pointRange));
                return a
            }
        });
        ""
    });
    K(B, "parts/Stacking.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.objectEach;
        g = c.Axis;
        var F = c.Chart, I = c.correctFloat, C = c.destroyObjectProperties, A = c.format, u = c.pick, z = c.Series;
        c.StackItem = function (c, k, q, g, b) {
            var a = c.chart.inverted;
            this.axis = c;
            this.isNegative = q;
            this.options = k = k || {};
            this.x = g;
            this.total = null;
            this.points = {};
            this.stack = b;
            this.rightCliff = this.leftCliff = 0;
            this.alignOptions = {
                align: k.align || (a ? q ? "left" : "right" :
                    "center"), verticalAlign: k.verticalAlign || (a ? "middle" : q ? "bottom" : "top"), y: k.y, x: k.x
            };
            this.textAlign = k.textAlign || (a ? q ? "right" : "left" : "center")
        };
        c.StackItem.prototype = {
            destroy: function () {
                C(this, this.axis)
            }, render: function (c) {
                var k = this.axis.chart, q = this.options, r = q.format;
                r = r ? A(r, this, k.time) : q.formatter.call(this);
                this.label ? this.label.attr({
                    text: r,
                    visibility: "hidden"
                }) : (this.label = k.renderer.label(r, null, null, q.shape, null, null, q.useHTML, !1, "stack-labels"), r = {
                    text: r, align: this.textAlign, rotation: q.rotation,
                    padding: u(q.padding, 0), visibility: "hidden"
                }, this.label.attr(r), k.styledMode || this.label.css(q.style), this.label.added || this.label.add(c));
                this.label.labelrank = k.plotHeight
            }, setOffset: function (c, k, q, g, b) {
                var a = this.axis, e = a.chart;
                g = a.translate(a.usePercentage ? 100 : g ? g : this.total, 0, 0, 0, 1);
                q = a.translate(q ? q : 0);
                q = y(g) && Math.abs(g - q);
                c = u(b, e.xAxis[0].translate(this.x)) + c;
                a = y(g) && this.getStackBox(e, this, c, g, k, q, a);
                k = this.label;
                c = this.isNegative;
                b = "justify" === u(this.options.overflow, "justify");
                if (k && a) {
                    q =
                        k.getBBox();
                    var h = e.inverted ? c ? q.width : 0 : q.width / 2,
                        d = e.inverted ? q.height / 2 : c ? -4 : q.height + 4;
                    this.alignOptions.x = u(this.options.x, 0);
                    k.align(this.alignOptions, null, a);
                    g = k.alignAttr;
                    k.show();
                    g.y -= d;
                    b && (g.x -= h, z.prototype.justifyDataLabel.call(this.axis, k, this.alignOptions, g, q, a), g.x += h);
                    g.x = k.alignAttr.x;
                    k.attr({x: g.x, y: g.y});
                    u(!b && this.options.crop, !0) && ((e = e.isInsidePlot(k.x + (e.inverted ? 0 : -q.width / 2), k.y) && e.isInsidePlot(k.x + (e.inverted ? c ? -q.width : q.width : q.width / 2), k.y + q.height)) || k.hide())
                }
            }, getStackBox: function (c,
                                      k, q, g, b, a, e) {
                var h = k.axis.reversed, d = c.inverted;
                c = e.height + e.pos - (d ? c.plotLeft : c.plotTop);
                k = k.isNegative && !h || !k.isNegative && h;
                return {
                    x: d ? k ? g : g - a : q,
                    y: d ? c - q - b : k ? c - g - a : c - g,
                    width: d ? a : b,
                    height: d ? b : a
                }
            }
        };
        F.prototype.getStacks = function () {
            var c = this, k = c.inverted;
            c.yAxis.forEach(function (c) {
                c.stacks && c.hasVisibleSeries && (c.oldStacks = c.stacks)
            });
            c.series.forEach(function (q) {
                var g = q.xAxis && q.xAxis.options || {};
                !q.options.stacking || !0 !== q.visible && !1 !== c.options.chart.ignoreHiddenSeries || (q.stackKey = [q.type, u(q.options.stack,
                    ""), k ? g.top : g.left, k ? g.height : g.width].join())
            })
        };
        g.prototype.buildStacks = function () {
            var c = this.series, k = u(this.options.reversedStacks, !0), q = c.length, g;
            if (!this.isXAxis) {
                this.usePercentage = !1;
                for (g = q; g--;) c[k ? g : q - g - 1].setStackedPoints();
                for (g = 0; g < q; g++) c[g].modifyStacks()
            }
        };
        g.prototype.renderStackTotals = function () {
            var c = this.chart, k = c.renderer, q = this.stacks, g = this.stackTotalGroup;
            g || (this.stackTotalGroup = g = k.g("stack-labels").attr({visibility: "visible", zIndex: 6}).add());
            g.translate(c.plotLeft, c.plotTop);
            E(q, function (b) {
                E(b, function (a) {
                    a.render(g)
                })
            })
        };
        g.prototype.resetStacks = function () {
            var c = this, k = c.stacks;
            c.isXAxis || E(k, function (k) {
                E(k, function (q, b) {
                    q.touched < c.stacksTouched ? (q.destroy(), delete k[b]) : (q.total = null, q.cumulative = null)
                })
            })
        };
        g.prototype.cleanStacks = function () {
            if (!this.isXAxis) {
                if (this.oldStacks) var c = this.stacks = this.oldStacks;
                E(c, function (c) {
                    E(c, function (c) {
                        c.cumulative = c.total
                    })
                })
            }
        };
        z.prototype.setStackedPoints = function () {
            if (this.options.stacking && (!0 === this.visible || !1 === this.chart.options.chart.ignoreHiddenSeries)) {
                var g =
                        this.processedXData, k = this.processedYData, q = [], w = k.length, b = this.options,
                    a = b.threshold, e = u(b.startFromThreshold && a, 0), h = b.stack;
                b = b.stacking;
                var d = this.stackKey, f = "-" + d, n = this.negStacks, x = this.yAxis, v = x.stacks, m = x.oldStacks,
                    l, t;
                x.stacksTouched += 1;
                for (t = 0; t < w; t++) {
                    var G = g[t];
                    var D = k[t];
                    var p = this.getStackIndicator(p, G, this.index);
                    var H = p.key;
                    var J = (l = n && D < (e ? 0 : a)) ? f : d;
                    v[J] || (v[J] = {});
                    v[J][G] || (m[J] && m[J][G] ? (v[J][G] = m[J][G], v[J][G].total = null) : v[J][G] = new c.StackItem(x, x.options.stackLabels, l, G, h));
                    J = v[J][G];
                    null !== D ? (J.points[H] = J.points[this.index] = [u(J.cumulative, e)], y(J.cumulative) || (J.base = H), J.touched = x.stacksTouched, 0 < p.index && !1 === this.singleStacks && (J.points[H][0] = J.points[this.index + "," + G + ",0"][0])) : J.points[H] = J.points[this.index] = null;
                    "percent" === b ? (l = l ? d : f, n && v[l] && v[l][G] ? (l = v[l][G], J.total = l.total = Math.max(l.total, J.total) + Math.abs(D) || 0) : J.total = I(J.total + (Math.abs(D) || 0))) : J.total = I(J.total + (D || 0));
                    J.cumulative = u(J.cumulative, e) + (D || 0);
                    null !== D && (J.points[H].push(J.cumulative),
                        q[t] = J.cumulative)
                }
                "percent" === b && (x.usePercentage = !0);
                this.stackedYData = q;
                x.oldStacks = {}
            }
        };
        z.prototype.modifyStacks = function () {
            var c = this, k = c.stackKey, q = c.yAxis.stacks, g = c.processedXData, b, a = c.options.stacking;
            c[a + "Stacker"] && [k, "-" + k].forEach(function (e) {
                for (var h = g.length, d, f; h--;) if (d = g[h], b = c.getStackIndicator(b, d, c.index, e), f = (d = q[e] && q[e][d]) && d.points[b.key]) c[a + "Stacker"](f, d, h)
            })
        };
        z.prototype.percentStacker = function (c, k, q) {
            k = k.total ? 100 / k.total : 0;
            c[0] = I(c[0] * k);
            c[1] = I(c[1] * k);
            this.stackedYData[q] =
                c[1]
        };
        z.prototype.getStackIndicator = function (c, k, q, g) {
            !y(c) || c.x !== k || g && c.key !== g ? c = {x: k, index: 0, key: g} : c.index++;
            c.key = [q, k, c.index].join();
            return c
        }
    });
    K(B, "parts/Dynamics.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.erase, F = g.isArray, I = g.isNumber, C = g.isObject, A = g.isString, u = g.objectEach,
            z = g.splat, r = c.addEvent, k = c.animate, q = c.Axis;
        g = c.Chart;
        var w = c.createElement, b = c.css, a = c.extend, e = c.fireEvent, h = c.merge, d = c.pick, f = c.Point,
            n = c.Series, x = c.seriesTypes, v = c.setAnimation;
        c.cleanRecursively = function (a, b) {
            var d = {};
            u(a, function (f, e) {
                if (C(a[e], !0) && !a.nodeType && b[e]) f = c.cleanRecursively(a[e], b[e]), Object.keys(f).length && (d[e] = f); else if (C(a[e]) || a[e] !== b[e]) d[e] = a[e]
            });
            return d
        };
        a(g.prototype, {
            addSeries: function (a, b, f) {
                var c, h = this;
                a && (b = d(b, !0), e(h, "addSeries", {options: a}, function () {
                    c = h.initSeries(a);
                    h.isDirtyLegend = !0;
                    h.linkSeries();
                    e(h, "afterAddSeries", {series: c});
                    b && h.redraw(f)
                }));
                return c
            },
            addAxis: function (a, b, d, f) {
                return this.createAxis(b ? "xAxis" : "yAxis", {
                    axis: a,
                    redraw: d, animation: f
                })
            },
            addColorAxis: function (a, b, d) {
                return this.createAxis("colorAxis", {axis: a, redraw: b, animation: d})
            },
            createAxis: function (a, b) {
                var f = this.options, e = "colorAxis" === a, l = b.redraw, m = b.animation;
                b = h(b.axis, {index: this[a].length, isX: "xAxis" === a});
                var n = e ? new c.ColorAxis(this, b) : new q(this, b);
                f[a] = z(f[a] || {});
                f[a].push(b);
                e && (this.isDirtyLegend = !0);
                d(l, !0) && this.redraw(m);
                return n
            },
            showLoading: function (f) {
                var e = this, c = e.options, h = e.loadingDiv, m = c.loading, p = function () {
                    h && b(h, {
                        left: e.plotLeft +
                        "px", top: e.plotTop + "px", width: e.plotWidth + "px", height: e.plotHeight + "px"
                    })
                };
                h || (e.loadingDiv = h = w("div", {className: "highcharts-loading highcharts-loading-hidden"}, null, e.container), e.loadingSpan = w("span", {className: "highcharts-loading-inner"}, null, h), r(e, "redraw", p));
                h.className = "highcharts-loading";
                e.loadingSpan.innerHTML = d(f, c.lang.loading, "");
                e.styledMode || (b(h, a(m.style, {zIndex: 10})), b(e.loadingSpan, m.labelStyle), e.loadingShown || (b(h, {
                    opacity: 0,
                    display: ""
                }), k(h, {opacity: m.style.opacity || .5}, {
                    duration: m.showDuration ||
                    0
                })));
                e.loadingShown = !0;
                p()
            },
            hideLoading: function () {
                var a = this.options, d = this.loadingDiv;
                d && (d.className = "highcharts-loading highcharts-loading-hidden", this.styledMode || k(d, {opacity: 0}, {
                    duration: a.loading.hideDuration || 100,
                    complete: function () {
                        b(d, {display: "none"})
                    }
                }));
                this.loadingShown = !1
            },
            propsRequireDirtyBox: "backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),
            propsRequireReflow: "margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),
            propsRequireUpdateSeries: "chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),
            collectionsWithUpdate: "xAxis yAxis zAxis series colorAxis pane".split(" "),
            update: function (a, b, f, n) {
                var l = this,
                    m = {credits: "addCredits", title: "setTitle", subtitle: "setSubtitle", caption: "setCaption"}, t,
                    v, k, x = a.isResponsiveOptions, q = [];
                e(l, "update", {options: a});
                x || l.setResponsive(!1, !0);
                a = c.cleanRecursively(a, l.options);
                h(!0, l.userOptions, a);
                if (t = a.chart) {
                    h(!0, l.options.chart,
                        t);
                    "className" in t && l.setClassName(t.className);
                    "reflow" in t && l.setReflow(t.reflow);
                    if ("inverted" in t || "polar" in t || "type" in t) {
                        l.propFromSeries();
                        var g = !0
                    }
                    "alignTicks" in t && (g = !0);
                    u(t, function (a, b) {
                        -1 !== l.propsRequireUpdateSeries.indexOf("chart." + b) && (v = !0);
                        -1 !== l.propsRequireDirtyBox.indexOf(b) && (l.isDirtyBox = !0);
                        x || -1 === l.propsRequireReflow.indexOf(b) || (k = !0)
                    });
                    !l.styledMode && "style" in t && l.renderer.setStyle(t.style)
                }
                !l.styledMode && a.colors && (this.options.colors = a.colors);
                a.plotOptions && h(!0, this.options.plotOptions,
                    a.plotOptions);
                a.time && this.time === c.time && (this.time = new c.Time(a.time));
                u(a, function (a, b) {
                    if (l[b] && "function" === typeof l[b].update) l[b].update(a, !1); else if ("function" === typeof l[m[b]]) l[m[b]](a);
                    "chart" !== b && -1 !== l.propsRequireUpdateSeries.indexOf(b) && (v = !0)
                });
                this.collectionsWithUpdate.forEach(function (b) {
                    if (a[b]) {
                        if ("series" === b) {
                            var e = [];
                            l[b].forEach(function (a, b) {
                                a.options.isInternal || e.push(d(a.options.index, b))
                            })
                        }
                        z(a[b]).forEach(function (a, d) {
                            (d = y(a.id) && l.get(a.id) || l[b][e ? e[d] : d]) && d.coll ===
                            b && (d.update(a, !1), f && (d.touched = !0));
                            !d && f && l.collectionsWithInit[b] && (l.collectionsWithInit[b][0].apply(l, [a].concat(l.collectionsWithInit[b][1] || []).concat([!1])).touched = !0)
                        });
                        f && l[b].forEach(function (a) {
                            a.touched || a.options.isInternal ? delete a.touched : q.push(a)
                        })
                    }
                });
                q.forEach(function (a) {
                    a.remove && a.remove(!1)
                });
                g && l.axes.forEach(function (a) {
                    a.update({}, !1)
                });
                v && l.series.forEach(function (a) {
                    a.update({}, !1)
                });
                a.loading && h(!0, l.options.loading, a.loading);
                g = t && t.width;
                t = t && t.height;
                A(t) && (t = c.relativeLength(t,
                    g || l.chartWidth));
                k || I(g) && g !== l.chartWidth || I(t) && t !== l.chartHeight ? l.setSize(g, t, n) : d(b, !0) && l.redraw(n);
                e(l, "afterUpdate", {options: a, redraw: b, animation: n})
            },
            setSubtitle: function (a, b) {
                this.applyDescription("subtitle", a);
                this.layOutTitles(b)
            },
            setCaption: function (a, b) {
                this.applyDescription("caption", a);
                this.layOutTitles(b)
            }
        });
        g.prototype.collectionsWithInit = {
            xAxis: [g.prototype.addAxis, [!0]],
            yAxis: [g.prototype.addAxis, [!1]],
            colorAxis: [g.prototype.addColorAxis, [!1]],
            series: [g.prototype.addSeries]
        };
        a(f.prototype, {
            update: function (a, b, f, e) {
                function c() {
                    h.applyOptions(a);
                    null === h.y && m && (h.graphic = m.destroy());
                    C(a, !0) && (m && m.element && a && a.marker && void 0 !== a.marker.symbol && (h.graphic = m.destroy()), a && a.dataLabels && h.dataLabel && (h.dataLabel = h.dataLabel.destroy()), h.connector && (h.connector = h.connector.destroy()));
                    n = h.index;
                    l.updateParallelArrays(h, n);
                    v.data[n] = C(v.data[n], !0) || C(a, !0) ? h.options : d(a, v.data[n]);
                    l.isDirty = l.isDirtyData = !0;
                    !l.fixedBox && l.hasCartesianSeries && (t.isDirtyBox = !0);
                    "point" ===
                    v.legendType && (t.isDirtyLegend = !0);
                    b && t.redraw(f)
                }

                var h = this, l = h.series, m = h.graphic, n, t = l.chart, v = l.options;
                b = d(b, !0);
                !1 === e ? c() : h.firePointEvent("update", {options: a}, c)
            }, remove: function (a, b) {
                this.series.removePoint(this.series.data.indexOf(this), a, b)
            }
        });
        a(n.prototype, {
            addPoint: function (a, b, f, c, h) {
                var l = this.options, m = this.data, n = this.chart, t = this.xAxis;
                t = t && t.hasNames && t.names;
                var v = l.data, k = this.xData, x;
                b = d(b, !0);
                var D = {series: this};
                this.pointClass.prototype.applyOptions.apply(D, [a]);
                var g = D.x;
                var q = k.length;
                if (this.requireSorting && g < k[q - 1]) for (x = !0; q && k[q - 1] > g;) q--;
                this.updateParallelArrays(D, "splice", q, 0, 0);
                this.updateParallelArrays(D, q);
                t && D.name && (t[g] = D.name);
                v.splice(q, 0, a);
                x && (this.data.splice(q, 0, null), this.processData());
                "point" === l.legendType && this.generatePoints();
                f && (m[0] && m[0].remove ? m[0].remove(!1) : (m.shift(), this.updateParallelArrays(D, "shift"), v.shift()));
                !1 !== h && e(this, "addPoint", {point: D});
                this.isDirtyData = this.isDirty = !0;
                b && n.redraw(c)
            }, removePoint: function (a, b, f) {
                var e =
                    this, c = e.data, h = c[a], l = e.points, m = e.chart, n = function () {
                    l && l.length === c.length && l.splice(a, 1);
                    c.splice(a, 1);
                    e.options.data.splice(a, 1);
                    e.updateParallelArrays(h || {series: e}, "splice", a, 1);
                    h && h.destroy();
                    e.isDirty = !0;
                    e.isDirtyData = !0;
                    b && m.redraw()
                };
                v(f, m);
                b = d(b, !0);
                h ? h.firePointEvent("remove", null, n) : n()
            }, remove: function (a, b, f, c) {
                function h() {
                    l.destroy(c);
                    l.remove = null;
                    m.isDirtyLegend = m.isDirtyBox = !0;
                    m.linkSeries();
                    d(a, !0) && m.redraw(b)
                }

                var l = this, m = l.chart;
                !1 !== f ? e(l, "remove", null, h) : h()
            }, update: function (b,
                                 f) {
                b = c.cleanRecursively(b, this.userOptions);
                e(this, "update", {options: b});
                var l = this, m = l.chart, n = l.userOptions, p = l.initialType || l.type,
                    v = b.type || n.type || m.options.chart.type,
                    k = !(this.hasDerivedData || b.dataGrouping || v && v !== this.type || void 0 !== b.pointStart || b.pointInterval || b.pointIntervalUnit || b.keys),
                    q = x[p].prototype, g, r = ["group", "markerGroup", "dataLabelsGroup", "transformGroup"],
                    u = ["eventOptions", "navigatorSeries", "baseSeries"], w = l.finishedAnimating && {animation: !1},
                    z = {};
                k && (u.push("data", "isDirtyData",
                    "points", "processedXData", "processedYData", "xIncrement", "_hasPointMarkers", "_hasPointLabels", "mapMap", "mapData", "minY", "maxY", "minX", "maxX"), !1 !== b.visible && u.push("area", "graph"), l.parallelArrays.forEach(function (a) {
                    u.push(a + "Data")
                }), b.data && this.setData(b.data, !1));
                b = h(n, w, {
                    index: void 0 === n.index ? l.index : n.index,
                    pointStart: d(n.pointStart, l.xData[0])
                }, !k && {data: l.options.data}, b);
                k && b.data && (b.data = l.options.data);
                u = r.concat(u);
                u.forEach(function (a) {
                    u[a] = l[a];
                    delete l[a]
                });
                l.remove(!1, null, !1, !0);
                for (g in q) l[g] = void 0;
                x[v || p] ? a(l, x[v || p].prototype) : c.error(17, !0, m);
                u.forEach(function (a) {
                    l[a] = u[a]
                });
                l.init(m, b);
                if (k && this.points) {
                    var A = l.options;
                    !1 === A.visible ? (z.graphic = 1, z.dataLabel = 1) : l._hasPointLabels || (v = A.marker, q = A.dataLabels, v && (!1 === v.enabled || "symbol" in v) && (z.graphic = 1), q && !1 === q.enabled && (z.dataLabel = 1));
                    this.points.forEach(function (a) {
                        a && a.series && (a.resolveColor(), Object.keys(z).length && a.destroyElements(z), !1 === A.showInLegend && a.legendItem && m.legend.destroyItem(a))
                    }, this)
                }
                b.zIndex !==
                n.zIndex && r.forEach(function (a) {
                    l[a] && l[a].attr({zIndex: b.zIndex})
                });
                l.initialType = p;
                m.linkSeries();
                e(this, "afterUpdate");
                d(f, !0) && m.redraw(k ? void 0 : !1)
            }, setName: function (a) {
                this.name = this.options.name = this.userOptions.name = a;
                this.chart.isDirtyLegend = !0
            }
        });
        a(q.prototype, {
            update: function (b, f) {
                var e = this.chart, c = b && b.events || {};
                b = h(this.userOptions, b);
                e.options[this.coll].indexOf && (e.options[this.coll][e.options[this.coll].indexOf(this.userOptions)] = b);
                u(e.options[this.coll].events, function (a, b) {
                    "undefined" ===
                    typeof c[b] && (c[b] = void 0)
                });
                this.destroy(!0);
                this.init(e, a(b, {events: c}));
                e.isDirtyBox = !0;
                d(f, !0) && e.redraw()
            }, remove: function (a) {
                for (var b = this.chart, f = this.coll, e = this.series, c = e.length; c--;) e[c] && e[c].remove(!1);
                E(b.axes, this);
                E(b[f], this);
                F(b.options[f]) ? b.options[f].splice(this.options.index, 1) : delete b.options[f];
                b[f].forEach(function (a, b) {
                    a.options.index = a.userOptions.index = b
                });
                this.destroy();
                b.isDirtyBox = !0;
                d(a, !0) && b.redraw()
            }, setTitle: function (a, b) {
                this.update({title: a}, b)
            }, setCategories: function (a,
                                        b) {
                this.update({categories: a}, b)
            }
        })
    });
    K(B, "parts/AreaSeries.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.objectEach, E = c.color, F = c.pick, I = c.Series;
        g = c.seriesType;
        g("area", "line", {softThreshold: !1, threshold: 0}, {
            singleStacks: !1, getStackPoints: function (c) {
                var g = [], u = [], z = this.xAxis, r = this.yAxis, k = r.stacks[this.stackKey], q = {}, w = this.index,
                    b = r.series, a = b.length, e = F(r.options.reversedStacks, !0) ? 1 : -1, h;
                c = c || this.points;
                if (this.options.stacking) {
                    for (h = 0; h < c.length; h++) c[h].leftNull =
                        c[h].rightNull = null, q[c[h].x] = c[h];
                    y(k, function (a, b) {
                        null !== a.total && u.push(b)
                    });
                    u.sort(function (a, b) {
                        return a - b
                    });
                    var d = b.map(function (a) {
                        return a.visible
                    });
                    u.forEach(function (b, c) {
                        var f = 0, n, m;
                        if (q[b] && !q[b].isNull) g.push(q[b]), [-1, 1].forEach(function (f) {
                            var l = 1 === f ? "rightNull" : "leftNull", v = 0, x = k[u[c + f]];
                            if (x) for (h = w; 0 <= h && h < a;) n = x.points[h], n || (h === w ? q[b][l] = !0 : d[h] && (m = k[b].points[h]) && (v -= m[1] - m[0])), h += e;
                            q[b][1 === f ? "rightCliff" : "leftCliff"] = v
                        }); else {
                            for (h = w; 0 <= h && h < a;) {
                                if (n = k[b].points[h]) {
                                    f =
                                        n[1];
                                    break
                                }
                                h += e
                            }
                            f = r.translate(f, 0, 1, 0, 1);
                            g.push({isNull: !0, plotX: z.translate(b, 0, 0, 0, 1), x: b, plotY: f, yBottom: f})
                        }
                    })
                }
                return g
            }, getGraphPath: function (g) {
                var A = I.prototype.getGraphPath, u = this.options, z = u.stacking, r = this.yAxis, k, q = [], w = [],
                    b = this.index, a = r.stacks[this.stackKey], e = u.threshold,
                    h = Math.round(r.getThreshold(u.threshold));
                u = c.pick(u.connectNulls, "percent" === z);
                var d = function (d, f, c) {
                    var l = g[d];
                    d = z && a[l.x].points[b];
                    var m = l[c + "Null"] || 0;
                    c = l[c + "Cliff"] || 0;
                    l = !0;
                    if (c || m) {
                        var v = (m ? d[0] : d[1]) + c;
                        var p =
                            d[0] + c;
                        l = !!m
                    } else !z && g[f] && g[f].isNull && (v = p = e);
                    void 0 !== v && (w.push({
                        plotX: n,
                        plotY: null === v ? h : r.getThreshold(v),
                        isNull: l,
                        isCliff: !0
                    }), q.push({plotX: n, plotY: null === p ? h : r.getThreshold(p), doCurve: !1}))
                };
                g = g || this.points;
                z && (g = this.getStackPoints(g));
                for (k = 0; k < g.length; k++) {
                    var f = g[k].isNull;
                    var n = F(g[k].rectPlotX, g[k].plotX);
                    var x = F(g[k].yBottom, h);
                    if (!f || u) u || d(k, k - 1, "left"), f && !z && u || (w.push(g[k]), q.push({
                        x: k,
                        plotX: n,
                        plotY: x
                    })), u || d(k, k + 1, "right")
                }
                k = A.call(this, w, !0, !0);
                q.reversed = !0;
                f = A.call(this,
                    q, !0, !0);
                f.length && (f[0] = "L");
                f = k.concat(f);
                A = A.call(this, w, !1, u);
                f.xMap = k.xMap;
                this.areaPath = f;
                return A
            }, drawGraph: function () {
                this.areaPath = [];
                I.prototype.drawGraph.apply(this);
                var c = this, g = this.areaPath, u = this.options,
                    z = [["area", "highcharts-area", this.color, u.fillColor]];
                this.zones.forEach(function (g, k) {
                    z.push(["zone-area-" + k, "highcharts-area highcharts-zone-area-" + k + " " + g.className, g.color || c.color, g.fillColor || u.fillColor])
                });
                z.forEach(function (r) {
                    var k = r[0], q = c[k], w = q ? "animate" : "attr", b = {};
                    q ?
                        (q.endX = c.preventGraphAnimation ? null : g.xMap, q.animate({d: g})) : (b.zIndex = 0, q = c[k] = c.chart.renderer.path(g).addClass(r[1]).add(c.group), q.isArea = !0);
                    c.chart.styledMode || (b.fill = F(r[3], E(r[2]).setOpacity(F(u.fillOpacity, .75)).get()));
                    q[w](b);
                    q.startX = g.xMap;
                    q.shiftUnit = u.step ? 2 : 1
                })
            }, drawLegendSymbol: c.LegendSymbolMixin.drawRectangle
        });
        ""
    });
    K(B, "parts/SplineSeries.js", [B["parts/Globals.js"]], function (c) {
        var g = c.pick;
        c = c.seriesType;
        c("spline", "line", {}, {
            getPointSpline: function (c, E, F) {
                var y = E.plotX, C = E.plotY,
                    A = c[F - 1];
                F = c[F + 1];
                if (A && !A.isNull && !1 !== A.doCurve && !E.isCliff && F && !F.isNull && !1 !== F.doCurve && !E.isCliff) {
                    c = A.plotY;
                    var u = F.plotX;
                    F = F.plotY;
                    var z = 0;
                    var r = (1.5 * y + A.plotX) / 2.5;
                    var k = (1.5 * C + c) / 2.5;
                    u = (1.5 * y + u) / 2.5;
                    var q = (1.5 * C + F) / 2.5;
                    u !== r && (z = (q - k) * (u - y) / (u - r) + C - q);
                    k += z;
                    q += z;
                    k > c && k > C ? (k = Math.max(c, C), q = 2 * C - k) : k < c && k < C && (k = Math.min(c, C), q = 2 * C - k);
                    q > F && q > C ? (q = Math.max(F, C), k = 2 * C - q) : q < F && q < C && (q = Math.min(F, C), k = 2 * C - q);
                    E.rightContX = u;
                    E.rightContY = q
                }
                E = ["C", g(A.rightContX, A.plotX), g(A.rightContY, A.plotY), g(r,
                    y), g(k, C), y, C];
                A.rightContX = A.rightContY = null;
                return E
            }
        });
        ""
    });
    K(B, "parts/AreaSplineSeries.js", [B["parts/Globals.js"]], function (c) {
        var g = c.seriesTypes.area.prototype, y = c.seriesType;
        y("areaspline", "spline", c.defaultPlotOptions.area, {
            getStackPoints: g.getStackPoints,
            getGraphPath: g.getGraphPath,
            drawGraph: g.drawGraph,
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle
        });
        ""
    });
    K(B, "parts/ColumnSeries.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, F = c.animObject,
            I = c.color, C = c.extend, A = c.merge, u = c.pick, z = c.Series;
        g = c.seriesType;
        var r = c.svg;
        g("column", "line", {
            borderRadius: 0,
            crisp: !0,
            groupPadding: .2,
            marker: null,
            pointPadding: .1,
            minPointLength: 0,
            cropThreshold: 50,
            pointRange: null,
            states: {hover: {halo: !1, brightness: .1}, select: {color: "#cccccc", borderColor: "#000000"}},
            dataLabels: {align: null, verticalAlign: null, y: null},
            softThreshold: !1,
            startFromThreshold: !0,
            stickyTracking: !1,
            tooltip: {distance: 6},
            threshold: 0,
            borderColor: "#ffffff"
        }, {
            cropShoulder: 0, directTouch: !0, trackerGroups: ["group",
                "dataLabelsGroup"], negStacks: !0, init: function () {
                z.prototype.init.apply(this, arguments);
                var c = this, g = c.chart;
                g.hasRendered && g.series.forEach(function (k) {
                    k.type === c.type && (k.isDirty = !0)
                })
            }, getColumnMetrics: function () {
                var c = this, g = c.options, r = c.xAxis, b = c.yAxis, a = r.options.reversedStacks;
                a = r.reversed && !a || !r.reversed && a;
                var e, h = {}, d = 0;
                !1 === g.grouping ? d = 1 : c.chart.series.forEach(function (a) {
                    var f = a.yAxis, l = a.options;
                    if (a.type === c.type && (a.visible || !c.chart.options.chart.ignoreHiddenSeries) && b.len === f.len &&
                        b.pos === f.pos) {
                        if (l.stacking) {
                            e = a.stackKey;
                            void 0 === h[e] && (h[e] = d++);
                            var n = h[e]
                        } else !1 !== l.grouping && (n = d++);
                        a.columnIndex = n
                    }
                });
                var f = Math.min(Math.abs(r.transA) * (r.ordinalSlope || g.pointRange || r.closestPointRange || r.tickInterval || 1), r.len),
                    n = f * g.groupPadding, x = (f - 2 * n) / (d || 1);
                g = Math.min(g.maxPointWidth || r.len, u(g.pointWidth, x * (1 - 2 * g.pointPadding)));
                c.columnMetrics = {
                    width: g,
                    offset: (x - g) / 2 + (n + ((c.columnIndex || 0) + (a ? 1 : 0)) * x - f / 2) * (a ? -1 : 1)
                };
                return c.columnMetrics
            }, crispCol: function (c, g, r, b) {
                var a = this.chart,
                    e = this.borderWidth, h = -(e % 2 ? .5 : 0);
                e = e % 2 ? .5 : 1;
                a.inverted && a.renderer.isVML && (e += 1);
                this.options.crisp && (r = Math.round(c + r) + h, c = Math.round(c) + h, r -= c);
                b = Math.round(g + b) + e;
                h = .5 >= Math.abs(g) && .5 < b;
                g = Math.round(g) + e;
                b -= g;
                h && b && (--g, b += 1);
                return {x: c, y: g, width: r, height: b}
            }, translate: function () {
                var c = this, g = c.chart, r = c.options, b = c.dense = 2 > c.closestPointRange * c.xAxis.transA;
                b = c.borderWidth = u(r.borderWidth, b ? 0 : 1);
                var a = c.yAxis, e = r.threshold, h = c.translatedThreshold = a.getThreshold(e),
                    d = u(r.minPointLength, 5), f = c.getColumnMetrics(),
                    n = f.width, x = c.barW = Math.max(n, 1 + 2 * b), v = c.pointXOffset = f.offset, m = c.dataMin,
                    l = c.dataMax;
                g.inverted && (h -= .5);
                r.pointPadding && (x = Math.ceil(x));
                z.prototype.translate.apply(c);
                c.points.forEach(function (b) {
                    var f = u(b.yBottom, h), t = 999 + Math.abs(f), p = n;
                    t = Math.min(Math.max(-t, b.plotY), a.len + t);
                    var k = b.plotX + v, q = x, r = Math.min(t, f), w = Math.max(t, f) - r;
                    if (d && Math.abs(w) < d) {
                        w = d;
                        var z = !a.reversed && !b.negative || a.reversed && b.negative;
                        b.y === e && c.dataMax <= e && a.min < e && m !== l && (z = !z);
                        r = Math.abs(r - h) > d ? f - d : h - (z ? d : 0)
                    }
                    y(b.options.pointWidth) &&
                    (p = q = Math.ceil(b.options.pointWidth), k -= Math.round((p - n) / 2));
                    b.barX = k;
                    b.pointWidth = p;
                    b.tooltipPos = g.inverted ? [a.len + a.pos - g.plotLeft - t, c.xAxis.len - k - q / 2, w] : [k + q / 2, t + a.pos - g.plotTop, w];
                    b.shapeType = c.pointClass.prototype.shapeType || "rect";
                    b.shapeArgs = c.crispCol.apply(c, b.isNull ? [k, h, q, 0] : [k, r, q, w])
                })
            }, getSymbol: c.noop, drawLegendSymbol: c.LegendSymbolMixin.drawRectangle, drawGraph: function () {
                this.group[this.dense ? "addClass" : "removeClass"]("highcharts-dense-data")
            }, pointAttribs: function (c, g) {
                var k = this.options,
                    b = this.pointAttrToOptions || {};
                var a = b.stroke || "borderColor";
                var e = b["stroke-width"] || "borderWidth", h = c && c.color || this.color,
                    d = c && c[a] || k[a] || this.color || h, f = c && c[e] || k[e] || this[e] || 0;
                b = c && c.options.dashStyle || k.dashStyle;
                var n = u(k.opacity, 1);
                if (c && this.zones.length) {
                    var x = c.getZone();
                    h = c.options.color || x && (x.color || c.nonZonedColor) || this.color;
                    x && (d = x.borderColor || d, b = x.dashStyle || b, f = x.borderWidth || f)
                }
                g && (c = A(k.states[g], c.options.states && c.options.states[g] || {}), g = c.brightness, h = c.color || void 0 !==
                    g && I(h).brighten(c.brightness).get() || h, d = c[a] || d, f = c[e] || f, b = c.dashStyle || b, n = u(c.opacity, n));
                a = {fill: h, stroke: d, "stroke-width": f, opacity: n};
                b && (a.dashstyle = b);
                return a
            }, drawPoints: function () {
                var c = this, g = this.chart, r = c.options, b = g.renderer, a = r.animationLimit || 250, e;
                c.points.forEach(function (h) {
                    var d = h.graphic, f = d && g.pointCount < a ? "animate" : "attr";
                    if (E(h.plotY) && null !== h.y) {
                        e = h.shapeArgs;
                        d && d.element.nodeName !== h.shapeType && (d = d.destroy());
                        if (d) d[f](A(e)); else h.graphic = d = b[h.shapeType](e).add(h.group ||
                            c.group);
                        if (r.borderRadius) d[f]({r: r.borderRadius});
                        g.styledMode || d[f](c.pointAttribs(h, h.selected && "select")).shadow(!1 !== h.allowShadow && r.shadow, null, r.stacking && !r.borderRadius);
                        d.addClass(h.getClassName(), !0)
                    } else d && (h.graphic = d.destroy())
                })
            }, animate: function (c) {
                var g = this, k = this.yAxis, b = g.options, a = this.chart.inverted, e = {},
                    h = a ? "translateX" : "translateY";
                if (r) if (c) e.scaleY = .001, c = Math.min(k.pos + k.len, Math.max(k.pos, k.toPixels(b.threshold))), a ? e.translateX = c - k.len : e.translateY = c, g.clipBox && g.setClip(),
                    g.group.attr(e); else {
                    var d = g.group.attr(h);
                    g.group.animate({scaleY: 1}, C(F(g.options.animation), {
                        step: function (a, b) {
                            e[h] = d + b.pos * (k.pos - d);
                            g.group.attr(e)
                        }
                    }));
                    g.animate = null
                }
            }, remove: function () {
                var c = this, g = c.chart;
                g.hasRendered && g.series.forEach(function (g) {
                    g.type === c.type && (g.isDirty = !0)
                });
                z.prototype.remove.apply(c, arguments)
            }
        });
        ""
    });
    K(B, "parts/BarSeries.js", [B["parts/Globals.js"]], function (c) {
        c = c.seriesType;
        c("bar", "column", null, {inverted: !0});
        ""
    });
    K(B, "parts/ScatterSeries.js", [B["parts/Globals.js"]],
        function (c) {
            var g = c.Series, y = c.seriesType;
            y("scatter", "line", {
                lineWidth: 0,
                findNearestPointBy: "xy",
                jitter: {x: 0, y: 0},
                marker: {enabled: !0},
                tooltip: {
                    headerFormat: '<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',
                    pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"
                }
            }, {
                sorted: !1,
                requireSorting: !1,
                noSharedTooltip: !0,
                trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
                takeOrdinalPosition: !1,
                drawGraph: function () {
                    this.options.lineWidth &&
                    g.prototype.drawGraph.call(this)
                },
                applyJitter: function () {
                    var c = this, g = this.options.jitter, y = this.points.length;
                    g && this.points.forEach(function (C, A) {
                        ["x", "y"].forEach(function (u, z) {
                            var r = "plot" + u.toUpperCase();
                            if (g[u] && !C.isNull) {
                                var k = c[u + "Axis"];
                                var q = g[u] * k.transA;
                                if (k && !k.isLog) {
                                    var w = Math.max(0, C[r] - q);
                                    k = Math.min(k.len, C[r] + q);
                                    z = 1E4 * Math.sin(A + z * y);
                                    C[r] = w + (k - w) * (z - Math.floor(z));
                                    "x" === u && (C.clientX = C.plotX)
                                }
                            }
                        })
                    })
                }
            });
            c.addEvent(g, "afterTranslate", function () {
                this.applyJitter && this.applyJitter()
            });
            ""
        });
    K(B, "mixins/centered-series.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isNumber, E = c.deg2rad, F = c.pick, I = c.relativeLength;
        c.CenteredSeriesMixin = {
            getCenter: function () {
                var c = this.options, g = this.chart, u = 2 * (c.slicedOffset || 0), z = g.plotWidth - 2 * u;
                g = g.plotHeight - 2 * u;
                var r = c.center;
                r = [F(r[0], "50%"), F(r[1], "50%"), c.size || "100%", c.innerSize || 0];
                var k = Math.min(z, g), q;
                for (q = 0; 4 > q; ++q) {
                    var w = r[q];
                    c = 2 > q || 2 === q && /%$/.test(w);
                    r[q] = I(w, [z, g, k, r[2]][q]) + (c ? u : 0)
                }
                r[3] > r[2] && (r[3] = r[2]);
                return r
            }, getStartAndEndRadians: function (c, g) {
                c = y(c) ? c : 0;
                g = y(g) && g > c && 360 > g - c ? g : c + 360;
                return {start: E * (c + -90), end: E * (g + -90)}
            }
        }
    });
    K(B, "parts/PieSeries.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, F = c.addEvent;
        g = c.CenteredSeriesMixin;
        var I = g.getStartAndEndRadians, C = c.merge, A = c.noop, u = c.pick, z = c.Point, r = c.Series,
            k = c.seriesType, q = c.fireEvent, w = c.setAnimation;
        k("pie", "line", {
            center: [null, null],
            clip: !1,
            colorByPoint: !0,
            dataLabels: {
                allowOverlap: !0, connectorPadding: 5,
                distance: 30, enabled: !0, formatter: function () {
                    return this.point.isNull ? void 0 : this.point.name
                }, softConnector: !0, x: 0, connectorShape: "fixedOffset", crookDistance: "70%"
            },
            fillColor: void 0,
            ignoreHiddenPoint: !0,
            inactiveOtherPoints: !0,
            legendType: "point",
            marker: null,
            size: null,
            showInLegend: !1,
            slicedOffset: 10,
            stickyTracking: !1,
            tooltip: {followPointer: !0},
            borderColor: "#ffffff",
            borderWidth: 1,
            states: {hover: {brightness: .1}}
        }, {
            isCartesian: !1,
            requireSorting: !1,
            directTouch: !0,
            noSharedTooltip: !0,
            trackerGroups: ["group",
                "dataLabelsGroup"],
            axisTypes: [],
            pointAttribs: c.seriesTypes.column.prototype.pointAttribs,
            animate: function (b) {
                var a = this, c = a.points, h = a.startAngleRad;
                b || (c.forEach(function (b) {
                    var d = b.graphic, c = b.shapeArgs;
                    d && (d.attr({r: b.startR || a.center[3] / 2, start: h, end: h}), d.animate({
                        r: c.r,
                        start: c.start,
                        end: c.end
                    }, a.options.animation))
                }), a.animate = null)
            },
            hasData: function () {
                return !!this.processedXData.length
            },
            updateTotals: function () {
                var b, a = 0, c = this.points, h = c.length, d = this.options.ignoreHiddenPoint;
                for (b = 0; b < h; b++) {
                    var f =
                        c[b];
                    a += d && !f.visible ? 0 : f.isNull ? 0 : f.y
                }
                this.total = a;
                for (b = 0; b < h; b++) f = c[b], f.percentage = 0 < a && (f.visible || !d) ? f.y / a * 100 : 0, f.total = a
            },
            generatePoints: function () {
                r.prototype.generatePoints.call(this);
                this.updateTotals()
            },
            getX: function (b, a, c) {
                var e = this.center, d = this.radii ? this.radii[c.index] : e[2] / 2;
                return e[0] + (a ? -1 : 1) * Math.cos(Math.asin(Math.max(Math.min((b - e[1]) / (d + c.labelDistance), 1), -1))) * (d + c.labelDistance) + (0 < c.labelDistance ? (a ? -1 : 1) * this.options.dataLabels.padding : 0)
            },
            translate: function (b) {
                this.generatePoints();
                var a = 0, e = this.options, h = e.slicedOffset, d = h + (e.borderWidth || 0),
                    f = I(e.startAngle, e.endAngle), n = this.startAngleRad = f.start;
                f = (this.endAngleRad = f.end) - n;
                var g = this.points, v = e.dataLabels.distance;
                e = e.ignoreHiddenPoint;
                var m, l = g.length;
                b || (this.center = b = this.getCenter());
                for (m = 0; m < l; m++) {
                    var t = g[m];
                    var k = n + a * f;
                    if (!e || t.visible) a += t.percentage / 100;
                    var D = n + a * f;
                    t.shapeType = "arc";
                    t.shapeArgs = {
                        x: b[0],
                        y: b[1],
                        r: b[2] / 2,
                        innerR: b[3] / 2,
                        start: Math.round(1E3 * k) / 1E3,
                        end: Math.round(1E3 * D) / 1E3
                    };
                    t.labelDistance = u(t.options.dataLabels &&
                        t.options.dataLabels.distance, v);
                    t.labelDistance = c.relativeLength(t.labelDistance, t.shapeArgs.r);
                    this.maxLabelDistance = Math.max(this.maxLabelDistance || 0, t.labelDistance);
                    D = (D + k) / 2;
                    D > 1.5 * Math.PI ? D -= 2 * Math.PI : D < -Math.PI / 2 && (D += 2 * Math.PI);
                    t.slicedTranslation = {
                        translateX: Math.round(Math.cos(D) * h),
                        translateY: Math.round(Math.sin(D) * h)
                    };
                    var p = Math.cos(D) * b[2] / 2;
                    var r = Math.sin(D) * b[2] / 2;
                    t.tooltipPos = [b[0] + .7 * p, b[1] + .7 * r];
                    t.half = D < -Math.PI / 2 || D > Math.PI / 2 ? 1 : 0;
                    t.angle = D;
                    k = Math.min(d, t.labelDistance / 5);
                    t.labelPosition =
                        {
                            natural: {
                                x: b[0] + p + Math.cos(D) * t.labelDistance,
                                y: b[1] + r + Math.sin(D) * t.labelDistance
                            },
                            "final": {},
                            alignment: 0 > t.labelDistance ? "center" : t.half ? "right" : "left",
                            connectorPosition: {
                                breakAt: {x: b[0] + p + Math.cos(D) * k, y: b[1] + r + Math.sin(D) * k},
                                touchingSliceAt: {x: b[0] + p, y: b[1] + r}
                            }
                        }
                }
                q(this, "afterTranslate")
            },
            drawEmpty: function () {
                var b = this.options;
                if (0 === this.total) {
                    var a = this.center[0];
                    var c = this.center[1];
                    this.graph || (this.graph = this.chart.renderer.circle(a, c, 0).addClass("highcharts-graph").add(this.group));
                    this.graph.animate({
                        "stroke-width": b.borderWidth,
                        cx: a, cy: c, r: this.center[2] / 2, fill: b.fillColor || "none", stroke: b.color || "#cccccc"
                    })
                } else this.graph && (this.graph = this.graph.destroy())
            },
            redrawPoints: function () {
                var b = this, a = b.chart, c = a.renderer, h, d, f, n, g = b.options.shadow;
                this.drawEmpty();
                !g || b.shadowGroup || a.styledMode || (b.shadowGroup = c.g("shadow").attr({zIndex: -1}).add(b.group));
                b.points.forEach(function (e) {
                    var m = {};
                    d = e.graphic;
                    if (!e.isNull && d) {
                        n = e.shapeArgs;
                        h = e.getTranslate();
                        if (!a.styledMode) {
                            var l = e.shadowGroup;
                            g && !l && (l = e.shadowGroup = c.g("shadow").add(b.shadowGroup));
                            l && l.attr(h);
                            f = b.pointAttribs(e, e.selected && "select")
                        }
                        e.delayedRendering ? (d.setRadialReference(b.center).attr(n).attr(h), a.styledMode || d.attr(f).attr({"stroke-linejoin": "round"}).shadow(g, l), e.delayedRendering = !1) : (d.setRadialReference(b.center), a.styledMode || C(!0, m, f), C(!0, m, n, h), d.animate(m));
                        d.attr({visibility: e.visible ? "inherit" : "hidden"});
                        d.addClass(e.getClassName())
                    } else d && (e.graphic = d.destroy())
                })
            },
            drawPoints: function () {
                var b = this.chart.renderer;
                this.points.forEach(function (a) {
                    a.graphic ||
                    (a.graphic = b[a.shapeType](a.shapeArgs).add(a.series.group), a.delayedRendering = !0)
                })
            },
            searchPoint: A,
            sortByAngle: function (b, a) {
                b.sort(function (b, c) {
                    return void 0 !== b.angle && (c.angle - b.angle) * a
                })
            },
            drawLegendSymbol: c.LegendSymbolMixin.drawRectangle,
            getCenter: g.getCenter,
            getSymbol: A,
            drawGraph: null
        }, {
            init: function () {
                z.prototype.init.apply(this, arguments);
                var b = this;
                b.name = u(b.name, "Slice");
                var a = function (a) {
                    b.slice("select" === a.type)
                };
                F(b, "select", a);
                F(b, "unselect", a);
                return b
            }, isValid: function () {
                return E(this.y) &&
                    0 <= this.y
            }, setVisible: function (b, a) {
                var c = this, h = c.series, d = h.chart, f = h.options.ignoreHiddenPoint;
                a = u(a, f);
                b !== c.visible && (c.visible = c.options.visible = b = void 0 === b ? !c.visible : b, h.options.data[h.data.indexOf(c)] = c.options, ["graphic", "dataLabel", "connector", "shadowGroup"].forEach(function (a) {
                    if (c[a]) c[a][b ? "show" : "hide"](!0)
                }), c.legendItem && d.legend.colorizeItem(c, b), b || "hover" !== c.state || c.setState(""), f && (h.isDirty = !0), a && d.redraw())
            }, slice: function (b, a, c) {
                var e = this.series;
                w(c, e.chart);
                u(a, !0);
                this.sliced =
                    this.options.sliced = y(b) ? b : !this.sliced;
                e.options.data[e.data.indexOf(this)] = this.options;
                this.graphic.animate(this.getTranslate());
                this.shadowGroup && this.shadowGroup.animate(this.getTranslate())
            }, getTranslate: function () {
                return this.sliced ? this.slicedTranslation : {translateX: 0, translateY: 0}
            }, haloPath: function (b) {
                var a = this.shapeArgs;
                return this.sliced || !this.visible ? [] : this.series.chart.renderer.symbols.arc(a.x, a.y, a.r + b, a.r + b, {
                    innerR: a.r - 1,
                    start: a.start,
                    end: a.end
                })
            }, connectorShapes: {
                fixedOffset: function (b,
                                       a, c) {
                    var e = a.breakAt;
                    a = a.touchingSliceAt;
                    return ["M", b.x, b.y].concat(c.softConnector ? ["C", b.x + ("left" === b.alignment ? -5 : 5), b.y, 2 * e.x - a.x, 2 * e.y - a.y, e.x, e.y] : ["L", e.x, e.y]).concat(["L", a.x, a.y])
                }, straight: function (b, a) {
                    a = a.touchingSliceAt;
                    return ["M", b.x, b.y, "L", a.x, a.y]
                }, crookedLine: function (b, a, e) {
                    a = a.touchingSliceAt;
                    var h = this.series, d = h.center[0], f = h.chart.plotWidth, n = h.chart.plotLeft;
                    h = b.alignment;
                    var g = this.shapeArgs.r;
                    e = c.relativeLength(e.crookDistance, 1);
                    e = "left" === h ? d + g + (f + n - d - g) * (1 - e) : n + (d - g) *
                        e;
                    d = ["L", e, b.y];
                    if ("left" === h ? e > b.x || e < a.x : e < b.x || e > a.x) d = [];
                    return ["M", b.x, b.y].concat(d).concat(["L", a.x, a.y])
                }
            }, getConnectorPath: function () {
                var b = this.labelPosition, a = this.series.options.dataLabels, c = a.connectorShape,
                    h = this.connectorShapes;
                h[c] && (c = h[c]);
                return c.call(this, {x: b.final.x, y: b.final.y, alignment: b.alignment}, b.connectorPosition, a)
            }
        });
        ""
    });
    K(B, "parts/DataLabels.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isArray, F = g.objectEach, I = g.splat, C = c.arrayMax,
            A = c.extend, u = c.format, z = c.merge;
        g = c.noop;
        var r = c.pick, k = c.relativeLength, q = c.Series, w = c.seriesTypes, b = c.stableSort;
        c.distribute = function (a, e, h) {
            function d(a, b) {
                return a.target - b.target
            }

            var f, n = !0, g = a, v = [];
            var m = 0;
            var l = g.reducedLen || e;
            for (f = a.length; f--;) m += a[f].size;
            if (m > l) {
                b(a, function (a, b) {
                    return (b.rank || 0) - (a.rank || 0)
                });
                for (m = f = 0; m <= l;) m += a[f].size, f++;
                v = a.splice(f - 1, a.length)
            }
            b(a, d);
            for (a = a.map(function (a) {
                return {size: a.size, targets: [a.target], align: r(a.align, .5)}
            }); n;) {
                for (f = a.length; f--;) n =
                    a[f], m = (Math.min.apply(0, n.targets) + Math.max.apply(0, n.targets)) / 2, n.pos = Math.min(Math.max(0, m - n.size * n.align), e - n.size);
                f = a.length;
                for (n = !1; f--;) 0 < f && a[f - 1].pos + a[f - 1].size > a[f].pos && (a[f - 1].size += a[f].size, a[f - 1].targets = a[f - 1].targets.concat(a[f].targets), a[f - 1].align = .5, a[f - 1].pos + a[f - 1].size > e && (a[f - 1].pos = e - a[f - 1].size), a.splice(f, 1), n = !0)
            }
            g.push.apply(g, v);
            f = 0;
            a.some(function (a) {
                var b = 0;
                if (a.targets.some(function () {
                    g[f].pos = a.pos + b;
                    if (Math.abs(g[f].pos - g[f].target) > h) return g.slice(0, f + 1).forEach(function (a) {
                        delete a.pos
                    }),
                        g.reducedLen = (g.reducedLen || e) - .1 * e, g.reducedLen > .1 * e && c.distribute(g, e, h), !0;
                    b += g[f].size;
                    f++
                })) return !0
            });
            b(g, d)
        };
        q.prototype.drawDataLabels = function () {
            function a(a, b) {
                var d = b.filter;
                return d ? (b = d.operator, a = a[d.property], d = d.value, ">" === b && a > d || "<" === b && a < d || ">=" === b && a >= d || "<=" === b && a <= d || "==" === b && a == d || "===" === b && a === d ? !0 : !1) : !0
            }

            function b(a, b) {
                var d = [], c;
                if (E(a) && !E(b)) d = a.map(function (a) {
                    return z(a, b)
                }); else if (E(b) && !E(a)) d = b.map(function (b) {
                    return z(a, b)
                }); else if (E(a) || E(b)) for (c = Math.max(a.length,
                    b.length); c--;) d[c] = z(a[c], b[c]); else d = z(a, b);
                return d
            }

            var h = this, d = h.chart, f = h.options, n = f.dataLabels, g = h.points, v, m = h.hasRendered || 0,
                l = c.animObject(f.animation).duration, t = Math.min(l, 200),
                k = !d.renderer.forExport && r(n.defer, 0 < t), D = d.renderer;
            n = b(b(d.options.plotOptions && d.options.plotOptions.series && d.options.plotOptions.series.dataLabels, d.options.plotOptions && d.options.plotOptions[h.type] && d.options.plotOptions[h.type].dataLabels), n);
            c.fireEvent(this, "drawDataLabels");
            if (E(n) || n.enabled || h._hasPointLabels) {
                var p =
                    h.plotGroup("dataLabelsGroup", "data-labels", k && !m ? "hidden" : "inherit", n.zIndex || 6);
                k && (p.attr({opacity: +m}), m || setTimeout(function () {
                    var a = h.dataLabelsGroup;
                    a && (h.visible && p.show(!0), a[f.animation ? "animate" : "attr"]({opacity: 1}, {duration: t}))
                }, l - t));
                g.forEach(function (c) {
                    v = I(b(n, c.dlOptions || c.options && c.options.dataLabels));
                    v.forEach(function (b, e) {
                        var l = b.enabled && (!c.isNull || c.dataLabelOnNull) && a(c, b),
                            m = c.dataLabels ? c.dataLabels[e] : c.dataLabel,
                            n = c.connectors ? c.connectors[e] : c.connector, v = r(b.distance,
                            c.labelDistance), t = !m;
                        if (l) {
                            var g = c.getLabelConfig();
                            var k = r(b[c.formatPrefix + "Format"], b.format);
                            g = y(k) ? u(k, g, d.time) : (b[c.formatPrefix + "Formatter"] || b.formatter).call(g, b);
                            k = b.style;
                            var x = b.rotation;
                            d.styledMode || (k.color = r(b.color, k.color, h.color, "#000000"), "contrast" === k.color && (c.contrastColor = D.getContrast(c.color || h.color), k.color = !y(v) && b.inside || 0 > v || f.stacking ? c.contrastColor : "#000000"), f.cursor && (k.cursor = f.cursor));
                            var q = {r: b.borderRadius || 0, rotation: x, padding: b.padding, zIndex: 1};
                            d.styledMode ||
                            (q.fill = b.backgroundColor, q.stroke = b.borderColor, q["stroke-width"] = b.borderWidth);
                            F(q, function (a, b) {
                                void 0 === a && delete q[b]
                            })
                        }
                        !m || l && y(g) ? l && y(g) && (m ? q.text = g : (c.dataLabels = c.dataLabels || [], m = c.dataLabels[e] = x ? D.text(g, 0, -9999).addClass("highcharts-data-label") : D.label(g, 0, -9999, b.shape, null, null, b.useHTML, null, "data-label"), e || (c.dataLabel = m), m.addClass(" highcharts-data-label-color-" + c.colorIndex + " " + (b.className || "") + (b.useHTML ? " highcharts-tracker" : ""))), m.options = b, m.attr(q), d.styledMode || m.css(k).shadow(b.shadow),
                        m.added || m.add(p), b.textPath && !b.useHTML && m.setTextPath(c.getDataLabelPath && c.getDataLabelPath(m) || c.graphic, b.textPath), h.alignDataLabel(c, m, b, null, t)) : (c.dataLabel = c.dataLabel && c.dataLabel.destroy(), c.dataLabels && (1 === c.dataLabels.length ? delete c.dataLabels : delete c.dataLabels[e]), e || delete c.dataLabel, n && (c.connector = c.connector.destroy(), c.connectors && (1 === c.connectors.length ? delete c.connectors : delete c.connectors[e])))
                    })
                })
            }
            c.fireEvent(this, "afterDrawDataLabels")
        };
        q.prototype.alignDataLabel =
            function (a, b, c, d, f) {
                var e = this.chart, h = this.isCartesian && e.inverted,
                    v = r(a.dlBox && a.dlBox.centerX, a.plotX, -9999), m = r(a.plotY, -9999), l = b.getBBox(),
                    t = c.rotation, g = c.align,
                    k = this.visible && (a.series.forceDL || e.isInsidePlot(v, Math.round(m), h) || d && e.isInsidePlot(v, h ? d.x + 1 : d.y + d.height - 1, h)),
                    p = "justify" === r(c.overflow, "justify");
                if (k) {
                    var q = e.renderer.fontMetrics(e.styledMode ? void 0 : c.style.fontSize, b).b;
                    d = A({
                        x: h ? this.yAxis.len - m : v,
                        y: Math.round(h ? this.xAxis.len - v : m),
                        width: 0,
                        height: 0
                    }, d);
                    A(c, {
                        width: l.width,
                        height: l.height
                    });
                    t ? (p = !1, v = e.renderer.rotCorr(q, t), v = {
                        x: d.x + c.x + d.width / 2 + v.x,
                        y: d.y + c.y + {top: 0, middle: .5, bottom: 1}[c.verticalAlign] * d.height
                    }, b[f ? "attr" : "animate"](v).attr({align: g}), m = (t + 720) % 360, m = 180 < m && 360 > m, "left" === g ? v.y -= m ? l.height : 0 : "center" === g ? (v.x -= l.width / 2, v.y -= l.height / 2) : "right" === g && (v.x -= l.width, v.y -= m ? 0 : l.height), b.placed = !0, b.alignAttr = v) : (b.align(c, null, d), v = b.alignAttr);
                    p && 0 <= d.height ? this.justifyDataLabel(b, c, v, l, d, f) : r(c.crop, !0) && (k = e.isInsidePlot(v.x, v.y) && e.isInsidePlot(v.x +
                        l.width, v.y + l.height));
                    if (c.shape && !t) b[f ? "attr" : "animate"]({
                        anchorX: h ? e.plotWidth - a.plotY : a.plotX,
                        anchorY: h ? e.plotHeight - a.plotX : a.plotY
                    })
                }
                k || (b.hide(!0), b.placed = !1)
            };
        q.prototype.justifyDataLabel = function (a, b, c, d, f, n) {
            var e = this.chart, h = b.align, m = b.verticalAlign, l = a.box ? 0 : a.padding || 0;
            var t = c.x + l;
            if (0 > t) {
                "right" === h ? (b.align = "left", b.inside = !0) : b.x = -t;
                var g = !0
            }
            t = c.x + d.width - l;
            t > e.plotWidth && ("left" === h ? (b.align = "right", b.inside = !0) : b.x = e.plotWidth - t, g = !0);
            t = c.y + l;
            0 > t && ("bottom" === m ? (b.verticalAlign =
                "top", b.inside = !0) : b.y = -t, g = !0);
            t = c.y + d.height - l;
            t > e.plotHeight && ("top" === m ? (b.verticalAlign = "bottom", b.inside = !0) : b.y = e.plotHeight - t, g = !0);
            g && (a.placed = !n, a.align(b, null, f));
            return g
        };
        w.pie && (w.pie.prototype.dataLabelPositioners = {
            radialDistributionY: function (a) {
                return a.top + a.distributeBox.pos
            }, radialDistributionX: function (a, b, c, d) {
                return a.getX(c < b.top + 2 || c > b.bottom - 2 ? d : c, b.half, b)
            }, justify: function (a, b, c) {
                return c[0] + (a.half ? -1 : 1) * (b + a.labelDistance)
            }, alignToPlotEdges: function (a, b, c, d) {
                a = a.getBBox().width;
                return b ? a + d : c - a - d
            }, alignToConnectors: function (a, b, c, d) {
                var f = 0, e;
                a.forEach(function (a) {
                    e = a.dataLabel.getBBox().width;
                    e > f && (f = e)
                });
                return b ? f + d : c - f - d
            }
        }, w.pie.prototype.drawDataLabels = function () {
            var a = this, b = a.data, h, d = a.chart, f = a.options.dataLabels, n = f.connectorPadding, g,
                v = d.plotWidth, m = d.plotHeight, l = d.plotLeft, t = Math.round(d.chartWidth / 3), k, D = a.center,
                p = D[2] / 2, u = D[1], w, A, E, F, I = [[], []], L, B, O, K, X = [0, 0, 0, 0],
                T = a.dataLabelPositioners, da;
            a.visible && (f.enabled || a._hasPointLabels) && (b.forEach(function (a) {
                a.dataLabel &&
                a.visible && a.dataLabel.shortened && (a.dataLabel.attr({width: "auto"}).css({
                    width: "auto",
                    textOverflow: "clip"
                }), a.dataLabel.shortened = !1)
            }), q.prototype.drawDataLabels.apply(a), b.forEach(function (a) {
                a.dataLabel && (a.visible ? (I[a.half].push(a), a.dataLabel._pos = null, !y(f.style.width) && !y(a.options.dataLabels && a.options.dataLabels.style && a.options.dataLabels.style.width) && a.dataLabel.getBBox().width > t && (a.dataLabel.css({width: .7 * t}), a.dataLabel.shortened = !0)) : (a.dataLabel = a.dataLabel.destroy(), a.dataLabels &&
                1 === a.dataLabels.length && delete a.dataLabels))
            }), I.forEach(function (b, e) {
                var t = b.length, g = [], k;
                if (t) {
                    a.sortByAngle(b, e - .5);
                    if (0 < a.maxLabelDistance) {
                        var x = Math.max(0, u - p - a.maxLabelDistance);
                        var q = Math.min(u + p + a.maxLabelDistance, d.plotHeight);
                        b.forEach(function (a) {
                            0 < a.labelDistance && a.dataLabel && (a.top = Math.max(0, u - p - a.labelDistance), a.bottom = Math.min(u + p + a.labelDistance, d.plotHeight), k = a.dataLabel.getBBox().height || 21, a.distributeBox = {
                                target: a.labelPosition.natural.y - a.top + k / 2,
                                size: k,
                                rank: a.y
                            }, g.push(a.distributeBox))
                        });
                        x = q + k - x;
                        c.distribute(g, x, x / 5)
                    }
                    for (K = 0; K < t; K++) {
                        h = b[K];
                        E = h.labelPosition;
                        w = h.dataLabel;
                        O = !1 === h.visible ? "hidden" : "inherit";
                        B = x = E.natural.y;
                        g && y(h.distributeBox) && (void 0 === h.distributeBox.pos ? O = "hidden" : (F = h.distributeBox.size, B = T.radialDistributionY(h)));
                        delete h.positionIndex;
                        if (f.justify) L = T.justify(h, p, D); else switch (f.alignTo) {
                            case "connectors":
                                L = T.alignToConnectors(b, e, v, l);
                                break;
                            case "plotEdges":
                                L = T.alignToPlotEdges(w, e, v, l);
                                break;
                            default:
                                L = T.radialDistributionX(a, h, B, x)
                        }
                        w._attr = {
                            visibility: O,
                            align: E.alignment
                        };
                        w._pos = {x: L + f.x + ({left: n, right: -n}[E.alignment] || 0), y: B + f.y - 10};
                        E.final.x = L;
                        E.final.y = B;
                        r(f.crop, !0) && (A = w.getBBox().width, x = null, L - A < n && 1 === e ? (x = Math.round(A - L + n), X[3] = Math.max(x, X[3])) : L + A > v - n && 0 === e && (x = Math.round(L + A - v + n), X[1] = Math.max(x, X[1])), 0 > B - F / 2 ? X[0] = Math.max(Math.round(-B + F / 2), X[0]) : B + F / 2 > m && (X[2] = Math.max(Math.round(B + F / 2 - m), X[2])), w.sideOverflow = x)
                    }
                }
            }), 0 === C(X) || this.verifyDataLabelOverflow(X)) && (this.placeDataLabels(), this.points.forEach(function (b) {
                da = z(f, b.options.dataLabels);
                if (g = r(da.connectorWidth, 1)) {
                    var c;
                    k = b.connector;
                    if ((w = b.dataLabel) && w._pos && b.visible && 0 < b.labelDistance) {
                        O = w._attr.visibility;
                        if (c = !k) b.connector = k = d.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-" + b.colorIndex + (b.className ? " " + b.className : "")).add(a.dataLabelsGroup), d.styledMode || k.attr({
                            "stroke-width": g,
                            stroke: da.connectorColor || b.color || "#666666"
                        });
                        k[c ? "attr" : "animate"]({d: b.getConnectorPath()});
                        k.attr("visibility", O)
                    } else k && (b.connector = k.destroy())
                }
            }))
        }, w.pie.prototype.placeDataLabels =
            function () {
                this.points.forEach(function (a) {
                    var b = a.dataLabel, c;
                    b && a.visible && ((c = b._pos) ? (b.sideOverflow && (b._attr.width = Math.max(b.getBBox().width - b.sideOverflow, 0), b.css({
                        width: b._attr.width + "px",
                        textOverflow: (this.options.dataLabels.style || {}).textOverflow || "ellipsis"
                    }), b.shortened = !0), b.attr(b._attr), b[b.moved ? "animate" : "attr"](c), b.moved = !0) : b && b.attr({y: -9999}));
                    delete a.distributeBox
                }, this)
            }, w.pie.prototype.alignDataLabel = g, w.pie.prototype.verifyDataLabelOverflow = function (a) {
            var b = this.center,
                c = this.options, d = c.center, f = c.minSize || 80, n = null !== c.size;
            if (!n) {
                if (null !== d[0]) var g = Math.max(b[2] - Math.max(a[1], a[3]), f); else g = Math.max(b[2] - a[1] - a[3], f), b[0] += (a[3] - a[1]) / 2;
                null !== d[1] ? g = Math.max(Math.min(g, b[2] - Math.max(a[0], a[2])), f) : (g = Math.max(Math.min(g, b[2] - a[0] - a[2]), f), b[1] += (a[0] - a[2]) / 2);
                g < b[2] ? (b[2] = g, b[3] = Math.min(k(c.innerSize || 0, g), g), this.translate(b), this.drawDataLabels && this.drawDataLabels()) : n = !0
            }
            return n
        });
        w.column && (w.column.prototype.alignDataLabel = function (a, b, c, d, f) {
            var e =
                    this.chart.inverted, h = a.series, g = a.dlBox || a.shapeArgs,
                m = r(a.below, a.plotY > r(this.translatedThreshold, h.yAxis.len)),
                l = r(c.inside, !!this.options.stacking);
            g && (d = z(g), 0 > d.y && (d.height += d.y, d.y = 0), g = d.y + d.height - h.yAxis.len, 0 < g && (d.height -= g), e && (d = {
                x: h.yAxis.len - d.y - d.height,
                y: h.xAxis.len - d.x - d.width,
                width: d.height,
                height: d.width
            }), l || (e ? (d.x += m ? 0 : d.width, d.width = 0) : (d.y += m ? d.height : 0, d.height = 0)));
            c.align = r(c.align, !e || l ? "center" : m ? "right" : "left");
            c.verticalAlign = r(c.verticalAlign, e || l ? "middle" : m ? "top" :
                "bottom");
            q.prototype.alignDataLabel.call(this, a, b, c, d, f);
            c.inside && a.contrastColor && b.css({color: a.contrastColor})
        })
    });
    K(B, "modules/overlapping-datalabels.src.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isArray, E = g.objectEach;
        g = c.Chart;
        var F = c.pick, B = c.addEvent, C = c.fireEvent;
        B(g, "render", function () {
            var c = [];
            (this.labelCollectors || []).forEach(function (g) {
                c = c.concat(g())
            });
            (this.yAxis || []).forEach(function (g) {
                g.options.stackLabels && !g.options.stackLabels.allowOverlap &&
                E(g.stacks, function (g) {
                    E(g, function (g) {
                        c.push(g.label)
                    })
                })
            });
            (this.series || []).forEach(function (g) {
                var u = g.options.dataLabels;
                g.visible && (!1 !== u.enabled || g._hasPointLabels) && g.points.forEach(function (g) {
                    g.visible && (y(g.dataLabels) ? g.dataLabels : g.dataLabel ? [g.dataLabel] : []).forEach(function (k) {
                        var q = k.options;
                        k.labelrank = F(q.labelrank, g.labelrank, g.shapeArgs && g.shapeArgs.height);
                        q.allowOverlap || c.push(k)
                    })
                })
            });
            this.hideOverlappingLabels(c)
        });
        g.prototype.hideOverlappingLabels = function (c) {
            var g = this,
                z = c.length, r = g.renderer, k, q, w;
            var b = function (a) {
                var b = a.box ? 0 : a.padding || 0;
                var c = 0;
                if (a && (!a.alignAttr || a.placed)) {
                    var e = a.alignAttr || {x: a.attr("x"), y: a.attr("y")};
                    var h = a.parentGroup;
                    a.width || (c = a.getBBox(), a.width = c.width, a.height = c.height, c = r.fontMetrics(null, a.element).h);
                    return {
                        x: e.x + (h.translateX || 0) + b,
                        y: e.y + (h.translateY || 0) + b - c,
                        width: a.width - 2 * b,
                        height: a.height - 2 * b
                    }
                }
            };
            for (q = 0; q < z; q++) if (k = c[q]) k.oldOpacity = k.opacity, k.newOpacity = 1, k.absoluteBox = b(k);
            c.sort(function (a, b) {
                return (b.labelrank ||
                    0) - (a.labelrank || 0)
            });
            for (q = 0; q < z; q++) {
                var a = (b = c[q]) && b.absoluteBox;
                for (k = q + 1; k < z; ++k) {
                    var e = (w = c[k]) && w.absoluteBox;
                    !a || !e || b === w || 0 === b.newOpacity || 0 === w.newOpacity || e.x > a.x + a.width || e.x + e.width < a.x || e.y > a.y + a.height || e.y + e.height < a.y || ((b.labelrank < w.labelrank ? b : w).newOpacity = 0)
                }
            }
            c.forEach(function (a) {
                var b;
                if (a) {
                    var c = a.newOpacity;
                    a.oldOpacity !== c && (a.alignAttr && a.placed ? (c ? a.show(!0) : b = function () {
                        a.hide(!0);
                        a.placed = !1
                    }, a.alignAttr.opacity = c, a[a.isOld ? "animate" : "attr"](a.alignAttr, null, b), C(g,
                        "afterHideOverlappingLabels")) : a.attr({opacity: c}));
                    a.isOld = !0
                }
            })
        }
    });
    K(B, "parts/Interaction.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isArray, F = g.isObject, B = g.objectEach, C = c.addEvent;
        g = c.Chart;
        var A = c.createElement, u = c.css, z = c.defaultOptions, r = c.defaultPlotOptions, k = c.extend,
            q = c.fireEvent, w = c.hasTouch, b = c.Legend, a = c.merge, e = c.pick, h = c.Point, d = c.Series,
            f = c.seriesTypes, n = c.svg;
        var x = c.TrackerMixin = {
            drawTrackerPoint: function () {
                var a = this, b = a.chart, d = b.pointer,
                    c = function (a) {
                        var b = d.getPointFromEvent(a);
                        void 0 !== b && (d.isDirectTouch = !0, b.onMouseOver(a))
                    }, f;
                a.points.forEach(function (a) {
                    f = E(a.dataLabels) ? a.dataLabels : a.dataLabel ? [a.dataLabel] : [];
                    a.graphic && (a.graphic.element.point = a);
                    f.forEach(function (b) {
                        b.div ? b.div.point = a : b.element.point = a
                    })
                });
                a._hasTracking || (a.trackerGroups.forEach(function (f) {
                    if (a[f]) {
                        a[f].addClass("highcharts-tracker").on("mouseover", c).on("mouseout", function (a) {
                            d.onTrackerMouseOut(a)
                        });
                        if (w) a[f].on("touchstart", c);
                        !b.styledMode && a.options.cursor &&
                        a[f].css(u).css({cursor: a.options.cursor})
                    }
                }), a._hasTracking = !0);
                q(this, "afterDrawTracker")
            }, drawTrackerGraph: function () {
                var a = this, b = a.options, d = b.trackByArea, c = [].concat(d ? a.areaPath : a.graphPath),
                    f = c.length, e = a.chart, h = e.pointer, g = e.renderer, k = e.options.tooltip.snap, x = a.tracker,
                    r, u = function () {
                        if (e.hoverSeries !== a) a.onMouseOver()
                    }, z = "rgba(192,192,192," + (n ? .0001 : .002) + ")";
                if (f && !d) for (r = f + 1; r--;) "M" === c[r] && c.splice(r + 1, 0, c[r + 1] - k, c[r + 2], "L"), (r && "M" === c[r] || r === f) && c.splice(r, 0, "L", c[r - 2] + k, c[r -
                1]);
                x ? x.attr({d: c}) : a.graph && (a.tracker = g.path(c).attr({
                    visibility: a.visible ? "visible" : "hidden",
                    zIndex: 2
                }).addClass(d ? "highcharts-tracker-area" : "highcharts-tracker-line").add(a.group), e.styledMode || a.tracker.attr({
                    "stroke-linejoin": "round",
                    stroke: z,
                    fill: d ? z : "none",
                    "stroke-width": a.graph.strokeWidth() + (d ? 0 : 2 * k)
                }), [a.tracker, a.markerGroup].forEach(function (a) {
                    a.addClass("highcharts-tracker").on("mouseover", u).on("mouseout", function (a) {
                        h.onTrackerMouseOut(a)
                    });
                    b.cursor && !e.styledMode && a.css({cursor: b.cursor});
                    if (w) a.on("touchstart", u)
                }));
                q(this, "afterDrawTracker")
            }
        };
        f.column && (f.column.prototype.drawTracker = x.drawTrackerPoint);
        f.pie && (f.pie.prototype.drawTracker = x.drawTrackerPoint);
        f.scatter && (f.scatter.prototype.drawTracker = x.drawTrackerPoint);
        k(b.prototype, {
            setItemEvents: function (b, d, c) {
                var f = this, e = f.chart.renderer.boxWrapper, l = b instanceof h,
                    m = "highcharts-legend-" + (l ? "point" : "series") + "-active", n = f.chart.styledMode;
                (c ? d : b.legendGroup).on("mouseover", function () {
                    b.visible && f.allItems.forEach(function (a) {
                        b !==
                        a && a.setState("inactive", !l)
                    });
                    b.setState("hover");
                    b.visible && e.addClass(m);
                    n || d.css(f.options.itemHoverStyle)
                }).on("mouseout", function () {
                    f.chart.styledMode || d.css(a(b.visible ? f.itemStyle : f.itemHiddenStyle));
                    f.allItems.forEach(function (a) {
                        b !== a && a.setState("", !l)
                    });
                    e.removeClass(m);
                    b.setState()
                }).on("click", function (a) {
                    var d = function () {
                        b.setVisible && b.setVisible();
                        f.allItems.forEach(function (a) {
                            b !== a && a.setState(b.visible ? "inactive" : "", !l)
                        })
                    };
                    e.removeClass(m);
                    a = {browserEvent: a};
                    b.firePointEvent ? b.firePointEvent("legendItemClick",
                        a, d) : q(b, "legendItemClick", a, d)
                })
            }, createCheckboxForItem: function (a) {
                a.checkbox = A("input", {
                    type: "checkbox",
                    className: "highcharts-legend-checkbox",
                    checked: a.selected,
                    defaultChecked: a.selected
                }, this.options.itemCheckboxStyle, this.chart.container);
                C(a.checkbox, "click", function (b) {
                    q(a.series || a, "checkboxClick", {checked: b.target.checked, item: a}, function () {
                        a.select()
                    })
                })
            }
        });
        k(g.prototype, {
            showResetZoom: function () {
                function a() {
                    b.zoomOut()
                }

                var b = this, d = z.lang, c = b.options.chart.resetZoomButton, f = c.theme, e =
                    f.states, h = "chart" === c.relativeTo || "spaceBox" === c.relativeTo ? null : "plotBox";
                q(this, "beforeShowResetZoom", null, function () {
                    b.resetZoomButton = b.renderer.button(d.resetZoom, null, null, a, f, e && e.hover).attr({
                        align: c.position.align,
                        title: d.resetZoomTitle
                    }).addClass("highcharts-reset-zoom").add().align(c.position, !1, h)
                });
                q(this, "afterShowResetZoom")
            }, zoomOut: function () {
                q(this, "selection", {resetSelection: !0}, this.zoom)
            }, zoom: function (a) {
                var b = this, d, c = b.pointer, f = !1, h = b.inverted ? c.mouseDownX : c.mouseDownY;
                !a ||
                a.resetSelection ? (b.axes.forEach(function (a) {
                    d = a.zoom()
                }), c.initiated = !1) : a.xAxis.concat(a.yAxis).forEach(function (a) {
                    var e = a.axis, l = b.inverted ? e.left : e.top, m = b.inverted ? l + e.width : l + e.height,
                        p = e.isXAxis, n = !1;
                    if (!p && h >= l && h <= m || p || !y(h)) n = !0;
                    c[p ? "zoomX" : "zoomY"] && n && (d = e.zoom(a.min, a.max), e.displayBtn && (f = !0))
                });
                var p = b.resetZoomButton;
                f && !p ? b.showResetZoom() : !f && F(p) && (b.resetZoomButton = p.destroy());
                d && b.redraw(e(b.options.chart.animation, a && a.animation, 100 > b.pointCount))
            }, pan: function (a, b) {
                var d =
                    this, c = d.hoverPoints, f;
                q(this, "pan", {originalEvent: a}, function () {
                    c && c.forEach(function (a) {
                        a.setState()
                    });
                    ("xy" === b ? [1, 0] : [1]).forEach(function (b) {
                        b = d[b ? "xAxis" : "yAxis"][0];
                        var c = b.horiz, e = a[c ? "chartX" : "chartY"];
                        c = c ? "mouseDownX" : "mouseDownY";
                        var h = d[c], l = (b.pointRange || 0) / 2,
                            m = b.reversed && !d.inverted || !b.reversed && d.inverted ? -1 : 1, n = b.getExtremes(),
                            g = b.toValue(h - e, !0) + l * m;
                        m = b.toValue(h + b.len - e, !0) - l * m;
                        var t = m < g;
                        h = t ? m : g;
                        g = t ? g : m;
                        m = Math.min(n.dataMin, l ? n.min : b.toValue(b.toPixels(n.min) - b.minPixelPadding));
                        l = Math.max(n.dataMax, l ? n.max : b.toValue(b.toPixels(n.max) + b.minPixelPadding));
                        t = m - h;
                        0 < t && (g += t, h = m);
                        t = g - l;
                        0 < t && (g = l, h -= t);
                        b.series.length && h !== n.min && g !== n.max && (b.setExtremes(h, g, !1, !1, {trigger: "pan"}), f = !0);
                        d[c] = e
                    });
                    f && d.redraw(!1);
                    u(d.container, {cursor: "move"})
                })
            }
        });
        k(h.prototype, {
            select: function (a, b) {
                var d = this, c = d.series, f = c.chart;
                this.selectedStaging = a = e(a, !d.selected);
                d.firePointEvent(a ? "select" : "unselect", {accumulate: b}, function () {
                    d.selected = d.options.selected = a;
                    c.options.data[c.data.indexOf(d)] =
                        d.options;
                    d.setState(a && "select");
                    b || f.getSelectedPoints().forEach(function (a) {
                        var b = a.series;
                        a.selected && a !== d && (a.selected = a.options.selected = !1, b.options.data[b.data.indexOf(a)] = a.options, a.setState(f.hoverPoints && b.options.inactiveOtherPoints ? "inactive" : ""), a.firePointEvent("unselect"))
                    })
                });
                delete this.selectedStaging
            }, onMouseOver: function (a) {
                var b = this.series.chart, d = b.pointer;
                a = a ? d.normalize(a) : d.getChartCoordinatesFromPoint(this, b.inverted);
                d.runPointActions(a, this)
            }, onMouseOut: function () {
                var a =
                    this.series.chart;
                this.firePointEvent("mouseOut");
                this.series.options.inactiveOtherPoints || (a.hoverPoints || []).forEach(function (a) {
                    a.setState()
                });
                a.hoverPoints = a.hoverPoint = null
            }, importEvents: function () {
                if (!this.hasImportedEvents) {
                    var b = this, d = a(b.series.options.point, b.options).events;
                    b.events = d;
                    B(d, function (a, d) {
                        c.isFunction(a) && C(b, d, a)
                    });
                    this.hasImportedEvents = !0
                }
            }, setState: function (a, b) {
                var d = this.series, c = this.state, f = d.options.states[a || "normal"] || {},
                    h = r[d.type].marker && d.options.marker, m =
                    h && !1 === h.enabled, n = h && h.states && h.states[a || "normal"] || {}, g = !1 === n.enabled,
                    v = d.stateMarkerGraphic, x = this.marker || {}, u = d.chart, w = d.halo, z,
                    A = h && d.markerAttribs;
                a = a || "";
                if (!(a === this.state && !b || this.selected && "select" !== a || !1 === f.enabled || a && (g || m && !1 === n.enabled) || a && x.states && x.states[a] && !1 === x.states[a].enabled)) {
                    this.state = a;
                    A && (z = d.markerAttribs(this, a));
                    if (this.graphic) {
                        c && this.graphic.removeClass("highcharts-point-" + c);
                        a && this.graphic.addClass("highcharts-point-" + a);
                        if (!u.styledMode) {
                            var y =
                                d.pointAttribs(this, a);
                            var C = e(u.options.chart.animation, f.animation);
                            d.options.inactiveOtherPoints && ((this.dataLabels || []).forEach(function (a) {
                                a && a.animate({opacity: y.opacity}, C)
                            }), this.connector && this.connector.animate({opacity: y.opacity}, C));
                            this.graphic.animate(y, C)
                        }
                        z && this.graphic.animate(z, e(u.options.chart.animation, n.animation, h.animation));
                        v && v.hide()
                    } else {
                        if (a && n) {
                            c = x.symbol || d.symbol;
                            v && v.currentSymbol !== c && (v = v.destroy());
                            if (z) if (v) v[b ? "animate" : "attr"]({x: z.x, y: z.y}); else c && (d.stateMarkerGraphic =
                                v = u.renderer.symbol(c, z.x, z.y, z.width, z.height).add(d.markerGroup), v.currentSymbol = c);
                            !u.styledMode && v && v.attr(d.pointAttribs(this, a))
                        }
                        v && (v[a && this.isInside ? "show" : "hide"](), v.element.point = this)
                    }
                    a = f.halo;
                    f = (v = this.graphic || v) && v.visibility || "inherit";
                    a && a.size && v && "hidden" !== f ? (w || (d.halo = w = u.renderer.path().add(v.parentGroup)), w.show()[b ? "animate" : "attr"]({d: this.haloPath(a.size)}), w.attr({
                        "class": "highcharts-halo highcharts-color-" + e(this.colorIndex, d.colorIndex) + (this.className ? " " + this.className :
                            ""), visibility: f, zIndex: -1
                    }), w.point = this, u.styledMode || w.attr(k({
                        fill: this.color || d.color,
                        "fill-opacity": a.opacity
                    }, a.attributes))) : w && w.point && w.point.haloPath && w.animate({d: w.point.haloPath(0)}, null, w.hide);
                    q(this, "afterSetState")
                }
            }, haloPath: function (a) {
                return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX) - a, this.plotY - a, 2 * a, 2 * a)
            }
        });
        k(d.prototype, {
            onMouseOver: function () {
                var a = this.chart, b = a.hoverSeries;
                if (b && b !== this) b.onMouseOut();
                this.options.events.mouseOver && q(this, "mouseOver");
                this.setState("hover");
                a.hoverSeries = this
            }, onMouseOut: function () {
                var a = this.options, b = this.chart, d = b.tooltip, c = b.hoverPoint;
                b.hoverSeries = null;
                if (c) c.onMouseOut();
                this && a.events.mouseOut && q(this, "mouseOut");
                !d || this.stickyTracking || d.shared && !this.noSharedTooltip || d.hide();
                b.series.forEach(function (a) {
                    a.setState("", !0)
                })
            }, setState: function (a, b) {
                var d = this, c = d.options, f = d.graph, h = c.inactiveOtherPoints, m = c.states, n = c.lineWidth,
                    g = c.opacity,
                    k = e(m[a || "normal"] && m[a || "normal"].animation, d.chart.options.chart.animation);
                c = 0;
                a = a || "";
                if (d.state !== a && ([d.group, d.markerGroup, d.dataLabelsGroup].forEach(function (b) {
                    b && (d.state && b.removeClass("highcharts-series-" + d.state), a && b.addClass("highcharts-series-" + a))
                }), d.state = a, !d.chart.styledMode)) {
                    if (m[a] && !1 === m[a].enabled) return;
                    a && (n = m[a].lineWidth || n + (m[a].lineWidthPlus || 0), g = e(m[a].opacity, g));
                    if (f && !f.dashstyle) for (m = {"stroke-width": n}, f.animate(m, k); d["zone-graph-" + c];) d["zone-graph-" + c].attr(m), c += 1;
                    h || [d.group, d.markerGroup, d.dataLabelsGroup, d.labelBySeries].forEach(function (a) {
                        a &&
                        a.animate({opacity: g}, k)
                    })
                }
                b && h && d.points && d.setAllPointsToState(a)
            }, setAllPointsToState: function (a) {
                this.points.forEach(function (b) {
                    b.setState && b.setState(a)
                })
            }, setVisible: function (a, b) {
                var d = this, c = d.chart, f = d.legendItem, e = c.options.chart.ignoreHiddenSeries, h = d.visible;
                var m = (d.visible = a = d.options.visible = d.userOptions.visible = void 0 === a ? !h : a) ? "show" : "hide";
                ["group", "dataLabelsGroup", "markerGroup", "tracker", "tt"].forEach(function (a) {
                    if (d[a]) d[a][m]()
                });
                if (c.hoverSeries === d || (c.hoverPoint && c.hoverPoint.series) ===
                    d) d.onMouseOut();
                f && c.legend.colorizeItem(d, a);
                d.isDirty = !0;
                d.options.stacking && c.series.forEach(function (a) {
                    a.options.stacking && a.visible && (a.isDirty = !0)
                });
                d.linkedSeries.forEach(function (b) {
                    b.setVisible(a, !1)
                });
                e && (c.isDirtyBox = !0);
                q(d, m);
                !1 !== b && c.redraw()
            }, show: function () {
                this.setVisible(!0)
            }, hide: function () {
                this.setVisible(!1)
            }, select: function (a) {
                this.selected = a = this.options.selected = void 0 === a ? !this.selected : a;
                this.checkbox && (this.checkbox.checked = a);
                q(this, a ? "select" : "unselect")
            }, drawTracker: x.drawTrackerGraph
        })
    });
    K(B, "parts/Responsive.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isArray, E = g.isObject, F = g.objectEach, B = g.splat;
        g = c.Chart;
        var C = c.pick;
        g.prototype.setResponsive = function (g, u) {
            var z = this.options.responsive, r = [], k = this.currentResponsive;
            !u && z && z.rules && z.rules.forEach(function (g) {
                void 0 === g._id && (g._id = c.uniqueKey());
                this.matchResponsiveRule(g, r)
            }, this);
            u = c.merge.apply(0, r.map(function (g) {
                return c.find(z.rules, function (c) {
                    return c._id === g
                }).chartOptions
            }));
            u.isResponsiveOptions =
                !0;
            r = r.toString() || void 0;
            r !== (k && k.ruleIds) && (k && this.update(k.undoOptions, g, !0), r ? (k = this.currentOptions(u), k.isResponsiveOptions = !0, this.currentResponsive = {
                ruleIds: r,
                mergedOptions: u,
                undoOptions: k
            }, this.update(u, g, !0)) : this.currentResponsive = void 0)
        };
        g.prototype.matchResponsiveRule = function (c, g) {
            var u = c.condition;
            (u.callback || function () {
                return this.chartWidth <= C(u.maxWidth, Number.MAX_VALUE) && this.chartHeight <= C(u.maxHeight, Number.MAX_VALUE) && this.chartWidth >= C(u.minWidth, 0) && this.chartHeight >= C(u.minHeight,
                    0)
            }).call(this) && g.push(c._id)
        };
        g.prototype.currentOptions = function (c) {
            function g(c, q, r, b) {
                var a;
                F(c, function (c, h) {
                    if (!b && -1 < z.collectionsWithUpdate.indexOf(h)) for (c = B(c), r[h] = [], a = 0; a < c.length; a++) q[h][a] && (r[h][a] = {}, g(c[a], q[h][a], r[h][a], b + 1)); else E(c) ? (r[h] = y(c) ? [] : {}, g(c, q[h] || {}, r[h], b + 1)) : r[h] = void 0 === q[h] ? null : q[h]
                })
            }

            var z = this, r = {};
            g(c, this.options, r, 0);
            return r
        }
    });
    K(B, "masters/highcharts.src.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = c.extend;
        y(c, {
            attr: g.attr,
            defined: g.defined,
            erase: g.erase,
            isArray: g.isArray,
            isClass: g.isClass,
            isDOMElement: g.isDOMElement,
            isNumber: g.isNumber,
            isObject: g.isObject,
            isString: g.isString,
            objectEach: g.objectEach,
            pInt: g.pInt,
            splat: g.splat
        });
        return c
    });
    K(B, "parts-gantt/CurrentDateIndicator.js", [B["parts/Globals.js"]], function (c) {
        var g = c.addEvent, y = c.PlotLineOrBand, E = c.merge, F = c.wrap, B = {
            currentDateIndicator: !0,
            color: "#ccd6eb",
            width: 2,
            label: {
                format: "%a, %b %d %Y, %H:%M", formatter: function (g, A) {
                    return c.dateFormat(A, g)
                }, rotation: 0, style: {fontSize: "10px"}
            }
        };
        g(c.Axis, "afterSetOptions", function () {
            var c = this.options, g = c.currentDateIndicator;
            g && (g = "object" === typeof g ? E(B, g) : E(B), g.value = new Date, c.plotLines || (c.plotLines = []), c.plotLines.push(g))
        });
        g(y, "render", function () {
            this.label && this.label.attr({text: this.getLabelText(this.options.label)})
        });
        F(y.prototype, "getLabelText", function (c, g) {
            var u = this.options;
            return u.currentDateIndicator && u.label && "function" === typeof u.label.formatter ? (u.value = new Date, u.label.formatter.call(this, u.value, u.label.format)) :
                c.call(this, g)
        })
    });
    K(B, "parts-gantt/GridAxis.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.erase, F = g.isArray, B = g.isNumber, C = c.addEvent, A = c.dateFormat,
            u = function (a) {
                return g.isObject(a, !0)
            }, z = c.merge, r = c.pick, k = c.wrap, q = c.Chart, w = c.Axis, b = c.Tick, a = function (a) {
                var b = a.options, d = b && u(b.grid) ? b.grid : {}, c = 25 / 11,
                    e = a.chart.renderer.fontMetrics(b.labels.style.fontSize);
                b.labels || (b.labels = {});
                b.labels.align = r(b.labels.align, "center");
                a.categories || (b.showLastLabel =
                    !1);
                a.horiz && (b.tickLength = d.cellHeight || e.h * c);
                a.labelRotation = 0;
                b.labels.rotation = 0
            }, e = {top: 0, right: 1, bottom: 2, left: 3, 0: "top", 1: "right", 2: "bottom", 3: "left"};
        w.prototype.isOuterAxis = function () {
            var a = this, b = a.columnIndex, c = a.linkedParent && a.linkedParent.columns || a.columns,
                e = b ? a.linkedParent : a, h = -1, m = 0;
            a.chart[a.coll].forEach(function (b, d) {
                b.side !== a.side || b.options.isInternal || (m = d, b === e && (h = d))
            });
            return m === h && (B(b) ? c.length === b : !0)
        };
        w.prototype.getMaxLabelDimensions = function (a, b) {
            var d = {
                width: 0,
                height: 0
            };
            b.forEach(function (b) {
                b = a[b];
                if (u(b)) {
                    var c = u(b.label) ? b.label : {};
                    b = c.getBBox ? c.getBBox().height : 0;
                    c.textStr && !B(c.textPxLength) && (c.textPxLength = c.getBBox().width);
                    c = B(c.textPxLength) ? c.textPxLength : 0;
                    d.height = Math.max(b, d.height);
                    d.width = Math.max(c, d.width)
                }
            });
            return d
        };
        c.dateFormats.W = function (a) {
            a = new Date(a);
            a.setHours(0, 0, 0, 0);
            a.setDate(a.getDate() - (a.getDay() || 7));
            var b = new Date(a.getFullYear(), 0, 1);
            return Math.ceil(((a - b) / 864E5 + 1) / 7)
        };
        c.dateFormats.E = function (a) {
            return A("%a", a,
                !0).charAt(0)
        };
        C(b, "afterGetLabelPosition", function (a) {
            var b = this.label, d = this.axis, c = d.reversed, h = d.chart, m = d.options,
                l = m && u(m.grid) ? m.grid : {};
            m = d.options.labels;
            var g = m.align, k = e[d.side], q = a.tickmarkOffset, p = d.tickPositions, r = this.pos - q;
            p = B(p[a.index + 1]) ? p[a.index + 1] - q : d.max + q;
            var w = d.tickSize("tick", !0);
            q = F(w) ? w[0] : 0;
            w = w && w[1] / 2;
            if (!0 === l.enabled) {
                if ("top" === k) {
                    l = d.top + d.offset;
                    var z = l - q
                } else "bottom" === k ? (z = h.chartHeight - d.bottom + d.offset, l = z + q) : (l = d.top + d.len - d.translate(c ? p : r), z = d.top + d.len -
                    d.translate(c ? r : p));
                "right" === k ? (k = h.chartWidth - d.right + d.offset, c = k + q) : "left" === k ? (c = d.left + d.offset, k = c - q) : (k = Math.round(d.left + d.translate(c ? p : r)) - w, c = Math.round(d.left + d.translate(c ? r : p)) - w);
                this.slotWidth = c - k;
                a.pos.x = "left" === g ? k : "right" === g ? c : k + (c - k) / 2;
                a.pos.y = z + (l - z) / 2;
                h = h.renderer.fontMetrics(m.style.fontSize, b.element);
                b = b.getBBox().height;
                m.useHTML ? a.pos.y += h.b + -(b / 2) : (b = Math.round(b / h.h), a.pos.y += (h.b - (h.h - h.f)) / 2 + -((b - 1) * h.h / 2));
                a.pos.x += d.horiz && m.x || 0
            }
        });
        C(w, "afterTickSize", function (a) {
            var b =
                this.maxLabelDimensions, d = this.options;
            !0 === (d && u(d.grid) ? d.grid : {}).enabled && (d = 2 * Math.abs(this.defaultLeftAxisOptions.labels.x), b = d + (this.horiz ? b.height : b.width), F(a.tickSize) ? a.tickSize[0] = b : a.tickSize = [b])
        });
        C(w, "afterGetTitlePosition", function (a) {
            var b = this.options;
            if (!0 === (b && u(b.grid) ? b.grid : {}).enabled) {
                var d = this.axisTitle, c = d && d.getBBox().width, h = this.horiz, m = this.left, l = this.top,
                    g = this.width, k = this.height, q = b.title;
                b = this.opposite;
                var p = this.offset, w = this.tickSize() || [0], z = q.x || 0, y = q.y ||
                    0, A = r(q.margin, h ? 5 : 10);
                d = this.chart.renderer.fontMetrics(q.style && q.style.fontSize, d).f;
                w = (h ? l + k : m) + w[0] / 2 * (b ? -1 : 1) * (h ? 1 : -1) + (this.side === e.bottom ? d : 0);
                a.titlePosition.x = h ? m - c / 2 - A + z : w + (b ? g : 0) + p + z;
                a.titlePosition.y = h ? w - (b ? k : 0) + (b ? d : -d) / 2 + p + y : l - A + y
            }
        });
        k(w.prototype, "unsquish", function (a) {
            var b = this.options;
            return !0 === (b && u(b.grid) ? b.grid : {}).enabled && this.categories ? this.tickInterval : a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        C(w, "afterSetOptions", function (a) {
            var b = this.options;
            a = a.userOptions;
            var d = b && u(b.grid) ? b.grid : {};
            if (!0 === d.enabled) {

                var e = z(!0, {
                    className: "highcharts-grid-axis " + (a.className || ""),
                    dateTimeLabelFormats: {
                        hour: {list: ["%H:%M", "%H"]},
                        day: {list: ["%B%e%A", "%a, %e. %b", "%E"]},
                        // week: {list: ["Week %W", "W%W"]},
                        month: {list: ["%B", "%b", "%o"]}
                    },
                    grid: {borderWidth: 1},
                    labels: {padding: 2, style: {fontSize: "13px"}},
                    margin: 0,
                    title: {text: null, reserveSpace: !1, rotation: 0},
                    units: [["millisecond", [1, 10, 100]], ["second", [1, 10]], ["minute", [1, 5, 15]], ["hour", [1, 6]], ["day", [1]], ["week", [1]], ["month",
                        [1]], ["year", null]]
                }, a);
                console.log(e)
                "xAxis" === this.coll && (y(a.linkedTo) && !y(a.tickPixelInterval) && (e.tickPixelInterval = 350), y(a.tickPixelInterval) || !y(a.linkedTo) || y(a.tickPositioner) || y(a.tickInterval) || (e.tickPositioner = function (a, b) {
                    var d = this.linkedParent && this.linkedParent.tickPositions && this.linkedParent.tickPositions.info;
                    if (d) {
                        var f, h = e.units;
                        for (f = 0; f < h.length; f++) if (h[f][0] === d.unitName) {
                            var m = f;
                            break
                        }
                        if (h[m][1]) {
                            if (h[m + 1]) {
                                var p = h[m + 1][0];
                                var g = (h[m + 1][1] || [1])[0]
                            }
                            d = c.timeUnits[p];
                            this.tickInterval =
                                d * g;
                            return this.getTimeTicks({
                                unitRange: d,
                                count: g,
                                unitName: p
                            }, a, b, this.options.startOfWeek)
                        }
                    }
                }));
                z(!0, this.options, e);
                this.horiz && (b.minPadding = r(a.minPadding, 0), b.maxPadding = r(a.maxPadding, 0));
                B(b.grid.borderWidth) && (b.tickWidth = b.lineWidth = d.borderWidth)
            }
        });
        C(w, "afterSetAxisTranslation", function () {
            var a = this.options, b = a && u(a.grid) ? a.grid : {}, c = this.tickPositions && this.tickPositions.info,
                e = this.userOptions.labels || {};
            this.horiz && (!0 === b.enabled && this.series.forEach(function (a) {
                a.options.pointRange =
                    0
            }), c && (!1 === a.dateTimeLabelFormats[c.unitName].range || 1 < c.count) && !y(e.align) && (a.labels.align = "left", y(e.x) || (a.labels.x = 3)))
        });
        C(w, "trimTicks", function () {
            var a = this.options, b = a && u(a.grid) ? a.grid : {}, c = this.categories, e = this.tickPositions,
                h = e[0], m = e[e.length - 1], l = this.linkedParent && this.linkedParent.min || this.min,
                g = this.linkedParent && this.linkedParent.max || this.max, k = this.tickInterval;
            !0 !== b.enabled || c || !this.horiz && !this.isLinked || (h < l && h + k > l && !a.startOnTick && (e[0] = l), m > g && m - k < g && !a.endOnTick &&
            (e[e.length - 1] = g))
        });
        C(w, "afterRender", function () {
            var a = this.options, b = a && u(a.grid) ? a.grid : {}, c = this.chart.renderer, h = this.horiz;
            if (!0 === b.enabled) {
                b = 2 * Math.abs(this.defaultLeftAxisOptions.labels.x);
                this.maxLabelDimensions = this.getMaxLabelDimensions(this.ticks, this.tickPositions);
                b = this.maxLabelDimensions.width + b;
                var g = a.lineWidth;
                this.rightWall && this.rightWall.destroy();
                var m = this.axisGroup.getBBox();
                if (this.isOuterAxis() && this.axisLine && (h && (b = m.height - 1), g)) {
                    m = this.getLinePath(g);
                    var l = m.indexOf("M") +
                        1;
                    var k = m.indexOf("L") + 1;
                    var q = m.indexOf("M") + 2;
                    var r = m.indexOf("L") + 2;
                    if (this.side === e.top || this.side === e.left) b = -b;
                    h ? (m[q] += b, m[r] += b) : (m[l] += b, m[k] += b);
                    this.axisLineExtra ? this.axisLineExtra.animate({d: m}) : this.axisLineExtra = c.path(m).attr({
                        stroke: a.lineColor,
                        "stroke-width": g,
                        zIndex: 7
                    }).addClass("highcharts-axis-line").add(this.axisGroup);
                    this.axisLine[this.showAxis ? "show" : "hide"](!0)
                }
                (this.columns || []).forEach(function (a) {
                    a.render()
                })
            }
        });
        var h = {
            afterGetOffset: function () {
                (this.columns || []).forEach(function (a) {
                    a.getOffset()
                })
            },
            afterInit: function () {
                var b = this.chart, f = this.userOptions, e = this.options;
                e = e && u(e.grid) ? e.grid : {};
                e.enabled && (a(this), k(this, "labelFormatter", function (a) {
                    var b = this.axis, d = b.tickPositions, e = this.value,
                        f = (b.isLinked ? b.linkedParent : b).series[0], h = e === d[0];
                    d = e === d[d.length - 1];
                    f = f && c.find(f.options.data, function (a) {
                        return a[b.isXAxis ? "x" : "y"] === e
                    });
                    this.isFirst = h;
                    this.isLast = d;
                    this.point = f;
                    return a.call(this)
                }));
                if (e.columns) for (var h = this.columns = [], g = this.columnIndex = 0; ++g < e.columns.length;) {
                    var m = z(f,
                        e.columns[e.columns.length - g - 1], {linkedTo: 0, type: "category"});
                    delete m.grid.columns;
                    m = new w(this.chart, m, !0);
                    m.isColumn = !0;
                    m.columnIndex = g;
                    E(b.axes, m);
                    E(b[this.coll], m);
                    h.push(m)
                }
            }, afterSetOptions: function (a) {
                a = (a = a.userOptions) && u(a.grid) ? a.grid : {};
                var b = a.columns;
                a.enabled && b && z(!0, this.options, b[b.length - 1])
            }, afterSetScale: function () {
                (this.columns || []).forEach(function (a) {
                    a.setScale()
                })
            }, destroy: function (a) {
                (this.columns || []).forEach(function (b) {
                    b.destroy(a.keepEvents)
                })
            }, init: function (a) {
                var b =
                    (a = a.userOptions) && u(a.grid) ? a.grid : {};
                b.enabled && y(b.borderColor) && (a.tickColor = a.lineColor = b.borderColor)
            }
        };
        Object.keys(h).forEach(function (a) {
            C(w, a, h[a])
        });
        C(q, "afterSetChartSize", function () {
            this.axes.forEach(function (a) {
                (a.columns || []).forEach(function (a) {
                    a.setAxisSize();
                    a.setAxisTranslation()
                })
            })
        })
    });
    K(B, "modules/static-scale.src.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber;
        g = c.Chart;
        var F = c.pick;
        c.addEvent(c.Axis, "afterSetOptions", function () {
            var c =
                this.chart.options && this.chart.options.chart;
            !this.horiz && E(this.options.staticScale) && (!c.height || c.scrollablePlotArea && c.scrollablePlotArea.minHeight) && (this.staticScale = this.options.staticScale)
        });
        g.prototype.adjustHeight = function () {
            "adjustHeight" !== this.redrawTrigger && ((this.axes || []).forEach(function (c) {
                var g = c.chart, A = !!g.initiatedScale && g.options.animation, u = c.options.staticScale;
                if (c.staticScale && y(c.min)) {
                    var z = F(c.unitLength, c.max + c.tickInterval - c.min) * u;
                    z = Math.max(z, u);
                    u = z - g.plotHeight;
                    1 <= Math.abs(u) && (g.plotHeight = z, g.redrawTrigger = "adjustHeight", g.setSize(void 0, g.chartHeight + u, A));
                    c.series.forEach(function (c) {
                        (c = c.sharedClipKey && g[c.sharedClipKey]) && c.attr({height: g.plotHeight})
                    })
                }
            }), this.initiatedScale = !0);
            this.redrawTrigger = null
        };
        c.addEvent(g, "render", g.prototype.adjustHeight)
    });
    K(B, "parts-gantt/Tree.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isNumber, E = c.extend, F = c.pick, B = function (c, g) {
            var u = c.reduce(function (c, g) {
                var k = F(g.parent, "");
                void 0 ===
                c[k] && (c[k] = []);
                c[k].push(g);
                return c
            }, {});
            Object.keys(u).forEach(function (c, k) {
                var q = u[c];
                "" !== c && -1 === g.indexOf(c) && (q.forEach(function (c) {
                    k[""].push(c)
                }), delete k[c])
            });
            return u
        }, C = function (c, g, z, r, k, q) {
            var u = 0, b = 0, a = q && q.after, e = q && q.before;
            g = {data: r, depth: z - 1, id: c, level: z, parent: g};
            var h, d;
            "function" === typeof e && e(g, q);
            e = (k[c] || []).map(function (a) {
                var e = C(a.id, c, z + 1, a, k, q), f = a.start;
                a = !0 === a.milestone ? f : a.end;
                h = !y(h) || f < h ? f : h;
                d = !y(d) || a > d ? a : d;
                u = u + 1 + e.descendants;
                b = Math.max(e.height + 1, b);
                return e
            });
            r && (r.start = F(r.start, h), r.end = F(r.end, d));
            E(g, {children: e, descendants: u, height: b});
            "function" === typeof a && a(g, q);
            return g
        };
        return {
            getListOfParents: B, getNode: C, getTree: function (c, g) {
                var u = c.map(function (c) {
                    return c.id
                });
                c = B(c, u);
                return C("", null, 1, null, c, g)
            }
        }
    });
    K(B, "mixins/tree-series.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isArray, E = g.isNumber, F = g.isObject, B = c.extend, C = c.merge, A = c.pick;
        return {
            getColor: function (g, z) {
                var r = z.index, k = z.mapOptionsToLevel, q = z.parentColor,
                    u = z.parentColorIndex, b = z.series, a = z.colors, e = z.siblings, h = b.points,
                    d = b.chart.options.chart, f;
                if (g) {
                    h = h[g.i];
                    g = k[g.level] || {};
                    if (k = h && g.colorByPoint) {
                        var n = h.index % (a ? a.length : d.colorCount);
                        var x = a && a[n]
                    }
                    if (!b.chart.styledMode) {
                        a = h && h.options.color;
                        d = g && g.color;
                        if (f = q) f = (f = g && g.colorVariation) && "brightness" === f.key ? c.color(q).brighten(r / e * f.to).get() : q;
                        f = A(a, d, x, f, b.color)
                    }
                    var v = A(h && h.options.colorIndex, g && g.colorIndex, n, u, z.colorIndex)
                }
                return {color: f, colorIndex: v}
            }, getLevelOptions: function (c) {
                var g =
                    null;
                if (F(c)) {
                    g = {};
                    var r = E(c.from) ? c.from : 1;
                    var k = c.levels;
                    var q = {};
                    var u = F(c.defaults) ? c.defaults : {};
                    y(k) && (q = k.reduce(function (b, a) {
                        if (F(a) && E(a.level)) {
                            var c = C({}, a);
                            var h = "boolean" === typeof c.levelIsConstant ? c.levelIsConstant : u.levelIsConstant;
                            delete c.levelIsConstant;
                            delete c.level;
                            a = a.level + (h ? 0 : r - 1);
                            F(b[a]) ? B(b[a], c) : b[a] = c
                        }
                        return b
                    }, {}));
                    k = E(c.to) ? c.to : 1;
                    for (c = 0; c <= k; c++) g[c] = C({}, u, F(q[c]) ? q[c] : {})
                }
                return g
            }, setTreeValues: function k(c, g) {
                var q = g.before, r = g.idRoot, b = g.mapIdToNode[r], a = g.points[c.i],
                    e = a && a.options || {}, h = 0, d = [];
                B(c, {
                    levelDynamic: c.level - (("boolean" === typeof g.levelIsConstant ? g.levelIsConstant : 1) ? 0 : b.level),
                    name: A(a && a.name, ""),
                    visible: r === c.id || ("boolean" === typeof g.visible ? g.visible : !1)
                });
                "function" === typeof q && (c = q(c, g));
                c.children.forEach(function (a, b) {
                    var e = B({}, g);
                    B(e, {index: b, siblings: c.children.length, visible: c.visible});
                    a = k(a, e);
                    d.push(a);
                    a.visible && (h += a.val)
                });
                c.visible = 0 < h || c.visible;
                q = A(e.value, h);
                B(c, {children: d, childrenTotal: h, isLeaf: c.visible && !h, val: q});
                return c
            },
            updateRootId: function (c) {
                if (F(c)) {
                    var g = F(c.options) ? c.options : {};
                    g = A(c.rootNode, g.rootId, "");
                    F(c.userOptions) && (c.userOptions.rootId = g);
                    c.rootNode = g
                }
                return g
            }
        }
    });
    K(B, "modules/broken-axis.src.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isArray;
        g = c.addEvent;
        var E = c.pick, F = c.extend, B = c.find, C = c.fireEvent, A = c.Axis, u = c.Series, z = function (c, g) {
            return B(g, function (g) {
                return g.from < c && c < g.to
            })
        };
        F(A.prototype, {
            isInBreak: function (c, g) {
                var k = c.repeat || Infinity, r = c.from, b = c.to - c.from;
                g = g >= r ? (g - r) % k : k - (r - g) % k;
                return c.inclusive ? g <= b : g < b && 0 !== g
            }, isInAnyBreak: function (c, g) {
                var k = this.options.breaks, r = k && k.length, b;
                if (r) {
                    for (; r--;) if (this.isInBreak(k[r], c)) {
                        var a = !0;
                        b || (b = E(k[r].showPoints, !this.isXAxis))
                    }
                    var e = a && g ? a && !b : a
                }
                return e
            }
        });
        g(A, "afterInit", function () {
            "function" === typeof this.setBreaks && this.setBreaks(this.options.breaks, !1)
        });
        g(A, "afterSetTickPositions", function () {
            if (this.isBroken) {
                var c = this.tickPositions, g = this.tickPositions.info, q = [], u;
                for (u = 0; u < c.length; u++) this.isInAnyBreak(c[u]) ||
                q.push(c[u]);
                this.tickPositions = q;
                this.tickPositions.info = g
            }
        });
        g(A, "afterSetOptions", function () {
            this.isBroken && (this.options.ordinal = !1)
        });
        A.prototype.setBreaks = function (c, g) {
            function k(a) {
                var c = a, d;
                for (d = 0; d < b.breakArray.length; d++) {
                    var e = b.breakArray[d];
                    if (e.to <= a) c -= e.len; else if (e.from >= a) break; else if (b.isInBreak(e, a)) {
                        c -= a - e.from;
                        break
                    }
                }
                return c
            }

            function r(a) {
                var c;
                for (c = 0; c < b.breakArray.length; c++) {
                    var d = b.breakArray[c];
                    if (d.from >= a) break; else d.to < a ? a += d.len : b.isInBreak(d, a) && (a += d.len)
                }
                return a
            }

            var b = this, a = y(c) && !!c.length;
            b.isDirty = b.isBroken !== a;
            b.isBroken = a;
            b.options.breaks = b.userOptions.breaks = c;
            b.forceRedraw = !0;
            a || b.val2lin !== k || (delete b.val2lin, delete b.lin2val);
            a && (b.userOptions.ordinal = !1, b.val2lin = k, b.lin2val = r, b.setExtremes = function (a, b, d, c, g) {
                if (this.isBroken) {
                    for (var e, f = this.options.breaks; e = z(a, f);) a = e.to;
                    for (; e = z(b, f);) b = e.from;
                    b < a && (b = a)
                }
                A.prototype.setExtremes.call(this, a, b, d, c, g)
            }, b.setAxisTranslation = function (a) {
                A.prototype.setAxisTranslation.call(this, a);
                this.unitLength =
                    null;
                if (this.isBroken) {
                    a = b.options.breaks;
                    var c = [], d = [], e = 0, g, k = b.userMin || b.min, v = b.userMax || b.max,
                        m = E(b.pointRangePadding, 0), l;
                    a.forEach(function (a) {
                        g = a.repeat || Infinity;
                        b.isInBreak(a, k) && (k += a.to % g - k % g);
                        b.isInBreak(a, v) && (v -= v % g - a.from % g)
                    });
                    a.forEach(function (a) {
                        q = a.from;
                        for (g = a.repeat || Infinity; q - g > k;) q -= g;
                        for (; q < k;) q += g;
                        for (l = q; l < v; l += g) c.push({value: l, move: "in"}), c.push({
                            value: l + (a.to - a.from),
                            move: "out",
                            size: a.breakSize
                        })
                    });
                    c.sort(function (a, b) {
                        return a.value === b.value ? ("in" === a.move ? 0 : 1) - ("in" ===
                        b.move ? 0 : 1) : a.value - b.value
                    });
                    var t = 0;
                    var q = k;
                    c.forEach(function (a) {
                        t += "in" === a.move ? 1 : -1;
                        1 === t && "in" === a.move && (q = a.value);
                        0 === t && (d.push({
                            from: q,
                            to: a.value,
                            len: a.value - q - (a.size || 0)
                        }), e += a.value - q - (a.size || 0))
                    });
                    b.breakArray = d;
                    b.unitLength = v - k - e + m;
                    C(b, "afterBreaks");
                    b.staticScale ? b.transA = b.staticScale : b.unitLength && (b.transA *= (v - b.min + m) / b.unitLength);
                    m && (b.minPixelPadding = b.transA * b.minPointOffset);
                    b.min = k;
                    b.max = v
                }
            });
            E(g, !0) && this.chart.redraw()
        };
        g(u, "afterGeneratePoints", function () {
            var c = this.xAxis,
                g = this.yAxis, q = this.points, u = q.length, b = this.options.connectNulls;
            if (c && g && (c.options.breaks || g.options.breaks)) for (; u--;) {
                var a = q[u];
                var e = null === a.y && !1 === b;
                e || !c.isInAnyBreak(a.x, !0) && !g.isInAnyBreak(a.y, !0) || (q.splice(u, 1), this.data[u] && this.data[u].destroyElements())
            }
        });
        g(u, "afterRender", function () {
            this.drawBreaks(this.xAxis, ["x"]);
            this.drawBreaks(this.yAxis, E(this.pointArrayMap, ["y"]))
        });
        c.Series.prototype.drawBreaks = function (c, g) {
            var k = this, r = k.points, b, a, e, h;
            c && g.forEach(function (d) {
                b = c.breakArray ||
                    [];
                a = c.isXAxis ? c.min : E(k.options.threshold, c.min);
                r.forEach(function (f) {
                    h = E(f["stack" + d.toUpperCase()], f[d]);
                    b.forEach(function (b) {
                        e = !1;
                        if (a < b.from && h > b.to || a > b.from && h < b.from) e = "pointBreak"; else if (a < b.from && h > b.from && h < b.to || a > b.from && h > b.to && h < b.from) e = "pointInBreak";
                        e && C(c, e, {point: f, brk: b})
                    })
                })
            })
        };
        c.Series.prototype.gappedPath = function () {
            var g = this.currentDataGrouping, k = g && g.gapSize;
            g = this.options.gapSize;
            var q = this.points.slice(), u = q.length - 1, b = this.yAxis;
            if (g && 0 < u) for ("value" !== this.options.gapUnit &&
                                 (g *= this.basePointRange), k && k > g && k >= this.basePointRange && (g = k); u--;) q[u + 1].x - q[u].x > g && (k = (q[u].x + q[u + 1].x) / 2, q.splice(u + 1, 0, {
                isNull: !0,
                x: k
            }), this.options.stacking && (k = b.stacks[this.stackKey][k] = new c.StackItem(b, b.options.stackLabels, !1, k, this.stack), k.total = 0));
            return this.getGraphPath(q)
        }
    });
    K(B, "parts-gantt/TreeGrid.js", [B["parts/Globals.js"], B["parts/Utilities.js"], B["parts-gantt/Tree.js"], B["mixins/tree-series.js"]], function (c, g, y, E) {
        var F = g.defined, B = g.isNumber, C = g.isString, A = c.addEvent, u = function (a) {
            return Array.prototype.slice.call(a,
                1)
        }, z = c.extend, r = c.find, k = c.fireEvent, q = E.getLevelOptions, w = c.merge, b = function (a) {
            return g.isObject(a, !0)
        }, a = c.pick, e = c.wrap;
        E = c.Axis;
        var h = c.Tick, d = function (a, b) {
            var d;
            for (d in b) if (Object.hasOwnProperty.call(b, d)) {
                var c = b[d];
                e(a, d, c)
            }
        }, f = function (a, b) {
            var d = a.collapseStart;
            a = a.collapseEnd;
            a >= b && (d -= .5);
            return {from: d, to: a, showPoints: !1}
        }, n = function (a) {
            return Object.keys(a.mapOfPosToGridNode).reduce(function (b, d) {
                d = +d;
                a.min <= d && a.max >= d && !a.isInAnyBreak(d) && b.push(d);
                return b
            }, [])
        }, x = function (a, b) {
            var d =
                a.options.breaks || [], c = f(b, a.max);
            return d.some(function (a) {
                return a.from === c.from && a.to === c.to
            })
        }, v = function (a, b) {
            var d = a.options.breaks || [];
            a = f(b, a.max);
            d.push(a);
            return d
        }, m = function (a, b) {
            var d = a.options.breaks || [], c = f(b, a.max);
            return d.reduce(function (a, b) {
                b.to === c.to && b.from === c.from || a.push(b);
                return a
            }, [])
        }, l = function (b, d) {
            var c = b.labelIcon, e = !c, f = d.renderer, h = d.xy, l = d.options, g = l.width, m = l.height,
                p = h.x - g / 2 - l.padding;
            h = h.y - m / 2;
            var n = d.collapsed ? 90 : 180, k = d.show && B(h);
            e && (b.labelIcon = c = f.path(f.symbols[l.type](l.x,
                l.y, g, m)).addClass("highcharts-label-icon").add(d.group));
            k || c.attr({y: -9999});
            f.styledMode || c.attr({"stroke-width": 1, fill: a(d.color, "#666666")}).css({
                cursor: "pointer",
                stroke: l.lineColor,
                strokeWidth: l.lineWidth
            });
            c[e ? "attr" : "animate"]({translateX: p, translateY: h, rotation: n})
        }, t = function (a, d, c) {
            var e = [], f = [], h = {}, l = {}, g = -1, m = "boolean" === typeof d ? d : !1;
            a = y.getTree(a, {
                after: function (a) {
                    a = l[a.pos];
                    var b = 0, d = 0;
                    a.children.forEach(function (a) {
                        d += a.descendants + 1;
                        b = Math.max(a.height + 1, b)
                    });
                    a.descendants = d;
                    a.height =
                        b;
                    a.collapsed && f.push(a)
                }, before: function (a) {
                    var d = b(a.data) ? a.data : {}, c = C(d.name) ? d.name : "", f = h[a.parent];
                    f = b(f) ? l[f.pos] : null;
                    var p = function (a) {
                        return a.name === c
                    }, n;
                    m && b(f) && (n = r(f.children, p)) ? (p = n.pos, n.nodes.push(a)) : p = g++;
                    l[p] || (l[p] = n = {
                        depth: f ? f.depth + 1 : 0,
                        name: c,
                        nodes: [a],
                        children: [],
                        pos: p
                    }, -1 !== p && e.push(c), b(f) && f.children.push(n));
                    C(a.id) && (h[a.id] = a);
                    !0 === d.collapsed && (n.collapsed = !0);
                    a.pos = p
                }
            });
            l = function (a, d) {
                var c = function (a, e, f) {
                    var h = e + (-1 === e ? 0 : d - 1), l = (h - e) / 2, g = e + l;
                    a.nodes.forEach(function (a) {
                        var d =
                            a.data;
                        b(d) && (d.y = e + d.seriesIndex, delete d.seriesIndex);
                        a.pos = g
                    });
                    f[g] = a;
                    a.pos = g;
                    a.tickmarkOffset = l + .5;
                    a.collapseStart = h + .5;
                    a.children.forEach(function (a) {
                        c(a, h + 1, f);
                        h = a.collapseEnd - .5
                    });
                    a.collapseEnd = h + .5;
                    return f
                };
                return c(a["-1"], -1, {})
            }(l, c);
            return {categories: e, mapOfIdToNode: h, mapOfPosToGridNode: l, collapsedNodes: f, tree: a}
        }, G = function (a) {
            a.target.axes.filter(function (a) {
                return "treegrid" === a.options.type
            }).forEach(function (d) {
                var e = d.options || {}, f = e.labels, h, l = e.uniqueNames, g = 0;
                if (!d.mapOfPosToGridNode ||
                    d.series.some(function (a) {
                        return !a.hasRendered || a.isDirtyData || a.isDirty
                    })) {
                    e = d.series.reduce(function (a, d) {
                        d.visible && (d.options.data.forEach(function (d) {
                            b(d) && (d.seriesIndex = g, a.push(d))
                        }), !0 === l && g++);
                        return a
                    }, []);
                    var m = t(e, l, !0 === l ? g : 1);
                    d.categories = m.categories;
                    d.mapOfPosToGridNode = m.mapOfPosToGridNode;
                    d.hasNames = !0;
                    d.tree = m.tree;
                    d.series.forEach(function (a) {
                        var d = a.options.data.map(function (a) {
                            return b(a) ? w(a) : a
                        });
                        a.visible && a.setData(d, !1)
                    });
                    d.mapOptionsToLevel = q({
                        defaults: f, from: 1, levels: f.levels,
                        to: d.tree.height
                    });
                    "beforeRender" === a.type && (h = c.addEvent(d, "foundExtremes", function () {
                        m.collapsedNodes.forEach(function (a) {
                            a = v(d, a);
                            d.setBreaks(a, !1)
                        });
                        h()
                    }))
                }
            })
        };
        d(E.prototype, {
            init: function (a, b, d) {
                var c = "treegrid" === d.type;
                c && (A(b, "beforeRender", G), A(b, "beforeRedraw", G), d = w({
                    grid: {enabled: !0},
                    labels: {
                        align: "left",
                        levels: [{level: void 0}, {level: 1, style: {fontWeight: "bold"}}],
                        symbol: {type: "triangle", x: -5, y: -5, height: 10, width: 10, padding: 5}
                    },
                    uniqueNames: !1
                }, d, {reversed: !0, grid: {columns: void 0}}));
                a.apply(this,
                    [b, d]);
                c && (this.hasNames = !0, this.options.showLastLabel = !0)
            }, getMaxLabelDimensions: function (a) {
                var b = this.options, d = b && b.labels;
                b = d && B(d.indentation) ? b.labels.indentation : 0;
                d = a.apply(this, u(arguments));
                if ("treegrid" === this.options.type && this.mapOfPosToGridNode) {
                    var c = this.mapOfPosToGridNode[-1].height;
                    d.width += b * (c - 1)
                }
                return d
            }, generateTick: function (a, d) {
                var c = b(this.mapOptionsToLevel) ? this.mapOptionsToLevel : {}, e = this.ticks, f = e[d], l;
                if ("treegrid" === this.options.type) {
                    var g = this.mapOfPosToGridNode[d];
                    (c = c[g.depth]) && (l = {labels: c});
                    f ? (f.parameters.category = g.name, f.options = l, f.addLabel()) : e[d] = new h(this, d, null, void 0, {
                        category: g.name,
                        tickmarkOffset: g.tickmarkOffset,
                        options: l
                    })
                } else a.apply(this, u(arguments))
            }, setTickInterval: function (b) {
                var d = this.options;
                "treegrid" === d.type ? (this.min = a(this.userMin, d.min, this.dataMin), this.max = a(this.userMax, d.max, this.dataMax), k(this, "foundExtremes"), this.setAxisTranslation(!0), this.tickmarkOffset = .5, this.tickInterval = 1, this.tickPositions = this.mapOfPosToGridNode ?
                    n(this) : []) : b.apply(this, u(arguments))
            }
        });
        d(h.prototype, {
            getLabelPosition: function (d, c, e, f, h, l, g, m, n) {
                var p = a(this.options && this.options.labels, l);
                l = this.pos;
                var k = this.axis, t = "treegrid" === k.options.type;
                d = d.apply(this, [c, e, f, h, p, g, m, n]);
                t && (c = p && b(p.symbol) ? p.symbol : {}, p = p && B(p.indentation) ? p.indentation : 0, l = (l = (k = k.mapOfPosToGridNode) && k[l]) && l.depth || 1, d.x += c.width + 2 * c.padding + (l - 1) * p);
                return d
            }, renderLabel: function (d) {
                var e = this, f = e.pos, h = e.axis, g = e.label, m = h.mapOfPosToGridNode, n = h.options, k =
                        a(e.options && e.options.labels, n && n.labels), t = k && b(k.symbol) ? k.symbol : {},
                    q = (m = m && m[f]) && m.depth;
                n = "treegrid" === n.type;
                var v = !(!g || !g.element), r = -1 < h.tickPositions.indexOf(f);
                f = h.chart.styledMode;
                n && m && v && g.addClass("highcharts-treegrid-node-level-" + q);
                d.apply(e, u(arguments));
                n && m && v && 0 < m.descendants && (h = x(h, m), l(e, {
                    color: !f && g.styles.color,
                    collapsed: h,
                    group: g.parentGroup,
                    options: t,
                    renderer: g.renderer,
                    show: r,
                    xy: g.xy
                }), t = "highcharts-treegrid-node-" + (h ? "expanded" : "collapsed"), g.addClass("highcharts-treegrid-node-" +
                    (h ? "collapsed" : "expanded")).removeClass(t), f || g.css({cursor: "pointer"}), [g, e.labelIcon].forEach(function (a) {
                    a.attachedTreeGridEvents || (c.addEvent(a.element, "mouseover", function () {
                        g.addClass("highcharts-treegrid-node-active");
                        g.renderer.styledMode || g.css({textDecoration: "underline"})
                    }), c.addEvent(a.element, "mouseout", function () {
                        var a = F(k.style) ? k.style : {};
                        g.removeClass("highcharts-treegrid-node-active");
                        g.renderer.styledMode || g.css({textDecoration: a.textDecoration})
                    }), c.addEvent(a.element, "click",
                        function () {
                            e.toggleCollapse()
                        }), a.attachedTreeGridEvents = !0)
                }))
            }
        });
        z(h.prototype, {
            collapse: function (b) {
                var d = this.axis, c = v(d, d.mapOfPosToGridNode[this.pos]);
                d.setBreaks(c, a(b, !0))
            }, expand: function (b) {
                var d = this.axis, c = m(d, d.mapOfPosToGridNode[this.pos]);
                d.setBreaks(c, a(b, !0))
            }, toggleCollapse: function (b) {
                var d = this.axis;
                var c = d.mapOfPosToGridNode[this.pos];
                c = x(d, c) ? m(d, c) : v(d, c);
                d.setBreaks(c, a(b, !0))
            }
        });
        E.prototype.utils = {getNode: y.getNode}
    });
    K(B, "parts-gantt/PathfinderAlgorithms.js", [B["parts/Globals.js"]],
        function (c) {
            function g(c, g, k) {
                k = k || 0;
                var q = c.length - 1;
                g -= 1e-7;
                for (var r, b; k <= q;) if (r = q + k >> 1, b = g - c[r].xMin, 0 < b) k = r + 1; else if (0 > b) q = r - 1; else return r;
                return 0 < k ? k - 1 : 0
            }

            function y(c, r) {
                for (var k = g(c, r.x + 1) + 1; k--;) {
                    var q;
                    if (q = c[k].xMax >= r.x) q = c[k], q = r.x <= q.xMax && r.x >= q.xMin && r.y <= q.yMax && r.y >= q.yMin;
                    if (q) return k
                }
                return -1
            }

            function E(c) {
                var g = [];
                if (c.length) {
                    g.push("M", c[0].start.x, c[0].start.y);
                    for (var k = 0; k < c.length; ++k) g.push("L", c[k].end.x, c[k].end.y)
                }
                return g
            }

            function B(c, g) {
                c.yMin = C(c.yMin, g.yMin);
                c.yMax = I(c.yMax, g.yMax);
                c.xMin = C(c.xMin, g.xMin);
                c.xMax = I(c.xMax, g.xMax)
            }

            var I = Math.min, C = Math.max, A = Math.abs, u = c.pick;
            return {
                straight: function (c, g) {
                    return {path: ["M", c.x, c.y, "L", g.x, g.y], obstacles: [{start: c, end: g}]}
                }, simpleConnect: c.extend(function (c, g, k) {
                    function q(a, b, d, c, e) {
                        a = {x: a.x, y: a.y};
                        a[b] = d[c || b] + (e || 0);
                        return a
                    }

                    function r(a, b, d) {
                        var c = A(b[d] - a[d + "Min"]) > A(b[d] - a[d + "Max"]);
                        return q(b, d, a, d + (c ? "Max" : "Min"), c ? 1 : -1)
                    }

                    var b = [], a = u(k.startDirectionX, A(g.x - c.x) > A(g.y - c.y)) ? "x" : "y", e = k.chartObstacles,
                        h = y(e, c);
                    k = y(e, g);
                    if (-1 < k) {
                        var d = e[k];
                        k = r(d, g, a);
                        d = {start: k, end: g};
                        var f = k
                    } else f = g;
                    -1 < h && (e = e[h], k = r(e, c, a), b.push({
                        start: c,
                        end: k
                    }), k[a] >= c[a] === k[a] >= f[a] && (a = "y" === a ? "x" : "y", g = c[a] < g[a], b.push({
                        start: k,
                        end: q(k, a, e, a + (g ? "Max" : "Min"), g ? 1 : -1)
                    }), a = "y" === a ? "x" : "y"));
                    c = b.length ? b[b.length - 1].end : c;
                    k = q(c, a, f);
                    b.push({start: c, end: k});
                    a = q(k, "y" === a ? "x" : "y", f);
                    b.push({start: k, end: a});
                    b.push(d);
                    return {path: E(b), obstacles: b}
                }, {requiresObstacles: !0}), fastAvoid: c.extend(function (c, r, k) {
                    function q(a, b, d) {
                        var c,
                            e = a.x < b.x ? 1 : -1;
                        if (a.x < b.x) {
                            var f = a;
                            var h = b
                        } else f = b, h = a;
                        if (a.y < b.y) {
                            var l = a;
                            var m = b
                        } else l = b, m = a;
                        for (c = 0 > e ? I(g(t, h.x), t.length - 1) : 0; t[c] && (0 < e && t[c].xMin <= h.x || 0 > e && t[c].xMax >= f.x);) {
                            if (t[c].xMin <= h.x && t[c].xMax >= f.x && t[c].yMin <= m.y && t[c].yMax >= l.y) return d ? {
                                y: a.y,
                                x: a.x < b.x ? t[c].xMin - 1 : t[c].xMax + 1,
                                obstacle: t[c]
                            } : {x: a.x, y: a.y < b.y ? t[c].yMin - 1 : t[c].yMax + 1, obstacle: t[c]};
                            c += e
                        }
                        return b
                    }

                    function w(a, b, d, c, e) {
                        var f = e.soft, h = e.hard, l = c ? "x" : "y", g = {x: b.x, y: b.y}, m = {x: b.x, y: b.y};
                        e = a[l + "Max"] >= f[l + "Max"];
                        f = a[l +
                        "Min"] <= f[l + "Min"];
                        var n = a[l + "Max"] >= h[l + "Max"];
                        h = a[l + "Min"] <= h[l + "Min"];
                        var p = A(a[l + "Min"] - b[l]), k = A(a[l + "Max"] - b[l]);
                        d = 10 > A(p - k) ? b[l] < d[l] : k < p;
                        m[l] = a[l + "Min"];
                        g[l] = a[l + "Max"];
                        a = q(b, m, c)[l] !== m[l];
                        b = q(b, g, c)[l] !== g[l];
                        d = a ? b ? d : !0 : b ? !1 : d;
                        d = f ? e ? d : !0 : e ? !1 : d;
                        return h ? n ? d : !0 : n ? !1 : d
                    }

                    function b(a, d, c) {
                        if (a.x === d.x && a.y === d.y) return [];
                        var e = c ? "x" : "y", h = k.obstacleOptions.margin;
                        var g = {soft: {xMin: x, xMax: v, yMin: m, yMax: l}, hard: k.hardBounds};
                        var n = y(t, a);
                        if (-1 < n) {
                            n = t[n];
                            g = w(n, a, d, c, g);
                            B(n, k.hardBounds);
                            var p =
                                c ? {y: a.y, x: n[g ? "xMax" : "xMin"] + (g ? 1 : -1)} : {
                                    x: a.x,
                                    y: n[g ? "yMax" : "yMin"] + (g ? 1 : -1)
                                };
                            var r = y(t, p);
                            -1 < r && (r = t[r], B(r, k.hardBounds), p[e] = g ? C(n[e + "Max"] - h + 1, (r[e + "Min"] + n[e + "Max"]) / 2) : I(n[e + "Min"] + h - 1, (r[e + "Max"] + n[e + "Min"]) / 2), a.x === p.x && a.y === p.y ? (f && (p[e] = g ? C(n[e + "Max"], r[e + "Max"]) + 1 : I(n[e + "Min"], r[e + "Min"]) - 1), f = !f) : f = !1);
                            a = [{start: a, end: p}]
                        } else e = q(a, {x: c ? d.x : a.x, y: c ? a.y : d.y}, c), a = [{
                            start: a,
                            end: {x: e.x, y: e.y}
                        }], e[c ? "x" : "y"] !== d[c ? "x" : "y"] && (g = w(e.obstacle, e, d, !c, g), B(e.obstacle, k.hardBounds), g = {
                            x: c ? e.x :
                                e.obstacle[g ? "xMax" : "xMin"] + (g ? 1 : -1),
                            y: c ? e.obstacle[g ? "yMax" : "yMin"] + (g ? 1 : -1) : e.y
                        }, c = !c, a = a.concat(b({x: e.x, y: e.y}, g, c)));
                        return a = a.concat(b(a[a.length - 1].end, d, !c))
                    }

                    function a(a, b, d) {
                        var c = I(a.xMax - b.x, b.x - a.xMin) < I(a.yMax - b.y, b.y - a.yMin);
                        d = w(a, b, d, c, {soft: k.hardBounds, hard: k.hardBounds});
                        return c ? {y: b.y, x: a[d ? "xMax" : "xMin"] + (d ? 1 : -1)} : {
                            x: b.x,
                            y: a[d ? "yMax" : "yMin"] + (d ? 1 : -1)
                        }
                    }

                    var e = u(k.startDirectionX, A(r.x - c.x) > A(r.y - c.y)), h = e ? "x" : "y", d = [], f = !1,
                        n = k.obstacleMetrics, x = I(c.x, r.x) - n.maxWidth - 10, v = C(c.x,
                        r.x) + n.maxWidth + 10, m = I(c.y, r.y) - n.maxHeight - 10, l = C(c.y, r.y) + n.maxHeight + 10,
                        t = k.chartObstacles;
                    var G = g(t, x);
                    n = g(t, v);
                    t = t.slice(G, n + 1);
                    if (-1 < (n = y(t, r))) {
                        var D = a(t[n], r, c);
                        d.push({end: r, start: D});
                        r = D
                    }
                    for (; -1 < (n = y(t, r));) G = 0 > r[h] - c[h], D = {
                        x: r.x,
                        y: r.y
                    }, D[h] = t[n][G ? h + "Max" : h + "Min"] + (G ? 1 : -1), d.push({end: r, start: D}), r = D;
                    c = b(c, r, e);
                    c = c.concat(d.reverse());
                    return {path: E(c), obstacles: c}
                }, {requiresObstacles: !0})
            }
        });
    K(B, "parts-gantt/ArrowSymbols.js", [B["parts/Globals.js"]], function (c) {
        c.SVGRenderer.prototype.symbols.arrow =
            function (c, y, E, B) {
                return ["M", c, y + B / 2, "L", c + E, y, "L", c, y + B / 2, "L", c + E, y + B]
            };
        c.SVGRenderer.prototype.symbols["arrow-half"] = function (g, y, E, B) {
            return c.SVGRenderer.prototype.symbols.arrow(g, y, E / 2, B)
        };
        c.SVGRenderer.prototype.symbols["triangle-left"] = function (c, y, E, B) {
            return ["M", c + E, y, "L", c, y + B / 2, "L", c + E, y + B, "Z"]
        };
        c.SVGRenderer.prototype.symbols["arrow-filled"] = c.SVGRenderer.prototype.symbols["triangle-left"];
        c.SVGRenderer.prototype.symbols["triangle-left-half"] = function (g, y, E, B) {
            return c.SVGRenderer.prototype.symbols["triangle-left"](g,
                y, E / 2, B)
        };
        c.SVGRenderer.prototype.symbols["arrow-filled-half"] = c.SVGRenderer.prototype.symbols["triangle-left-half"]
    });
    K(B, "parts-gantt/Pathfinder.js", [B["parts/Globals.js"], B["parts/Utilities.js"], B["parts-gantt/PathfinderAlgorithms.js"]], function (c, g, y) {
        function E(a) {
            var b = a.shapeArgs;
            return b ? {
                xMin: b.x,
                xMax: b.x + b.width,
                yMin: b.y,
                yMax: b.y + b.height
            } : (b = a.graphic && a.graphic.getBBox()) ? {
                xMin: a.plotX - b.width / 2,
                xMax: a.plotX + b.width / 2,
                yMin: a.plotY - b.height / 2,
                yMax: a.plotY + b.height / 2
            } : null
        }

        function B(c) {
            for (var d =
                c.length, f = 0, h, g, k = [], m = function (a, d, c) {
                c = b(c, 10);
                var f = a.yMax + c > d.yMin - c && a.yMin - c < d.yMax + c,
                    h = a.xMax + c > d.xMin - c && a.xMin - c < d.xMax + c,
                    l = f ? a.xMin > d.xMax ? a.xMin - d.xMax : d.xMin - a.xMax : Infinity,
                    g = h ? a.yMin > d.yMax ? a.yMin - d.yMax : d.yMin - a.yMax : Infinity;
                return h && f ? c ? m(a, d, Math.floor(c / 2)) : Infinity : e(l, g)
            }; f < d; ++f) for (h = f + 1; h < d; ++h) g = m(c[f], c[h]), 80 > g && k.push(g);
            k.push(80);
            return a(Math.floor(k.sort(function (a, b) {
                return a - b
            })[Math.floor(k.length / 10)] / 2 - 1), 1)
        }

        function I(a, b, c) {
            this.init(a, b, c)
        }

        function C(a) {
            this.init(a)
        }

        function A(a) {
            if (a.options.pathfinder || a.series.reduce(function (a, b) {
                b.options && w(!0, b.options.connectors = b.options.connectors || {}, b.options.pathfinder);
                return a || b.options && b.options.pathfinder
            }, !1)) w(!0, a.options.connectors = a.options.connectors || {}, a.options.pathfinder), c.error('WARNING: Pathfinder options have been renamed. Use "chart.connectors" or "series.connectors" instead.')
        }

        var u = g.defined, z = g.objectEach, r = g.splat, k = c.deg2rad;
        g = c.extend;
        var q = c.addEvent, w = c.merge, b = c.pick, a = Math.max, e = Math.min;
        g(c.defaultOptions, {
            connectors: {
                type: "straight",
                lineWidth: 1,
                marker: {enabled: !1, align: "center", verticalAlign: "middle", inside: !1, lineWidth: 1},
                startMarker: {symbol: "diamond"},
                endMarker: {symbol: "arrow-filled"}
            }
        });
        I.prototype = {
            init: function (a, b, c) {
                this.fromPoint = a;
                this.toPoint = b;
                this.options = c;
                this.chart = a.series.chart;
                this.pathfinder = this.chart.pathfinder
            }, renderPath: function (a, b, c) {
                var d = this.chart, e = d.styledMode, f = d.pathfinder, h = !d.options.chart.forExport && !1 !== c,
                    l = this.graphics && this.graphics.path;
                f.group || (f.group = d.renderer.g().addClass("highcharts-pathfinder-group").attr({zIndex: -1}).add(d.seriesGroup));
                f.group.translate(d.plotLeft, d.plotTop);
                l && l.renderer || (l = d.renderer.path().add(f.group), e || l.attr({opacity: 0}));
                l.attr(b);
                a = {d: a};
                e || (a.opacity = 1);
                l[h ? "animate" : "attr"](a, c);
                this.graphics = this.graphics || {};
                this.graphics.path = l
            }, addMarker: function (a, b, c) {
                var d = this.fromPoint.series.chart, e = d.pathfinder;
                d = d.renderer;
                var f = "start" === a ? this.fromPoint : this.toPoint, h = f.getPathfinderAnchorPoint(b);
                if (b.enabled) {
                    c = "start" === a ? {x: c[4], y: c[5]} : {x: c[c.length - 5], y: c[c.length - 4]};
                    c = f.getRadiansToVector(c, h);
                    h = f.getMarkerVector(c, b.radius, h);
                    c = -c / k;
                    if (b.width && b.height) {
                        var l = b.width;
                        var g = b.height
                    } else l = g = 2 * b.radius;
                    this.graphics = this.graphics || {};
                    h = {
                        x: h.x - l / 2,
                        y: h.y - g / 2,
                        width: l,
                        height: g,
                        rotation: c,
                        rotationOriginX: h.x,
                        rotationOriginY: h.y
                    };
                    this.graphics[a] ? this.graphics[a].animate(h) : (this.graphics[a] = d.symbol(b.symbol).addClass("highcharts-point-connecting-path-" + a + "-marker").attr(h).add(e.group),
                    d.styledMode || this.graphics[a].attr({
                        fill: b.color || this.fromPoint.color,
                        stroke: b.lineColor,
                        "stroke-width": b.lineWidth,
                        opacity: 0
                    }).animate({opacity: 1}, f.series.options.animation))
                }
            }, getPath: function (a) {
                var b = this.pathfinder, e = this.chart, h = b.algorithms[a.type], g = b.chartObstacles;
                if ("function" !== typeof h) c.error('"' + a.type + '" is not a Pathfinder algorithm.'); else return h.requiresObstacles && !g && (g = b.chartObstacles = b.getChartObstacles(a), e.options.connectors.algorithmMargin = a.algorithmMargin, b.chartObstacleMetrics =
                    b.getObstacleMetrics(g)), h(this.fromPoint.getPathfinderAnchorPoint(a.startMarker), this.toPoint.getPathfinderAnchorPoint(a.endMarker), w({
                    chartObstacles: g,
                    lineObstacles: b.lineObstacles || [],
                    obstacleMetrics: b.chartObstacleMetrics,
                    hardBounds: {xMin: 0, xMax: e.plotWidth, yMin: 0, yMax: e.plotHeight},
                    obstacleOptions: {margin: a.algorithmMargin},
                    startDirectionX: b.getAlgorithmStartDirection(a.startMarker)
                }, a))
            }, render: function () {
                var b = this.fromPoint, d = b.series, c = d.chart, g = c.pathfinder,
                    k = w(c.options.connectors, d.options.connectors,
                        b.options.connectors, this.options), q = {};
                c.styledMode || (q.stroke = k.lineColor || b.color, q["stroke-width"] = k.lineWidth, k.dashStyle && (q.dashstyle = k.dashStyle));
                q["class"] = "highcharts-point-connecting-path highcharts-color-" + b.colorIndex;
                k = w(q, k);
                u(k.marker.radius) || (k.marker.radius = e(a(Math.ceil((k.algorithmMargin || 8) / 2) - 1, 1), 5));
                b = this.getPath(k);
                c = b.path;
                b.obstacles && (g.lineObstacles = g.lineObstacles || [], g.lineObstacles = g.lineObstacles.concat(b.obstacles));
                this.renderPath(c, q, d.options.animation);
                this.addMarker("start",
                    w(k.marker, k.startMarker), c);
                this.addMarker("end", w(k.marker, k.endMarker), c)
            }, destroy: function () {
                this.graphics && (z(this.graphics, function (a) {
                    a.destroy()
                }), delete this.graphics)
            }
        };
        C.prototype = {
            algorithms: y, init: function (a) {
                this.chart = a;
                this.connections = [];
                q(a, "redraw", function () {
                    this.pathfinder.update()
                })
            }, update: function (a) {
                var b = this.chart, e = this, h = e.connections;
                e.connections = [];
                b.series.forEach(function (a) {
                    a.visible && !a.options.isInternal && a.points.forEach(function (a) {
                        var d, f = a.options && a.options.connect &&
                            r(a.options.connect);
                        a.visible && !1 !== a.isInside && f && f.forEach(function (f) {
                            d = b.get("string" === typeof f ? f : f.to);
                            d instanceof c.Point && d.series.visible && d.visible && !1 !== d.isInside && e.connections.push(new I(a, d, "string" === typeof f ? {} : f))
                        })
                    })
                });
                for (var g = 0, k, m, l = h.length, t = e.connections.length; g < l; ++g) {
                    m = !1;
                    for (k = 0; k < t; ++k) if (h[g].fromPoint === e.connections[k].fromPoint && h[g].toPoint === e.connections[k].toPoint) {
                        e.connections[k].graphics = h[g].graphics;
                        m = !0;
                        break
                    }
                    m || h[g].destroy()
                }
                delete this.chartObstacles;
                delete this.lineObstacles;
                e.renderConnections(a)
            }, renderConnections: function (a) {
                a ? this.chart.series.forEach(function (a) {
                    var b = function () {
                        var b = a.chart.pathfinder;
                        (b && b.connections || []).forEach(function (b) {
                            b.fromPoint && b.fromPoint.series === a && b.render()
                        });
                        a.pathfinderRemoveRenderEvent && (a.pathfinderRemoveRenderEvent(), delete a.pathfinderRemoveRenderEvent)
                    };
                    !1 === a.options.animation ? b() : a.pathfinderRemoveRenderEvent = q(a, "afterAnimate", b)
                }) : this.connections.forEach(function (a) {
                    a.render()
                })
            }, getChartObstacles: function (a) {
                for (var d =
                    [], c = this.chart.series, e = b(a.algorithmMargin, 0), h, g = 0, m = c.length; g < m; ++g) if (c[g].visible && !c[g].options.isInternal) for (var l = 0, k = c[g].points.length, q; l < k; ++l) q = c[g].points[l], q.visible && (q = E(q)) && d.push({
                    xMin: q.xMin - e,
                    xMax: q.xMax + e,
                    yMin: q.yMin - e,
                    yMax: q.yMax + e
                });
                d = d.sort(function (a, b) {
                    return a.xMin - b.xMin
                });
                u(a.algorithmMargin) || (h = a.algorithmMargin = B(d), d.forEach(function (a) {
                    a.xMin -= h;
                    a.xMax += h;
                    a.yMin -= h;
                    a.yMax += h
                }));
                return d
            }, getObstacleMetrics: function (a) {
                for (var b = 0, c = 0, e, h, g = a.length; g--;) e = a[g].xMax -
                    a[g].xMin, h = a[g].yMax - a[g].yMin, b < e && (b = e), c < h && (c = h);
                return {maxHeight: c, maxWidth: b}
            }, getAlgorithmStartDirection: function (a) {
                var b = "top" !== a.verticalAlign && "bottom" !== a.verticalAlign;
                return "left" !== a.align && "right" !== a.align ? b ? void 0 : !1 : b ? !0 : void 0
            }
        };
        c.Connection = I;
        c.Pathfinder = C;
        g(c.Point.prototype, {
            getPathfinderAnchorPoint: function (a) {
                var b = E(this);
                switch (a.align) {
                    case "right":
                        var c = "xMax";
                        break;
                    case "left":
                        c = "xMin"
                }
                switch (a.verticalAlign) {
                    case "top":
                        var e = "yMin";
                        break;
                    case "bottom":
                        e = "yMax"
                }
                return {
                    x: c ?
                        b[c] : (b.xMin + b.xMax) / 2, y: e ? b[e] : (b.yMin + b.yMax) / 2
                }
            }, getRadiansToVector: function (a, b) {
                u(b) || (b = E(this), b = {x: (b.xMin + b.xMax) / 2, y: (b.yMin + b.yMax) / 2});
                return Math.atan2(b.y - a.y, a.x - b.x)
            }, getMarkerVector: function (a, b, c) {
                var d = 2 * Math.PI, e = E(this), f = e.xMax - e.xMin, h = e.yMax - e.yMin, g = Math.atan2(h, f),
                    k = !1;
                f /= 2;
                var q = h / 2, r = e.xMin + f;
                e = e.yMin + q;
                for (var p = r, u = e, w = {}, z = 1, y = 1; a < -Math.PI;) a += d;
                for (; a > Math.PI;) a -= d;
                d = Math.tan(a);
                a > -g && a <= g ? (y = -1, k = !0) : a > g && a <= Math.PI - g ? y = -1 : a > Math.PI - g || a <= -(Math.PI - g) ? (z = -1, k = !0) :
                    z = -1;
                k ? (p += z * f, u += y * f * d) : (p += h / (2 * d) * z, u += y * q);
                c.x !== r && (p = c.x);
                c.y !== e && (u = c.y);
                w.x = p + b * Math.cos(a);
                w.y = u - b * Math.sin(a);
                return w
            }
        });
        c.Chart.prototype.callbacks.push(function (a) {
            !1 !== a.options.connectors.enabled && (A(a), this.pathfinder = new C(this), this.pathfinder.update(!0))
        })
    });
    K(B, "modules/xrange.src.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.defined, E = g.isNumber, B = g.isObject;
        g = c.addEvent;
        var I = c.color, C = c.seriesTypes.column, A = c.correctFloat, u = c.merge, z = c.pick, r = c.seriesType,
            k = c.Axis, q = c.Point, w = c.Series;
        r("xrange", "column", {
            colorByPoint: !0,
            dataLabels: {
                formatter: function () {
                    var b = this.point.partialFill;
                    B(b) && (b = b.amount);
                    if (E(b) && 0 < b) return A(100 * b) + "%"
                }, inside: !0, verticalAlign: "middle"
            },
            tooltip: {
                headerFormat: '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/>',
                pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.yCategory}</b><br/>'
            },
            borderRadius: 3,
            pointRange: 0
        }, {
            type: "xrange",
            parallelArrays: ["x", "x2", "y"],
            requireSorting: !1,
            animate: c.seriesTypes.line.prototype.animate,
            cropShoulder: 1,
            getExtremesFromAll: !0,
            autoIncrement: c.noop,
            buildKDTree: c.noop,
            getColumnMetrics: function () {
                function b() {
                    a.series.forEach(function (a) {
                        var b = a.xAxis;
                        a.xAxis = a.yAxis;
                        a.yAxis = b
                    })
                }

                var a = this.chart;
                b();
                var c = C.prototype.getColumnMetrics.call(this);
                b();
                return c
            },
            cropData: function (b, a, c, h) {
                a = w.prototype.cropData.call(this, this.x2Data, a, c, h);
                a.xData = b.slice(a.start, a.end);
                return a
            },
            findPointIndex: function (b) {
                var a = this.data, e = this.points, h = b.id, d;
                if (h) var f = (d = c.find(a, function (a) {
                    return a.id === h
                })) ? d.index : void 0;
                void 0 === f && (f = (d = c.find(a, function (a) {
                    return a.x === b.x && a.x2 === b.x2 && !(e[f] && e[f].touched)
                })) ? d.index : void 0);
                this.cropped && f >= this.cropStart && (f -= this.cropStart);
                return f
            },
            translatePoint: function (b) {
                var a = this.xAxis, c = this.yAxis, h = this.columnMetrics, d = this.options, f = d.minPointLength || 0,
                    g = b.plotX, k = z(b.x2, b.x + (b.len || 0)), q = a.translate(k, 0, 0, 0, 1);
                k = Math.abs(q - g);
                var m = this.chart.inverted, l = z(d.borderWidth, 1) % 2 / 2, t = h.offset, r = Math.round(h.width);
                f && (f -= k, 0 > f && (f = 0), g -= f / 2, q += f / 2);
                g = Math.max(g, -10);
                q = Math.min(Math.max(q, -10), a.len + 10);
                y(b.options.pointWidth) && (t -= (Math.ceil(b.options.pointWidth) - r) / 2, r = Math.ceil(b.options.pointWidth));
                d.pointPlacement && E(b.plotY) && c.categories && (b.plotY = c.translate(b.y, 0, 1, 0, 1, d.pointPlacement));
                b.shapeArgs = {
                    x: Math.floor(Math.min(g, q)) + l,
                    y: Math.floor(b.plotY + t) + l,
                    width: Math.round(Math.abs(q - g)),
                    height: r,
                    r: this.options.borderRadius
                };
                d = b.shapeArgs.x;
                f = d + b.shapeArgs.width;
                0 > d || f > a.len ? (d = Math.min(a.len, Math.max(0,
                    d)), f = Math.max(0, Math.min(f, a.len)), q = f - d, b.dlBox = u(b.shapeArgs, {
                    x: d,
                    width: f - d,
                    centerX: q ? q / 2 : null
                })) : b.dlBox = null;
                m ? (b.tooltipPos[1] += k / 2 * (a.reversed ? 1 : -1), b.tooltipPos[0] += h.width / 2, b.tooltipPos[1] = Math.max(Math.min(b.tooltipPos[1], a.len - 1), 0), b.tooltipPos[0] = Math.max(Math.min(b.tooltipPos[0], c.len - 1), 0)) : (b.tooltipPos[0] += k / 2 * (a.reversed ? -1 : 1), b.tooltipPos[1] -= h.width / 2, b.tooltipPos[0] = Math.max(Math.min(b.tooltipPos[0], a.len - 1), 0), b.tooltipPos[1] = Math.max(Math.min(b.tooltipPos[1], c.len - 1), 0));
                if (h =
                    b.partialFill) B(h) && (h = h.amount), E(h) || (h = 0), c = b.shapeArgs, b.partShapeArgs = {
                    x: c.x,
                    y: c.y,
                    width: c.width,
                    height: c.height,
                    r: this.options.borderRadius
                }, g = Math.max(Math.round(k * h + b.plotX - g), 0), b.clipRectArgs = {
                    x: a.reversed ? c.x + k - g : c.x,
                    y: c.y,
                    width: g,
                    height: c.height
                }
            },
            translate: function () {
                C.prototype.translate.apply(this, arguments);
                this.points.forEach(function (b) {
                    this.translatePoint(b)
                }, this)
            },
            drawPoint: function (b, a) {
                var c = this.options, h = this.chart.renderer, d = b.graphic, f = b.shapeType, g = b.shapeArgs,
                    k = b.partShapeArgs,
                    q = b.clipRectArgs, m = b.partialFill, l = c.stacking && !c.borderRadius, t = b.state,
                    r = c.states[t || "normal"] || {}, w = void 0 === t ? "attr" : a;
                t = this.pointAttribs(b, t);
                r = z(this.chart.options.chart.animation, r.animation);
                if (b.isNull) d && (b.graphic = d.destroy()); else {
                    if (d) d.rect[a](g); else b.graphic = d = h.g("point").addClass(b.getClassName()).add(b.group || this.group), d.rect = h[f](u(g)).addClass(b.getClassName()).addClass("highcharts-partfill-original").add(d);
                    k && (d.partRect ? (d.partRect[a](u(k)), d.partialClipRect[a](u(q))) :
                        (d.partialClipRect = h.clipRect(q.x, q.y, q.width, q.height), d.partRect = h[f](k).addClass("highcharts-partfill-overlay").add(d).clip(d.partialClipRect)));
                    this.chart.styledMode || (d.rect[a](t, r).shadow(c.shadow, null, l), k && (B(m) || (m = {}), B(c.partialFill) && (m = u(m, c.partialFill)), b = m.fill || I(t.fill).brighten(-.3).get() || I(b.color || this.color).brighten(-.3).get(), t.fill = b, d.partRect[w](t, r).shadow(c.shadow, null, l)))
                }
            },
            drawPoints: function () {
                var b = this, a = b.getAnimationVerb();
                b.points.forEach(function (c) {
                    b.drawPoint(c,
                        a)
                })
            },
            getAnimationVerb: function () {
                return this.chart.pointCount < (this.options.animationLimit || 250) ? "animate" : "attr"
            }
        }, {
            resolveColor: function () {
                var b = this.series;
                if (b.options.colorByPoint && !this.options.color) {
                    var a = b.options.colors || b.chart.options.colors;
                    var c = this.y % (a ? a.length : b.chart.options.chart.colorCount);
                    a = a && a[c];
                    b.chart.styledMode || (this.color = a);
                    this.options.colorIndex || (this.colorIndex = c)
                } else this.color || (this.color = b.color)
            }, init: function () {
                q.prototype.init.apply(this, arguments);
                this.y ||
                (this.y = 0);
                return this
            }, setState: function () {
                q.prototype.setState.apply(this, arguments);
                this.series.drawPoint(this, this.series.getAnimationVerb())
            }, getLabelConfig: function () {
                var b = q.prototype.getLabelConfig.call(this), a = this.series.yAxis.categories;
                b.x2 = this.x2;
                b.yCategory = this.yCategory = a && a[this.y];
                return b
            }, tooltipDateKeys: ["x", "x2"], isValid: function () {
                return "number" === typeof this.x && "number" === typeof this.x2
            }
        });
        g(k, "afterGetSeriesExtremes", function () {
            var b = this.series, a;
            if (this.isXAxis) {
                var c =
                    z(this.dataMax, -Number.MAX_VALUE);
                b.forEach(function (b) {
                    b.x2Data && b.x2Data.forEach(function (b) {
                        b > c && (c = b, a = !0)
                    })
                });
                a && (this.dataMax = c)
            }
        });
        ""
    });
    K(B, "parts-gantt/GanttSeries.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        var y = g.isNumber, B = g.splat, F = c.dateFormat, I = c.merge, C = c.pick;
        g = c.seriesType;
        var A = c.seriesTypes.xrange;
        g("gantt", "xrange", {
            grouping: !1, dataLabels: {enabled: !0}, tooltip: {
                headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
                pointFormat: null,
                pointFormatter: function () {
                    var c =
                            this.series, g = c.chart.tooltip, r = c.xAxis, k = c.tooltipOptions.dateTimeLabelFormats,
                        q = r.options.startOfWeek, w = c.tooltipOptions, b = w.xDateFormat;
                    c = this.options.milestone;
                    var a = "<b>" + (this.name || this.yCategory) + "</b>";
                    if (w.pointFormat) return this.tooltipFormatter(w.pointFormat);
                    b || (b = B(g.getDateFormat(r.closestPointRange, this.start, q, k))[0]);
                    g = F(b, this.start);
                    r = F(b, this.end);
                    a += "<br/>";
                    return c ? a + (g + "<br/>") : a + ("开始: " + g + "<br/>结束: ") + (r + "<br/>")
                }
            }, connectors: {
                type: "simpleConnect",
                animation: {reversed: !0},
                startMarker: {enabled: !0, symbol: "arrow-filled", radius: 4, fill: "#fa0", align: "left"},
                endMarker: {enabled: !1, align: "right"}
            }
        }, {
            pointArrayMap: ["start", "end", "y"], keyboardMoveVertical: !1, translatePoint: function (c) {
                A.prototype.translatePoint.call(this, c);
                if (c.options.milestone) {
                    var g = c.shapeArgs;
                    var r = g.height;
                    c.shapeArgs = {x: g.x - r / 2, y: g.y, width: r, height: r}
                }
            }, drawPoint: function (c, g) {
                var r = this.options, k = this.chart.renderer, q = c.shapeArgs, u = c.plotY, b = c.graphic,
                    a = c.selected && "select", e = r.stacking && !r.borderRadius;
                if (c.options.milestone) if (y(u) && null !== c.y) {
                    q = k.symbols.diamond(q.x, q.y, q.width, q.height);
                    if (b) b[g]({d: q}); else c.graphic = k.path(q).addClass(c.getClassName(), !0).add(c.group || this.group);
                    this.chart.styledMode || c.graphic.attr(this.pointAttribs(c, a)).shadow(r.shadow, null, e)
                } else b && (c.graphic = b.destroy()); else A.prototype.drawPoint.call(this, c, g)
            }, setData: c.Series.prototype.setData, setGanttPointAliases: function (c) {
                function g(g, k) {
                    void 0 !== k && (c[g] = k)
                }

                g("x", C(c.start, c.x));
                g("x2", C(c.end, c.x2));
                g("partialFill",
                    C(c.completed, c.partialFill));
                g("connect", C(c.dependency, c.connect))
            }
        }, I(A.prototype.pointClass.prototype, {
            applyOptions: function (g, y) {
                g = I(g);
                c.seriesTypes.gantt.prototype.setGanttPointAliases(g);
                return g = A.prototype.pointClass.prototype.applyOptions.call(this, g, y)
            }, isValid: function () {
                return ("number" === typeof this.start || "number" === typeof this.x) && ("number" === typeof this.end || "number" === typeof this.x2 || this.milestone)
            }
        }));
        ""
    });
    K(B, "parts-gantt/GanttChart.js", [B["parts/Globals.js"], B["parts/Utilities.js"]],
        function (c, g) {
            var y = g.isArray, B = g.splat, F = c.merge, I = c.Chart;
            c.ganttChart = function (g, A, u) {
                var z = "string" === typeof g || g.nodeName, r = A.series, k = c.getOptions(), q, w = A;
                A = arguments[z ? 1 : 0];
                y(A.xAxis) || (A.xAxis = [A.xAxis || {}, {}]);
                A.xAxis = A.xAxis.map(function (b, a) {
                    1 === a && (q = 0);
                    return F(k.xAxis, {grid: {enabled: !0}, opposite: !0, linkedTo: q}, b, {type: "datetime"})
                });
                A.yAxis = B(A.yAxis || {}).map(function (b) {
                    return F(k.yAxis, {
                        grid: {enabled: !0},
                        staticScale: 50,
                        reversed: !0,
                        type: b.categories ? b.type : "treegrid"
                    }, b)
                });
                A.series =
                    null;
                A = F(!0, {chart: {type: "gantt"}, title: {text: null}, legend: {enabled: !1}}, A, {isGantt: !0});
                A.series = w.series = r;
                A.series.forEach(function (b) {
                    b.data.forEach(function (a) {
                        c.seriesTypes.gantt.prototype.setGanttPointAliases(a)
                    })
                });
                return z ? new I(g, A, u) : new I(A, A)
            }
        });
    K(B, "parts/Scrollbar.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        function y(a, b, c) {
            this.init(a, b, c)
        }

        var B = g.defined, F = c.addEvent;
        g = c.Axis;
        var I = c.correctFloat, C = c.defaultOptions, A = c.destroyObjectProperties, u = c.fireEvent,
            z = c.hasTouch, r = c.merge, k = c.pick, q = c.removeEvent, w, b = {
                height: c.isTouchDevice ? 20 : 14,
                barBorderRadius: 0,
                buttonBorderRadius: 0,
                liveRedraw: void 0,
                margin: 10,
                minWidth: 6,
                step: .2,
                zIndex: 3,
                barBackgroundColor: "#cccccc",
                barBorderWidth: 1,
                barBorderColor: "#cccccc",
                buttonArrowColor: "#333333",
                buttonBackgroundColor: "#e6e6e6",
                buttonBorderColor: "#cccccc",
                buttonBorderWidth: 1,
                rifleColor: "#333333",
                trackBackgroundColor: "#f2f2f2",
                trackBorderColor: "#f2f2f2",
                trackBorderWidth: 1
            };
        C.scrollbar = r(!0, b, C.scrollbar);
        c.swapXY = w = function (a,
                                 b) {
            var c = a.length;
            if (b) for (b = 0; b < c; b += 3) {
                var d = a[b + 1];
                a[b + 1] = a[b + 2];
                a[b + 2] = d
            }
            return a
        };
        y.prototype = {
            init: function (a, c, h) {
                this.scrollbarButtons = [];
                this.renderer = a;
                this.userOptions = c;
                this.options = r(b, c);
                this.chart = h;
                this.size = k(this.options.size, this.options.height);
                c.enabled && (this.render(), this.initEvents(), this.addEvents())
            }, render: function () {
                var a = this.renderer, b = this.options, c = this.size, d = this.chart.styledMode, f;
                this.group = f = a.g("scrollbar").attr({zIndex: b.zIndex, translateY: -99999}).add();
                this.track =
                    a.rect().addClass("highcharts-scrollbar-track").attr({
                        x: 0,
                        r: b.trackBorderRadius || 0,
                        height: c,
                        width: c
                    }).add(f);
                d || this.track.attr({
                    fill: b.trackBackgroundColor,
                    stroke: b.trackBorderColor,
                    "stroke-width": b.trackBorderWidth
                });
                this.trackBorderWidth = this.track.strokeWidth();
                this.track.attr({y: -this.trackBorderWidth % 2 / 2});
                this.scrollbarGroup = a.g().add(f);
                this.scrollbar = a.rect().addClass("highcharts-scrollbar-thumb").attr({
                    height: c,
                    width: c,
                    r: b.barBorderRadius || 0
                }).add(this.scrollbarGroup);
                this.scrollbarRifles =
                    a.path(w(["M", -3, c / 4, "L", -3, 2 * c / 3, "M", 0, c / 4, "L", 0, 2 * c / 3, "M", 3, c / 4, "L", 3, 2 * c / 3], b.vertical)).addClass("highcharts-scrollbar-rifles").add(this.scrollbarGroup);
                d || (this.scrollbar.attr({
                    fill: b.barBackgroundColor,
                    stroke: b.barBorderColor,
                    "stroke-width": b.barBorderWidth
                }), this.scrollbarRifles.attr({stroke: b.rifleColor, "stroke-width": 1}));
                this.scrollbarStrokeWidth = this.scrollbar.strokeWidth();
                this.scrollbarGroup.translate(-this.scrollbarStrokeWidth % 2 / 2, -this.scrollbarStrokeWidth % 2 / 2);
                this.drawScrollbarButton(0);
                this.drawScrollbarButton(1)
            }, position: function (a, b, c, d) {
                var e = this.options.vertical, h = 0, g = this.rendered ? "animate" : "attr";
                this.x = a;
                this.y = b + this.trackBorderWidth;
                this.width = c;
                this.xOffset = this.height = d;
                this.yOffset = h;
                e ? (this.width = this.yOffset = c = h = this.size, this.xOffset = b = 0, this.barWidth = d - 2 * c, this.x = a += this.options.margin) : (this.height = this.xOffset = d = b = this.size, this.barWidth = c - 2 * d, this.y += this.options.margin);
                this.group[g]({translateX: a, translateY: this.y});
                this.track[g]({width: c, height: d});
                this.scrollbarButtons[1][g]({
                    translateX: e ?
                        0 : c - b, translateY: e ? d - h : 0
                })
            }, drawScrollbarButton: function (a) {
                var b = this.renderer, c = this.scrollbarButtons, d = this.options, f = this.size;
                var g = b.g().add(this.group);
                c.push(g);
                g = b.rect().addClass("highcharts-scrollbar-button").add(g);
                this.chart.styledMode || g.attr({
                    stroke: d.buttonBorderColor,
                    "stroke-width": d.buttonBorderWidth,
                    fill: d.buttonBackgroundColor
                });
                g.attr(g.crisp({
                    x: -.5,
                    y: -.5,
                    width: f + 1,
                    height: f + 1,
                    r: d.buttonBorderRadius
                }, g.strokeWidth()));
                g = b.path(w(["M", f / 2 + (a ? -1 : 1), f / 2 - 3, "L", f / 2 + (a ? -1 : 1), f / 2 + 3, "L",
                    f / 2 + (a ? 2 : -2), f / 2], d.vertical)).addClass("highcharts-scrollbar-arrow").add(c[a]);
                this.chart.styledMode || g.attr({fill: d.buttonArrowColor})
            }, setRange: function (a, b) {
                var c = this.options, d = c.vertical, e = c.minWidth, g = this.barWidth, k,
                    q = !this.rendered || this.hasDragged || this.chart.navigator && this.chart.navigator.hasDragged ? "attr" : "animate";
                if (B(g)) {
                    a = Math.max(a, 0);
                    var m = Math.ceil(g * a);
                    this.calculatedWidth = k = I(g * Math.min(b, 1) - m);
                    k < e && (m = (g - e + k) * a, k = e);
                    e = Math.floor(m + this.xOffset + this.yOffset);
                    g = k / 2 - .5;
                    this.from =
                        a;
                    this.to = b;
                    d ? (this.scrollbarGroup[q]({translateY: e}), this.scrollbar[q]({height: k}), this.scrollbarRifles[q]({translateY: g}), this.scrollbarTop = e, this.scrollbarLeft = 0) : (this.scrollbarGroup[q]({translateX: e}), this.scrollbar[q]({width: k}), this.scrollbarRifles[q]({translateX: g}), this.scrollbarLeft = e, this.scrollbarTop = 0);
                    12 >= k ? this.scrollbarRifles.hide() : this.scrollbarRifles.show(!0);
                    !1 === c.showFull && (0 >= a && 1 <= b ? this.group.hide() : this.group.show());
                    this.rendered = !0
                }
            }, initEvents: function () {
                var a = this;
                a.mouseMoveHandler =
                    function (b) {
                        var c = a.chart.pointer.normalize(b), d = a.options.vertical ? "chartY" : "chartX",
                            e = a.initPositions;
                        !a.grabbedCenter || b.touches && 0 === b.touches[0][d] || (c = a.cursorToScrollbarPosition(c)[d], d = a[d], d = c - d, a.hasDragged = !0, a.updatePosition(e[0] + d, e[1] + d), a.hasDragged && u(a, "changed", {
                            from: a.from,
                            to: a.to,
                            trigger: "scrollbar",
                            DOMType: b.type,
                            DOMEvent: b
                        }))
                    };
                a.mouseUpHandler = function (b) {
                    a.hasDragged && u(a, "changed", {
                        from: a.from,
                        to: a.to,
                        trigger: "scrollbar",
                        DOMType: b.type,
                        DOMEvent: b
                    });
                    a.grabbedCenter = a.hasDragged =
                        a.chartX = a.chartY = null
                };
                a.mouseDownHandler = function (b) {

                    b = a.chart.pointer.normalize(b);
                    b = a.cursorToScrollbarPosition(b);
                    a.chartX = b.chartX;
                    a.chartY = b.chartY;
                    a.initPositions = [a.from, a.to];
                    a.grabbedCenter = !0
                };
                a.buttonToMinClick = function (b) {
                    var c = I(a.to - a.from) * a.options.step;
                    a.updatePosition(I(a.from - c), I(a.to - c));
                    u(a, "changed", {from: a.from, to: a.to, trigger: "scrollbar", DOMEvent: b})
                };
                a.buttonToMaxClick = function (b) {
                    var c = (a.to - a.from) * a.options.step;
                    a.updatePosition(a.from + c, a.to + c);
                    u(a, "changed", {
                        from: a.from,
                        to: a.to, trigger: "scrollbar", DOMEvent: b
                    })
                };
                a.trackClick = function (b) {
                    var c = a.chart.pointer.normalize(b), d = a.to - a.from, e = a.y + a.scrollbarTop,
                        g = a.x + a.scrollbarLeft;
                    a.options.vertical && c.chartY > e || !a.options.vertical && c.chartX > g ? a.updatePosition(a.from + d, a.to + d) : a.updatePosition(a.from - d, a.to - d);
                    u(a, "changed", {from: a.from, to: a.to, trigger: "scrollbar", DOMEvent: b})
                }
            }, cursorToScrollbarPosition: function (a) {
                var b = this.options;
                b = b.minWidth > this.calculatedWidth ? b.minWidth : 0;
                return {
                    chartX: (a.chartX - this.x - this.xOffset) /
                    (this.barWidth - b), chartY: (a.chartY - this.y - this.yOffset) / (this.barWidth - b)
                }
            }, updatePosition: function (a, b) {
                1 < b && (a = I(1 - I(b - a)), b = 1);
                0 > a && (b = I(b - a), a = 0);
                this.from = a;
                this.to = b
            }, update: function (a) {
                this.destroy();
                this.init(this.chart.renderer, r(!0, this.options, a), this.chart)
            }, addEvents: function () {
                var a = this.options.inverted ? [1, 0] : [0, 1], b = this.scrollbarButtons,
                    c = this.scrollbarGroup.element, d = this.mouseDownHandler, f = this.mouseMoveHandler,
                    g = this.mouseUpHandler;
                a = [[b[a[0]].element, "click", this.buttonToMinClick],
                    [b[a[1]].element, "click", this.buttonToMaxClick], [this.track.element, "click", this.trackClick], [c, "mousedown", d], [c.ownerDocument, "mousemove", f], [c.ownerDocument, "mouseup", g]];
                z && a.push([c, "touchstart", d], [c.ownerDocument, "touchmove", f], [c.ownerDocument, "touchend", g]);
                a.forEach(function (a) {
                    F.apply(null, a)
                });
                this._events = a
            }, removeEvents: function () {
                this._events.forEach(function (a) {
                    q.apply(null, a)
                });
                this._events.length = 0
            }, destroy: function () {
                var a = this.chart.scroller;
                this.removeEvents();
                ["track", "scrollbarRifles",
                    "scrollbar", "scrollbarGroup", "group"].forEach(function (a) {
                    this[a] && this[a].destroy && (this[a] = this[a].destroy())
                }, this);
                a && this === a.scrollbar && (a.scrollbar = null, A(a.scrollbarButtons))
            }
        };
        c.Scrollbar || (F(g, "afterInit", function () {
            var a = this;
            a.options && a.options.scrollbar && a.options.scrollbar.enabled && (a.options.scrollbar.vertical = !a.horiz, a.options.startOnTick = a.options.endOnTick = !1, a.scrollbar = new y(a.chart.renderer, a.options.scrollbar, a.chart), F(a.scrollbar, "changed", function (b) {
                var e = Math.min(k(a.options.min,
                    a.min), a.min, a.dataMin), d = Math.max(k(a.options.max, a.max), a.max, a.dataMax) - e;
                if (a.horiz && !a.reversed || !a.horiz && a.reversed) {
                    var f = e + d * this.to;
                    e += d * this.from
                } else f = e + d * (1 - this.from), e += d * (1 - this.to);
                k(this.options.liveRedraw, c.svg && !c.isTouchDevice && !this.chart.isBoosting) || "mouseup" === b.DOMType || !B(b.DOMType) ? a.setExtremes(e, f, !0, "mousemove" !== b.DOMType, b) : this.setRange(this.from, this.to)
            }))
        }), F(g, "afterRender", function () {
            var a = Math.min(k(this.options.min, this.min), this.min, k(this.dataMin, this.min)),
                b = Math.max(k(this.options.max, this.max), this.max, k(this.dataMax, this.max)), c = this.scrollbar,
                d = this.axisTitleMargin + (this.titleOffset || 0), f = this.chart.scrollbarsOffsets,
                g = this.options.margin || 0;
            c && (this.horiz ? (this.opposite || (f[1] += d), c.position(this.left, this.top + this.height + 2 + f[1] - (this.opposite ? g : 0), this.width, this.height), this.opposite || (f[1] += g), d = 1) : (this.opposite && (f[0] += d), c.position(this.left + this.width + 2 + f[0] - (this.opposite ? 0 : g), this.top, this.width, this.height), this.opposite && (f[0] += g), d =
                0), f[d] += c.size + c.options.margin, isNaN(a) || isNaN(b) || !B(this.min) || !B(this.max) || this.min === this.max ? c.setRange(0, 1) : (f = (this.min - a) / (b - a), a = (this.max - a) / (b - a), this.horiz && !this.reversed || !this.horiz && this.reversed ? c.setRange(f, a) : c.setRange(1 - a, 1 - f)))
        }), F(g, "afterGetOffset", function () {
            var a = this.horiz ? 2 : 1, b = this.scrollbar;
            b && (this.chart.scrollbarsOffsets = [0, 0], this.chart.axisOffset[a] += b.size + b.options.margin)
        }), c.Scrollbar = y)
    });
    K(B, "parts/RangeSelector.js", [B["parts/Globals.js"], B["parts/Utilities.js"]],
        function (c, g) {
            function y(a) {
                this.init(a)
            }

            var B = g.defined, F = g.isNumber, I = g.objectEach, C = g.pInt, A = g.splat, u = c.addEvent, z = c.Axis;
            g = c.Chart;
            var r = c.css, k = c.createElement, q = c.defaultOptions, w = c.destroyObjectProperties,
                b = c.discardElement, a = c.extend, e = c.fireEvent, h = c.merge, d = c.pick;
            a(q, {
                rangeSelector: {
                    verticalAlign: "top",
                    buttonTheme: {width: 28, height: 18, padding: 2, zIndex: 7},
                    floating: !1,
                    x: 0,
                    y: 0,
                    height: void 0,
                    inputPosition: {align: "right", x: 0, y: 0},
                    buttonPosition: {align: "left", x: 0, y: 0},
                    labelStyle: {color: "#666666"}
                }
            });
            q.lang = h(q.lang, {rangeSelectorZoom: "Zoom", rangeSelectorFrom: "From", rangeSelectorTo: "To"});
            y.prototype = {
                clickButton: function (a, b) {
                    var c = this.chart, e = this.buttonOptions[a], f = c.xAxis[0],
                        h = c.scroller && c.scroller.getUnionExtremes() || f || {}, g = h.dataMin, k = h.dataMax,
                        n = f && Math.round(Math.min(f.max, d(k, f.max))), p = e.type;
                    h = e._range;
                    var q, r = e.dataGrouping;
                    if (null !== g && null !== k) {
                        c.fixedRange = h;
                        r && (this.forcedDataGrouping = !0, z.prototype.setDataGrouping.call(f || {chart: this.chart}, r, !1), this.frozenStates = e.preserveDataGrouping);
                        if ("month" === p || "year" === p) if (f) {
                            p = {range: e, max: n, chart: c, dataMin: g, dataMax: k};
                            var w = f.minFromRange.call(p);
                            F(p.newMax) && (n = p.newMax)
                        } else h = e; else if (h) w = Math.max(n - h, g), n = Math.min(w + h, k); else if ("ytd" === p) if (f) void 0 === k && (g = Number.MAX_VALUE, k = Number.MIN_VALUE, c.series.forEach(function (a) {
                            a = a.xData;
                            g = Math.min(a[0], g);
                            k = Math.max(a[a.length - 1], k)
                        }), b = !1), n = this.getYTDExtremes(k, g, c.time.useUTC), w = q = n.min, n = n.max; else {
                            this.deferredYTDClick = a;
                            return
                        } else "all" === p && f && (w = g, n = k);
                        w += e._offsetMin;
                        n += e._offsetMax;
                        this.setSelected(a);
                        if (f) f.setExtremes(w, n, d(b, 1), null, {
                            trigger: "rangeSelectorButton",
                            rangeSelectorButton: e
                        }); else {
                            var y = A(c.options.xAxis)[0];
                            var B = y.range;
                            y.range = h;
                            var C = y.min;
                            y.min = q;
                            u(c, "load", function () {
                                y.range = B;
                                y.min = C
                            })
                        }
                    }
                },
                setSelected: function (a) {
                    this.selected = this.options.selected = a
                },
                defaultButtons: [{type: "month", count: 1, text: "1m"}, {
                    type: "month",
                    count: 3,
                    text: "3m"
                }, {type: "month", count: 6, text: "6m"}, {type: "ytd", text: "YTD"}, {
                    type: "year",
                    count: 1,
                    text: "1y"
                }, {type: "all", text: "All"}],
                init: function (a) {
                    var b =
                            this, c = a.options.rangeSelector, d = c.buttons || [].concat(b.defaultButtons), f = c.selected,
                        h = function () {
                            var a = b.minInput, c = b.maxInput;
                            a && a.blur && e(a, "blur");
                            c && c.blur && e(c, "blur")
                        };
                    b.chart = a;
                    b.options = c;
                    b.buttons = [];
                    b.buttonOptions = d;
                    this.unMouseDown = u(a.container, "mousedown", h);
                    this.unResize = u(a, "resize", h);
                    d.forEach(b.computeButtonRange);
                    void 0 !== f && d[f] && this.clickButton(f, !1);
                    u(a, "load", function () {
                        a.xAxis && a.xAxis[0] && u(a.xAxis[0], "setExtremes", function (c) {
                            this.max - this.min !== a.fixedRange && "rangeSelectorButton" !==
                            c.trigger && "updatedData" !== c.trigger && b.forcedDataGrouping && !b.frozenStates && this.setDataGrouping(!1, !1)
                        })
                    })
                },
                updateButtonStates: function () {
                    var a = this, b = this.chart, c = b.xAxis[0], d = Math.round(c.max - c.min),
                        e = !c.hasVisibleSeries, h = b.scroller && b.scroller.getUnionExtremes() || c, g = h.dataMin,
                        k = h.dataMax;
                    b = a.getYTDExtremes(k, g, b.time.useUTC);
                    var q = b.min, p = b.max, r = a.selected, u = F(r), w = a.options.allButtonsEnabled, y = a.buttons;
                    a.buttonOptions.forEach(function (b, f) {
                        var h = b._range, l = b.type, m = b.count || 1, n = y[f], t = 0,
                            v = b._offsetMax - b._offsetMin;
                        b = f === r;
                        var x = h > k - g, D = h < c.minRange, z = !1, G = !1;
                        h = h === d;
                        ("month" === l || "year" === l) && d + 36E5 >= 864E5 * {
                            month: 28,
                            year: 365
                        }[l] * m - v && d - 36E5 <= 864E5 * {
                            month: 31,
                            year: 366
                        }[l] * m + v ? h = !0 : "ytd" === l ? (h = p - q + v === d, z = !b) : "all" === l && (h = c.max - c.min >= k - g, G = !b && u && h);
                        l = !w && (x || D || G || e);
                        m = b && h || h && !u && !z || b && a.frozenStates;
                        l ? t = 3 : m && (u = !0, t = 2);
                        n.state !== t && (n.setState(t), 0 === t && r === f && a.setSelected(null))
                    })
                },
                computeButtonRange: function (a) {
                    var b = a.type, c = a.count || 1, e = {
                        millisecond: 1, second: 1E3, minute: 6E4,
                        hour: 36E5, day: 864E5, week: 6048E5
                    };
                    if (e[b]) a._range = e[b] * c; else if ("month" === b || "year" === b) a._range = 864E5 * {
                        month: 30,
                        year: 365
                    }[b] * c;
                    a._offsetMin = d(a.offsetMin, 0);
                    a._offsetMax = d(a.offsetMax, 0);
                    a._range += a._offsetMax - a._offsetMin
                },
                setInputValue: function (a, b) {
                    var c = this.chart.options.rangeSelector, d = this.chart.time, e = this[a + "Input"];
                    B(b) && (e.previousValue = e.HCTime, e.HCTime = b);
                    e.value = d.dateFormat(c.inputEditDateFormat || "%Y-%m-%d", e.HCTime);
                    this[a + "DateBox"].attr({
                        text: d.dateFormat(c.inputDateFormat || "%b %e, %Y",
                            e.HCTime)
                    })
                },
                showInput: function (a) {
                    var b = this.inputGroup, c = this[a + "DateBox"];
                    r(this[a + "Input"], {
                        left: b.translateX + c.x + "px",
                        top: b.translateY + "px",
                        width: c.width - 2 + "px",
                        height: c.height - 2 + "px",
                        border: "2px solid silver"
                    })
                },
                hideInput: function (a) {
                    r(this[a + "Input"], {border: 0, width: "1px", height: "1px"});
                    this.setInputValue(a)
                },
                drawInput: function (b) {
                    function d() {
                        var a = p.value, b = (t.inputDateParser || Date.parse)(a), c = f.xAxis[0],
                            d = f.scroller && f.scroller.xAxis ? f.scroller.xAxis : c, h = d.dataMin;
                        d = d.dataMax;
                        b !== p.previousValue &&
                        (p.previousValue = b, F(b) || (b = a.split("-"), b = Date.UTC(C(b[0]), C(b[1]) - 1, C(b[2]))), F(b) && (f.time.useUTC || (b += 6E4 * (new Date).getTimezoneOffset()), w ? b > e.maxInput.HCTime ? b = void 0 : b < h && (b = h) : b < e.minInput.HCTime ? b = void 0 : b > d && (b = d), void 0 !== b && c.setExtremes(w ? b : c.min, w ? c.max : b, void 0, void 0, {trigger: "rangeSelectorInput"})))
                    }

                    var e = this, f = e.chart, g = f.renderer.style || {}, l = f.renderer, t = f.options.rangeSelector,
                        u = e.div, w = "min" === b, p, y, z = this.inputGroup;
                    this[b + "Label"] = y = l.label(q.lang[w ? "rangeSelectorFrom" : "rangeSelectorTo"],
                        this.inputGroup.offset).addClass("highcharts-range-label").attr({padding: 2}).add(z);
                    z.offset += y.width + 5;
                    this[b + "DateBox"] = l = l.label("", z.offset).addClass("highcharts-range-input").attr({
                        padding: 2,
                        width: t.inputBoxWidth || 90,
                        height: t.inputBoxHeight || 17,
                        "text-align": "center"
                    }).on("click", function () {
                        e.showInput(b);
                        e[b + "Input"].focus()
                    });
                    f.styledMode || l.attr({stroke: t.inputBoxBorderColor || "#cccccc", "stroke-width": 1});
                    l.add(z);
                    z.offset += l.width + (w ? 10 : 0);
                    this[b + "Input"] = p = k("input", {
                        name: b, className: "highcharts-range-selector",
                        type: "text"
                    }, {top: f.plotTop + "px"}, u);
                    f.styledMode || (y.css(h(g, t.labelStyle)), l.css(h({color: "#333333"}, g, t.inputStyle)), r(p, a({
                        position: "absolute",
                        border: 0,
                        width: "1px",
                        height: "1px",
                        padding: 0,
                        textAlign: "center",
                        fontSize: g.fontSize,
                        fontFamily: g.fontFamily,
                        top: "-9999em"
                    }, t.inputStyle)));
                    p.onfocus = function () {
                        e.showInput(b)
                    };
                    p.onblur = function () {
                        p === c.doc.activeElement && d();
                        e.hideInput(b);
                        p.blur()
                    };
                    p.onchange = d;
                    p.onkeypress = function (a) {
                        13 === a.keyCode && d()
                    }
                },
                getPosition: function () {
                    var a = this.chart, b = a.options.rangeSelector;
                    a = "top" === b.verticalAlign ? a.plotTop - a.axisOffset[0] : 0;
                    return {buttonTop: a + b.buttonPosition.y, inputTop: a + b.inputPosition.y - 10}
                },
                getYTDExtremes: function (a, b, c) {
                    var d = this.chart.time, e = new d.Date(a), f = d.get("FullYear", e);
                    c = c ? d.Date.UTC(f, 0, 1) : +new d.Date(f, 0, 1);
                    b = Math.max(b || 0, c);
                    e = e.getTime();
                    return {max: Math.min(a || e, e), min: b}
                },
                render: function (a, b) {
                    var c = this, e = c.chart, f = e.renderer, h = e.container, g = e.options,
                        n = g.exporting && !1 !== g.exporting.enabled && g.navigation && g.navigation.buttonOptions,
                        r = q.lang, p =
                            c.div, u = g.rangeSelector, w = d(g.chart.style && g.chart.style.zIndex, 0) + 1;
                    g = u.floating;
                    var y = c.buttons;
                    p = c.inputGroup;
                    var z = u.buttonTheme, A = u.buttonPosition, B = u.inputPosition, C = u.inputEnabled,
                        E = z && z.states, F = e.plotLeft, I = c.buttonGroup;
                    var K = c.rendered;
                    var T = c.options.verticalAlign, Q = e.legend, ba = Q && Q.options, ca = A.y, U = B.y, Y = K || !1,
                        Z = Y ? "animate" : "attr", V = 0, W = 0, aa;
                    if (!1 !== u.enabled) {
                        K || (c.group = K = f.g("range-selector-group").attr({zIndex: 7}).add(), c.buttonGroup = I = f.g("range-selector-buttons").add(K), c.zoomText =
                            f.text(r.rangeSelectorZoom, 0, 15).add(I), e.styledMode || (c.zoomText.css(u.labelStyle), z["stroke-width"] = d(z["stroke-width"], 0)), c.buttonOptions.forEach(function (a, b) {
                            y[b] = f.button(a.text, 0, 0, function (d) {
                                var e = a.events && a.events.click, f;
                                e && (f = e.call(a, d));
                                !1 !== f && c.clickButton(b);
                                c.isActive = !0
                            }, z, E && E.hover, E && E.select, E && E.disabled).attr({"text-align": "center"}).add(I)
                        }), !1 !== C && (c.div = p = k("div", null, {
                            position: "relative",
                            height: 0,
                            zIndex: w
                        }), h.parentNode.insertBefore(p, h), c.inputGroup = p = f.g("input-group").add(K),
                            p.offset = 0, c.drawInput("min"), c.drawInput("max")));
                        c.zoomText[Z]({x: d(F + A.x, F)});
                        var ea = d(F + A.x, F) + c.zoomText.getBBox().width + 5;
                        c.buttonOptions.forEach(function (a, b) {
                            y[b][Z]({x: ea});
                            ea += y[b].width + d(u.buttonSpacing, 5)
                        });
                        F = e.plotLeft - e.spacing[3];
                        c.updateButtonStates();
                        n && this.titleCollision(e) && "top" === T && "right" === A.align && A.y + I.getBBox().height - 12 < (n.y || 0) + n.height && (V = -40);
                        "left" === A.align ? aa = A.x - e.spacing[3] : "right" === A.align && (aa = A.x + V - e.spacing[1]);
                        I.align({
                            y: A.y, width: I.getBBox().width, align: A.align,
                            x: aa
                        }, !0, e.spacingBox);
                        c.group.placed = Y;
                        c.buttonGroup.placed = Y;
                        !1 !== C && (V = n && this.titleCollision(e) && "top" === T && "right" === B.align && B.y - p.getBBox().height - 12 < (n.y || 0) + n.height + e.spacing[0] ? -40 : 0, "left" === B.align ? aa = F : "right" === B.align && (aa = -Math.max(e.axisOffset[1], -V)), p.align({
                            y: B.y,
                            width: p.getBBox().width,
                            align: B.align,
                            x: B.x + aa - 2
                        }, !0, e.spacingBox), h = p.alignAttr.translateX + p.alignOptions.x - V + p.getBBox().x + 2, n = p.alignOptions.width, r = I.alignAttr.translateX + I.getBBox().x, aa = I.getBBox().width + 20, (B.align ===
                            A.align || r + aa > h && h + n > r && ca < U + p.getBBox().height) && p.attr({
                            translateX: p.alignAttr.translateX + (e.axisOffset[1] >= -V ? 0 : -V),
                            translateY: p.alignAttr.translateY + I.getBBox().height + 10
                        }), c.setInputValue("min", a), c.setInputValue("max", b), c.inputGroup.placed = Y);
                        c.group.align({verticalAlign: T}, !0, e.spacingBox);
                        a = c.group.getBBox().height + 20;
                        b = c.group.alignAttr.translateY;
                        "bottom" === T && (Q = ba && "bottom" === ba.verticalAlign && ba.enabled && !ba.floating ? Q.legendHeight + d(ba.margin, 10) : 0, a = a + Q - 20, W = b - a - (g ? 0 : u.y) - (e.titleOffset ?
                            e.titleOffset[2] : 0) - 10);
                        if ("top" === T) g && (W = 0), e.titleOffset && e.titleOffset[0] && (W = e.titleOffset[0]), W += e.margin[0] - e.spacing[0] || 0; else if ("middle" === T) if (U === ca) W = 0 > U ? b + void 0 : b; else if (U || ca) W = 0 > U || 0 > ca ? W - Math.min(U, ca) : b - a + NaN;
                        c.group.translate(u.x, u.y + Math.floor(W));
                        !1 !== C && (c.minInput.style.marginTop = c.group.translateY + "px", c.maxInput.style.marginTop = c.group.translateY + "px");
                        c.rendered = !0
                    }
                },
                getHeight: function () {
                    var a = this.options, b = this.group, c = a.y, d = a.buttonPosition.y, e = a.inputPosition.y;
                    if (a.height) return a.height;
                    a = b ? b.getBBox(!0).height + 13 + c : 0;
                    b = Math.min(e, d);
                    if (0 > e && 0 > d || 0 < e && 0 < d) a += Math.abs(b);
                    return a
                },
                titleCollision: function (a) {
                    return !(a.options.title.text || a.options.subtitle.text)
                },
                update: function (a) {
                    var b = this.chart;
                    h(!0, b.options.rangeSelector, a);
                    this.destroy();
                    this.init(b);
                    b.rangeSelector.render()
                },
                destroy: function () {
                    var a = this, c = a.minInput, d = a.maxInput;
                    a.unMouseDown();
                    a.unResize();
                    w(a.buttons);
                    c && (c.onfocus = c.onblur = c.onchange = null);
                    d && (d.onfocus = d.onblur = d.onchange = null);
                    I(a, function (c, d) {
                        c && "chart" !==
                        d && (c.destroy ? c.destroy() : c.nodeType && b(this[d]));
                        c !== y.prototype[d] && (a[d] = null)
                    }, this)
                }
            };
            z.prototype.minFromRange = function () {
                var a = this.range, b = {month: "Month", year: "FullYear"}[a.type], c = this.max, e = this.chart.time,
                    h = function (a, c) {
                        var d = new e.Date(a), f = e.get(b, d);
                        e.set(b, d, f + c);
                        f === e.get(b, d) && e.set("Date", d, 0);
                        return d.getTime() - a
                    };
                if (F(a)) {
                    var g = c - a;
                    var k = a
                } else g = c + h(c, -a.count), this.chart && (this.chart.fixedRange = c - g);
                var q = d(this.dataMin, Number.MIN_VALUE);
                F(g) || (g = q);
                g <= q && (g = q, void 0 === k && (k =
                    h(g, a.count)), this.newMax = Math.min(g + k, this.dataMax));
                F(c) || (g = void 0);
                return g
            };
            c.RangeSelector || (u(g, "afterGetContainer", function () {
                this.options.rangeSelector.enabled && (this.rangeSelector = new y(this))
            }), u(g, "beforeRender", function () {
                var a = this.axes, b = this.rangeSelector;
                b && (F(b.deferredYTDClick) && (b.clickButton(b.deferredYTDClick), delete b.deferredYTDClick), a.forEach(function (a) {
                    a.updateNames();
                    a.setScale()
                }), this.getAxisMargins(), b.render(), a = b.options.verticalAlign, b.options.floating || ("bottom" ===
                a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0)))
            }), u(g, "update", function (a) {
                var b = a.options.rangeSelector;
                a = this.rangeSelector;
                var c = this.extraBottomMargin, d = this.extraTopMargin;
                b && b.enabled && !B(a) && (this.options.rangeSelector.enabled = !0, this.rangeSelector = new y(this));
                this.extraTopMargin = this.extraBottomMargin = !1;
                a && (a.render(), b = b && b.verticalAlign || a.options && a.options.verticalAlign, a.options.floating || ("bottom" === b ? this.extraBottomMargin = !0 : "middle" !== b && (this.extraTopMargin =
                    !0)), this.extraBottomMargin !== c || this.extraTopMargin !== d) && (this.isDirtyBox = !0)
            }), u(g, "render", function () {
                var a = this.rangeSelector;
                a && !a.options.floating && (a.render(), a = a.options.verticalAlign, "bottom" === a ? this.extraBottomMargin = !0 : "middle" !== a && (this.extraTopMargin = !0))
            }), u(g, "getMargins", function () {
                var a = this.rangeSelector;
                a && (a = a.getHeight(), this.extraTopMargin && (this.plotTop += a), this.extraBottomMargin && (this.marginBottom += a))
            }), g.prototype.callbacks.push(function (a) {
                function b() {
                    c = a.xAxis[0].getExtremes();
                    F(c.min) && d.render(c.min, c.max)
                }

                var c, d = a.rangeSelector;
                if (d) {
                    var e = u(a.xAxis[0], "afterSetExtremes", function (a) {
                        d.render(a.min, a.max)
                    });
                    var f = u(a, "redraw", b);
                    b()
                }
                u(a, "destroy", function () {
                    d && (f(), e())
                })
            }), c.RangeSelector = y)
        });
    K(B, "parts/Navigator.js", [B["parts/Globals.js"], B["parts/Utilities.js"]], function (c, g) {
        function y(a) {
            this.init(a)
        }

        var B = g.defined, F = g.erase, I = g.isArray, C = g.isNumber, A = g.splat, u = c.addEvent, z = c.Axis;
        g = c.Chart;
        var r = c.color, k = c.defaultOptions, q = c.destroyObjectProperties, w = c.extend,
            b = c.hasTouch, a = c.isTouchDevice, e = c.merge, h = c.pick, d = c.removeEvent, f = c.Scrollbar,
            n = c.Series, x = function (a) {
                for (var b = [], c = 1; c < arguments.length; c++) b[c - 1] = arguments[c];
                b = [].filter.call(b, C);
                if (b.length) return Math[a].apply(0, b)
            };
        var v = void 0 === c.seriesTypes.areaspline ? "line" : "areaspline";
        w(k, {
            navigator: {
                height: 40,
                margin: 25,
                maskInside: !0,
                handles: {
                    width: 7,
                    height: 15,
                    symbols: ["navigator-handle", "navigator-handle"],
                    enabled: !0,
                    lineWidth: 1,
                    backgroundColor: "#f2f2f2",
                    borderColor: "#999999"
                },
                maskFill: r("#6685c2").setOpacity(.3).get(),
                outlineColor: "#cccccc",
                outlineWidth: 1,
                series: {
                    type: v,
                    fillOpacity: .05,
                    lineWidth: 1,
                    compare: null,
                    dataGrouping: {
                        approximation: "average",
                        enabled: !0,
                        groupPixelWidth: 2,
                        smoothed: !0,
                        units: [["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], ["second", [1, 2, 5, 10, 15, 30]], ["minute", [1, 2, 5, 10, 15, 30]], ["hour", [1, 2, 3, 4, 6, 8, 12]], ["day", [1, 2, 3, 4]], ["week", [1, 2, 3]], ["month", [1, 3, 6]], ["year", null]]
                    },
                    dataLabels: {enabled: !1, zIndex: 2},
                    id: "highcharts-navigator-series",
                    className: "highcharts-navigator-series",
                    lineColor: null,
                    marker: {enabled: !1},
                    pointRange: 0,
                    threshold: null
                },
                xAxis: {
                    overscroll: 0,
                    className: "highcharts-navigator-xaxis",
                    tickLength: 0,
                    lineWidth: 0,
                    gridLineColor: "#e6e6e6",
                    gridLineWidth: 1,
                    tickPixelInterval: 200,
                    labels: {align: "left", style: {color: "#999999"}, x: 3, y: -4},
                    crosshair: !1
                },
                yAxis: {
                    className: "highcharts-navigator-yaxis",
                    gridLineWidth: 0,
                    startOnTick: !1,
                    endOnTick: !1,
                    minPadding: .1,
                    maxPadding: .1,
                    labels: {enabled: !1},
                    crosshair: !1,
                    title: {text: null},
                    tickLength: 0,
                    tickWidth: 0
                }
            }
        });
        c.Renderer.prototype.symbols["navigator-handle"] = function (a,
                                                                     b, c, d, e) {
            a = e.width / 2;
            b = Math.round(a / 3) + .5;
            e = e.height;
            return ["M", -a - 1, .5, "L", a, .5, "L", a, e + .5, "L", -a - 1, e + .5, "L", -a - 1, .5, "M", -b, 4, "L", -b, e - 3, "M", b - 1, 4, "L", b - 1, e - 3]
        };
        z.prototype.toFixedRange = function (a, b, c, d) {
            var e = this.chart && this.chart.fixedRange;
            a = h(c, this.translate(a, !0, !this.horiz));
            b = h(d, this.translate(b, !0, !this.horiz));
            c = e && (b - a) / e;
            .7 < c && 1.3 > c && (d ? a = b - e : b = a + e);
            C(a) && C(b) || (a = b = void 0);
            return {min: a, max: b}
        };
        y.prototype = {
            drawHandle: function (a, b, c, d) {
                var e = this.navigatorOptions.handles.height;
                this.handles[b][d](c ?
                    {
                        translateX: Math.round(this.left + this.height / 2),
                        translateY: Math.round(this.top + parseInt(a, 10) + .5 - e)
                    } : {
                        translateX: Math.round(this.left + parseInt(a, 10)),
                        translateY: Math.round(this.top + this.height / 2 - e / 2 - 1)
                    })
            }, drawOutline: function (a, b, c, d) {
                var e = this.navigatorOptions.maskInside, f = this.outline.strokeWidth(), h = f / 2;
                f = f % 2 / 2;
                var g = this.outlineHeight, l = this.scrollbarHeight, m = this.size, k = this.left - l, n = this.top;
                c ? (k -= h, c = n + b + f, b = n + a + f, a = ["M", k + g, n - l - f, "L", k + g, c, "L", k, c, "L", k, b, "L", k + g, b, "L", k + g, n + m + l].concat(e ?
                    ["M", k + g, c - h, "L", k + g, b + h] : [])) : (a += k + l - f, b += k + l - f, n += h, a = ["M", k, n, "L", a, n, "L", a, n + g, "L", b, n + g, "L", b, n, "L", k + m + 2 * l, n].concat(e ? ["M", a - h, n, "L", b + h, n] : []));
                this.outline[d]({d: a})
            }, drawMasks: function (a, b, c, d) {
                var e = this.left, f = this.top, g = this.height;
                if (c) {
                    var h = [e, e, e];
                    var l = [f, f + a, f + b];
                    var m = [g, g, g];
                    var k = [a, b - a, this.size - b]
                } else h = [e, e + a, e + b], l = [f, f, f], m = [a, b - a, this.size - b], k = [g, g, g];
                this.shades.forEach(function (a, b) {
                    a[d]({x: h[b], y: l[b], width: m[b], height: k[b]})
                })
            }, renderElements: function () {
                var a = this,
                    b = a.navigatorOptions, c = b.maskInside, d = a.chart, e = d.renderer, f,
                    g = {cursor: d.inverted ? "ns-resize" : "ew-resize"};
                a.navigatorGroup = f = e.g("navigator").attr({zIndex: 8, visibility: "hidden"}).add();
                [!c, c, !c].forEach(function (c, h) {
                    a.shades[h] = e.rect().addClass("highcharts-navigator-mask" + (1 === h ? "-inside" : "-outside")).add(f);
                    d.styledMode || a.shades[h].attr({fill: c ? b.maskFill : "rgba(0,0,0,0)"}).css(1 === h && g)
                });
                a.outline = e.path().addClass("highcharts-navigator-outline").add(f);
                d.styledMode || a.outline.attr({
                    "stroke-width": b.outlineWidth,
                    stroke: b.outlineColor
                });
                b.handles.enabled && [0, 1].forEach(function (c) {
                    b.handles.inverted = d.inverted;
                    a.handles[c] = e.symbol(b.handles.symbols[c], -b.handles.width / 2 - 1, 0, b.handles.width, b.handles.height, b.handles);
                    a.handles[c].attr({zIndex: 7 - c}).addClass("highcharts-navigator-handle highcharts-navigator-handle-" + ["left", "right"][c]).add(f);
                    if (!d.styledMode) {
                        var h = b.handles;
                        a.handles[c].attr({
                            fill: h.backgroundColor,
                            stroke: h.borderColor,
                            "stroke-width": h.lineWidth
                        }).css(g)
                    }
                })
            }, update: function (a) {
                (this.series ||
                    []).forEach(function (a) {
                    a.baseSeries && delete a.baseSeries.navigatorSeries
                });
                this.destroy();
                e(!0, this.chart.options.navigator, this.options, a);
                this.init(this.chart)
            }, render: function (a, b, d, e) {
                var f = this.chart, g = this.scrollbarHeight, l, k = this.xAxis;
                var m = k.fake ? f.xAxis[0] : k;
                var n = this.navigatorEnabled, q, t = this.rendered;
                var r = f.inverted;
                var u = f.xAxis[0].minRange, v = f.xAxis[0].options.maxRange;
                if (!this.hasDragged || B(d)) {
                    if (!C(a) || !C(b)) if (t) d = 0, e = h(k.width, m.width); else return;
                    this.left = h(k.left, f.plotLeft +
                        g + (r ? f.plotWidth : 0));
                    this.size = q = l = h(k.len, (r ? f.plotHeight : f.plotWidth) - 2 * g);
                    f = r ? g : l + 2 * g;
                    d = h(d, k.toPixels(a, !0));
                    e = h(e, k.toPixels(b, !0));
                    C(d) && Infinity !== Math.abs(d) || (d = 0, e = f);
                    a = k.toValue(d, !0);
                    b = k.toValue(e, !0);
                    var w = Math.abs(c.correctFloat(b - a));
                    w < u ? this.grabbedLeft ? d = k.toPixels(b - u, !0) : this.grabbedRight && (e = k.toPixels(a + u, !0)) : B(v) && w > v && (this.grabbedLeft ? d = k.toPixels(b - v, !0) : this.grabbedRight && (e = k.toPixels(a + v, !0)));
                    this.zoomedMax = Math.min(Math.max(d, e, 0), q);
                    this.zoomedMin = Math.min(Math.max(this.fixedWidth ?
                        this.zoomedMax - this.fixedWidth : Math.min(d, e), 0), q);
                    this.range = this.zoomedMax - this.zoomedMin;
                    q = Math.round(this.zoomedMax);
                    d = Math.round(this.zoomedMin);
                    n && (this.navigatorGroup.attr({visibility: "visible"}), t = t && !this.hasDragged ? "animate" : "attr", this.drawMasks(d, q, r, t), this.drawOutline(d, q, r, t), this.navigatorOptions.handles.enabled && (this.drawHandle(d, 0, r, t), this.drawHandle(q, 1, r, t)));
                    this.scrollbar && (r ? (r = this.top - g, m = this.left - g + (n || !m.opposite ? 0 : (m.titleOffset || 0) + m.axisTitleMargin), g = l + 2 * g) : (r = this.top +
                        (n ? this.height : -g), m = this.left - g), this.scrollbar.position(m, r, f, g), this.scrollbar.setRange(this.zoomedMin / (l || 1), this.zoomedMax / (l || 1)));
                    this.rendered = !0
                }
            }, addMouseEvents: function () {
                var a = this, c = a.chart, d = c.container, e = [], f, g;
                a.mouseMoveHandler = f = function (b) {
                    a.onMouseMove(b)
                };
                a.mouseUpHandler = g = function (b) {
                    a.onMouseUp(b)
                };
                e = a.getPartsEvents("mousedown");
                e.push(u(d, "mousemove", f), u(d.ownerDocument, "mouseup", g));
                b && (e.push(u(d, "touchmove", f), u(d.ownerDocument, "touchend", g)), e.concat(a.getPartsEvents("touchstart")));
                a.eventsToUnbind = e;
                a.series && a.series[0] && e.push(u(a.series[0].xAxis, "foundExtremes", function () {
                    c.navigator.modifyNavigatorAxisExtremes()
                }))
            }, getPartsEvents: function (a) {
                var b = this, c = [];
                ["shades", "handles"].forEach(function (d) {
                    b[d].forEach(function (e, f) {
                        c.push(u(e.element, a, function (a) {
                            b[d + "Mousedown"](a, f)
                        }))
                    })
                });
                return c
            }, shadesMousedown: function (a, b) {
                a = this.chart.pointer.normalize(a);
                var c = this.chart, d = this.xAxis, e = this.zoomedMin, f = this.left, g = this.size, h = this.range,
                    l = a.chartX;
                c.inverted && (l = a.chartY,
                    f = this.top);
                if (1 === b) this.grabbedCenter = l, this.fixedWidth = h, this.dragOffset = l - e; else {
                    a = l - f - h / 2;
                    if (0 === b) a = Math.max(0, a); else if (2 === b && a + h >= g) if (a = g - h, this.reversedExtremes) {
                        a -= h;
                        var k = this.getUnionExtremes().dataMin
                    } else var m = this.getUnionExtremes().dataMax;
                    a !== e && (this.fixedWidth = h, b = d.toFixedRange(a, a + h, k, m), B(b.min) && c.xAxis[0].setExtremes(Math.min(b.min, b.max), Math.max(b.min, b.max), !0, null, {trigger: "navigator"}))
                }
            }, handlesMousedown: function (a, b) {
                this.chart.pointer.normalize(a);
                a = this.chart;
                var c = a.xAxis[0], d = this.reversedExtremes;
                0 === b ? (this.grabbedLeft = !0, this.otherHandlePos = this.zoomedMax, this.fixedExtreme = d ? c.min : c.max) : (this.grabbedRight = !0, this.otherHandlePos = this.zoomedMin, this.fixedExtreme = d ? c.max : c.min);
                a.fixedRange = null
            }, onMouseMove: function (b) {
                var d = this, e = d.chart, f = d.left, g = d.navigatorSize, k = d.range, m = d.dragOffset,
                    n = e.inverted;
                b.touches && 0 === b.touches[0].pageX || (b = e.pointer.normalize(b), e = b.chartX, n && (f = d.top, e = b.chartY), d.grabbedLeft ? (d.hasDragged = !0, d.render(0, 0, e - f, d.otherHandlePos)) :
                    d.grabbedRight ? (d.hasDragged = !0, d.render(0, 0, d.otherHandlePos, e - f)) : d.grabbedCenter && (d.hasDragged = !0, e < m ? e = m : e > g + m - k && (e = g + m - k), d.render(0, 0, e - m, e - m + k)), d.hasDragged && d.scrollbar && h(d.scrollbar.options.liveRedraw, c.svg && !a && !this.chart.isBoosting) && (b.DOMType = b.type, setTimeout(function () {
                    d.onMouseUp(b)
                }, 0)))
            }, onMouseUp: function (a) {
                var b = this.chart, c = this.xAxis, d = this.scrollbar, e = a.DOMEvent || a;
                if (this.hasDragged && (!d || !d.hasDragged) || "scrollbar" === a.trigger) {
                    d = this.getUnionExtremes();
                    if (this.zoomedMin ===
                        this.otherHandlePos) var f = this.fixedExtreme; else if (this.zoomedMax === this.otherHandlePos) var g = this.fixedExtreme;
                    this.zoomedMax === this.size && (g = this.reversedExtremes ? d.dataMin : d.dataMax);
                    0 === this.zoomedMin && (f = this.reversedExtremes ? d.dataMax : d.dataMin);
                    c = c.toFixedRange(this.zoomedMin, this.zoomedMax, f, g);
                    B(c.min) && b.xAxis[0].setExtremes(Math.min(c.min, c.max), Math.max(c.min, c.max), !0, this.hasDragged ? !1 : null, {
                        trigger: "navigator",
                        triggerOp: "navigator-drag",
                        DOMEvent: e
                    })
                }
                "mousemove" !== a.DOMType && (this.grabbedLeft =
                    this.grabbedRight = this.grabbedCenter = this.fixedWidth = this.fixedExtreme = this.otherHandlePos = this.hasDragged = this.dragOffset = null)
            }, removeEvents: function () {
                this.eventsToUnbind && (this.eventsToUnbind.forEach(function (a) {
                    a()
                }), this.eventsToUnbind = void 0);
                this.removeBaseSeriesEvents()
            }, removeBaseSeriesEvents: function () {
                var a = this.baseSeries || [];
                this.navigatorEnabled && a[0] && (!1 !== this.navigatorOptions.adaptToUpdatedData && a.forEach(function (a) {
                    d(a, "updatedData", this.updatedDataHandler)
                }, this), a[0].xAxis &&
                d(a[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes))
            }, init: function (a) {
                var b = a.options, c = b.navigator, d = c.enabled, g = b.scrollbar, k = g.enabled;
                b = d ? c.height : 0;
                var m = k ? g.height : 0;
                this.handles = [];
                this.shades = [];
                this.chart = a;
                this.setBaseSeries();
                this.height = b;
                this.scrollbarHeight = m;
                this.scrollbarEnabled = k;
                this.navigatorEnabled = d;
                this.navigatorOptions = c;
                this.scrollbarOptions = g;
                this.outlineHeight = b + m;
                this.opposite = h(c.opposite, !d && a.inverted);
                var n = this;
                d = n.baseSeries;
                g = a.xAxis.length;
                k = a.yAxis.length;
                var q = d && d[0] && d[0].xAxis || a.xAxis[0] || {options: {}};
                a.isDirtyBox = !0;
                n.navigatorEnabled ? (n.xAxis = new z(a, e({
                    breaks: q.options.breaks,
                    ordinal: q.options.ordinal
                }, c.xAxis, {
                    id: "navigator-x-axis",
                    yAxis: "navigator-y-axis",
                    isX: !0,
                    type: "datetime",
                    index: g,
                    isInternal: !0,
                    offset: 0,
                    keepOrdinalPadding: !0,
                    startOnTick: !1,
                    endOnTick: !1,
                    minPadding: 0,
                    maxPadding: 0,
                    zoomEnabled: !1
                }, a.inverted ? {offsets: [m, 0, -m, 0], width: b} : {
                    offsets: [0, -m, 0, m],
                    height: b
                })), n.yAxis = new z(a, e(c.yAxis, {
                    id: "navigator-y-axis", alignTicks: !1, offset: 0,
                    index: k, isInternal: !0, zoomEnabled: !1
                }, a.inverted ? {width: b} : {height: b})), d || c.series.data ? n.updateNavigatorSeries(!1) : 0 === a.series.length && (n.unbindRedraw = u(a, "beforeRedraw", function () {
                    0 < a.series.length && !n.series && (n.setBaseSeries(), n.unbindRedraw())
                })), n.reversedExtremes = a.inverted && !n.xAxis.reversed || !a.inverted && n.xAxis.reversed, n.renderElements(), n.addMouseEvents()) : n.xAxis = {
                    translate: function (b, c) {
                        var d = a.xAxis[0], e = d.getExtremes(), f = d.len - 2 * m,
                            g = x("min", d.options.min, e.dataMin);
                        d = x("max", d.options.max,
                            e.dataMax) - g;
                        return c ? b * d / f + g : f * (b - g) / d
                    }, toPixels: function (a) {
                        return this.translate(a)
                    }, toValue: function (a) {
                        return this.translate(a, !0)
                    }, toFixedRange: z.prototype.toFixedRange, fake: !0
                };
                a.options.scrollbar.enabled && (a.scrollbar = n.scrollbar = new f(a.renderer, e(a.options.scrollbar, {
                    margin: n.navigatorEnabled ? 0 : 10,
                    vertical: a.inverted
                }), a), u(n.scrollbar, "changed", function (b) {
                    var c = n.size, d = c * this.to;
                    c *= this.from;
                    n.hasDragged = n.scrollbar.hasDragged;
                    n.render(0, 0, c, d);
                    (a.options.scrollbar.liveRedraw || "mousemove" !==
                        b.DOMType && "touchmove" !== b.DOMType) && setTimeout(function () {
                        n.onMouseUp(b)
                    })
                }));
                n.addBaseSeriesEvents();
                n.addChartEvents()
            }, getUnionExtremes: function (a) {
                var b = this.chart.xAxis[0], c = this.xAxis, d = c.options, e = b.options, f;
                a && null === b.dataMin || (f = {
                    dataMin: h(d && d.min, x("min", e.min, b.dataMin, c.dataMin, c.min)),
                    dataMax: h(d && d.max, x("max", e.max, b.dataMax, c.dataMax, c.max))
                });
                return f
            }, setBaseSeries: function (a, b) {
                var d = this.chart, e = this.baseSeries = [];
                a = a || d.options && d.options.navigator.baseSeries || (d.series.length ?
                    c.find(d.series, function (a) {
                        return !a.options.isInternal
                    }).index : 0);
                (d.series || []).forEach(function (b, c) {
                    b.options.isInternal || !b.options.showInNavigator && (c !== a && b.options.id !== a || !1 === b.options.showInNavigator) || e.push(b)
                });
                this.xAxis && !this.xAxis.fake && this.updateNavigatorSeries(!0, b)
            }, updateNavigatorSeries: function (a, b) {
                var c = this, f = c.chart, g = c.baseSeries, h, l, m = c.navigatorOptions.series, n, q = {
                    enableMouseTracking: !1,
                    index: null,
                    linkedTo: null,
                    group: "nav",
                    padXAxis: !1,
                    xAxis: "navigator-x-axis",
                    yAxis: "navigator-y-axis",
                    showInLegend: !1,
                    stacking: !1,
                    isInternal: !0,
                    states: {inactive: {opacity: 1}}
                }, r = c.series = (c.series || []).filter(function (a) {
                    var b = a.baseSeries;
                    return 0 > g.indexOf(b) ? (b && (d(b, "updatedData", c.updatedDataHandler), delete b.navigatorSeries), a.chart && a.destroy(), !1) : !0
                });
                g && g.length && g.forEach(function (a) {
                    var d = a.navigatorSeries,
                        p = w({color: a.color, visible: a.visible}, I(m) ? k.navigator.series : m);
                    d && !1 === c.navigatorOptions.adaptToUpdatedData || (q.name = "Navigator " + g.length, h = a.options || {}, n = h.navigatorOptions || {},
                        l = e(h, q, p, n), p = n.data || p.data, c.hasNavigatorData = c.hasNavigatorData || !!p, l.data = p || h.data && h.data.slice(0), d && d.options ? d.update(l, b) : (a.navigatorSeries = f.initSeries(l), a.navigatorSeries.baseSeries = a, r.push(a.navigatorSeries)))
                });
                if (m.data && (!g || !g.length) || I(m)) c.hasNavigatorData = !1, m = A(m), m.forEach(function (a, b) {
                    q.name = "Navigator " + (r.length + 1);
                    l = e(k.navigator.series, {color: f.series[b] && !f.series[b].options.isInternal && f.series[b].color || f.options.colors[b] || f.options.colors[0]}, q, a);
                    l.data = a.data;
                    l.data && (c.hasNavigatorData = !0, r.push(f.initSeries(l)))
                });
                a && this.addBaseSeriesEvents()
            }, addBaseSeriesEvents: function () {
                var a = this, b = a.baseSeries || [];
                b[0] && b[0].xAxis && u(b[0].xAxis, "foundExtremes", this.modifyBaseAxisExtremes);
                b.forEach(function (b) {
                    u(b, "show", function () {
                        this.navigatorSeries && this.navigatorSeries.setVisible(!0, !1)
                    });
                    u(b, "hide", function () {
                        this.navigatorSeries && this.navigatorSeries.setVisible(!1, !1)
                    });
                    !1 !== this.navigatorOptions.adaptToUpdatedData && b.xAxis && u(b, "updatedData", this.updatedDataHandler);
                    u(b, "remove", function () {
                        this.navigatorSeries && (F(a.series, this.navigatorSeries), B(this.navigatorSeries.options) && this.navigatorSeries.remove(!1), delete this.navigatorSeries)
                    })
                }, this)
            }, getBaseSeriesMin: function (a) {
                return this.baseSeries.reduce(function (a, b) {
                    return Math.min(a, b.xData ? b.xData[0] : a)
                }, a)
            }, modifyNavigatorAxisExtremes: function () {
                var a = this.xAxis, b;
                a.getExtremes && (!(b = this.getUnionExtremes(!0)) || b.dataMin === a.min && b.dataMax === a.max || (a.min = b.dataMin, a.max = b.dataMax))
            }, modifyBaseAxisExtremes: function () {
                var a =
                    this.chart.navigator, b = this.getExtremes(), c = b.dataMin, d = b.dataMax;
                b = b.max - b.min;
                var e = a.stickToMin, f = a.stickToMax, g = h(this.options.overscroll, 0), k = a.series && a.series[0],
                    n = !!this.setExtremes;
                if (!this.eventArgs || "rangeSelectorButton" !== this.eventArgs.trigger) {
                    if (e) {
                        var q = c;
                        var r = q + b
                    }
                    f && (r = d + g, e || (q = Math.max(r - b, a.getBaseSeriesMin(k && k.xData ? k.xData[0] : -Number.MAX_VALUE))));
                    n && (e || f) && C(q) && (this.min = this.userMin = q, this.max = this.userMax = r)
                }
                a.stickToMin = a.stickToMax = null
            }, updatedDataHandler: function () {
                var a =
                    this.chart.navigator, b = this.navigatorSeries, c = a.getBaseSeriesMin(this.xData[0]);
                a.stickToMax = a.reversedExtremes ? 0 === Math.round(a.zoomedMin) : Math.round(a.zoomedMax) >= Math.round(a.size);
                a.stickToMin = C(this.xAxis.min) && this.xAxis.min <= c && (!this.chart.fixedRange || !a.stickToMax);
                b && !a.hasNavigatorData && (b.options.pointStart = this.xData[0], b.setData(this.options.data, !1, null, !1))
            }, addChartEvents: function () {
                this.eventsToUnbind || (this.eventsToUnbind = []);
                this.eventsToUnbind.push(u(this.chart, "redraw", function () {
                    var a =
                            this.navigator,
                        b = a && (a.baseSeries && a.baseSeries[0] && a.baseSeries[0].xAxis || a.scrollbar && this.xAxis[0]);
                    b && a.render(b.min, b.max)
                }), u(this.chart, "getMargins", function () {
                    var a = this.navigator, b = a.opposite ? "plotTop" : "marginBottom";
                    this.inverted && (b = a.opposite ? "marginRight" : "plotLeft");
                    this[b] = (this[b] || 0) + (a.navigatorEnabled || !this.inverted ? a.outlineHeight : 0) + a.navigatorOptions.margin
                }))
            }, destroy: function () {
                this.removeEvents();
                this.xAxis && (F(this.chart.xAxis, this.xAxis), F(this.chart.axes, this.xAxis));
                this.yAxis && (F(this.chart.yAxis, this.yAxis), F(this.chart.axes, this.yAxis));
                (this.series || []).forEach(function (a) {
                    a.destroy && a.destroy()
                });
                "series xAxis yAxis shades outline scrollbarTrack scrollbarRifles scrollbarGroup scrollbar navigatorGroup rendered".split(" ").forEach(function (a) {
                    this[a] && this[a].destroy && this[a].destroy();
                    this[a] = null
                }, this);
                [this.handles].forEach(function (a) {
                    q(a)
                }, this)
            }
        };
        c.Navigator || (c.Navigator = y, u(z, "zoom", function (b) {
            var c = this.chart.options, d = c.chart.zoomType, e = c.chart.pinchType,
                f = c.navigator;
            c = c.rangeSelector;
            this.isXAxis && (f && f.enabled || c && c.enabled) && ("y" === d ? b.zoomed = !1 : (!a && "xy" === d || a && "xy" === e) && this.options.range && (d = this.previousZoom, B(b.newMin) ? this.previousZoom = [this.min, this.max] : d && (b.newMin = d[0], b.newMax = d[1], delete this.previousZoom)));
            void 0 !== b.zoomed && b.preventDefault()
        }), u(g, "beforeShowResetZoom", function () {
            var b = this.options, c = b.navigator, d = b.rangeSelector;
            if ((c && c.enabled || d && d.enabled) && (!a && "x" === b.chart.zoomType || a && "x" === b.chart.pinchType)) return !1
        }),
            u(g, "beforeRender", function () {
                var a = this.options;
                if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = this.navigator = new y(this)
            }), u(g, "afterSetChartSize", function () {
            var a = this.legend, b = this.navigator;
            if (b) {
                var c = a && a.options;
                var d = b.xAxis;
                var e = b.yAxis;
                var f = b.scrollbarHeight;
                this.inverted ? (b.left = b.opposite ? this.chartWidth - f - b.height : this.spacing[3] + f, b.top = this.plotTop + f) : (b.left = this.plotLeft + f, b.top = b.navigatorOptions.top || this.chartHeight - b.height - f - this.spacing[2] - (this.rangeSelector &&
                this.extraBottomMargin ? this.rangeSelector.getHeight() : 0) - (c && "bottom" === c.verticalAlign && c.enabled && !c.floating ? a.legendHeight + h(c.margin, 10) : 0) - (this.titleOffset ? this.titleOffset[2] : 0));
                d && e && (this.inverted ? d.options.left = e.options.left = b.left : d.options.top = e.options.top = b.top, d.setAxisSize(), e.setAxisSize())
            }
        }), u(g, "update", function (a) {
            var b = a.options.navigator || {}, c = a.options.scrollbar || {};
            this.navigator || this.scroller || !b.enabled && !c.enabled || (e(!0, this.options.navigator, b), e(!0, this.options.scrollbar,
                c), delete a.options.navigator, delete a.options.scrollbar)
        }), u(g, "afterUpdate", function (a) {
            this.navigator || this.scroller || !this.options.navigator.enabled && !this.options.scrollbar.enabled || (this.scroller = this.navigator = new y(this), h(a.redraw, !0) && this.redraw(a.animation))
        }), u(g, "afterAddSeries", function () {
            this.navigator && this.navigator.setBaseSeries(null, !1)
        }), u(n, "afterUpdate", function () {
            this.chart.navigator && !this.options.isInternal && this.chart.navigator.setBaseSeries(null, !1)
        }), g.prototype.callbacks.push(function (a) {
            var b =
                a.navigator;
            b && a.xAxis[0] && (a = a.xAxis[0].getExtremes(), b.render(a.min, a.max))
        }))
    });
    K(B, "masters/modules/gantt.src.js", [], function () {
    });
    K(B, "masters/highcharts-gantt.src.js", [B["masters/highcharts.src.js"]], function (c) {
        c.product = "Highcharts Gantt";
        return c
    });
    B["masters/highcharts-gantt.src.js"]._modules = B;
    return B["masters/highcharts-gantt.src.js"]
});
//# sourceMappingURL=highcharts-gantt.js.map
